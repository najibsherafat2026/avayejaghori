import {check,editor,fromPost,makeSlug,kinds} from './model.mjs';
const one=async (db,sql,params=[]) => (await db.query(sql,params)).rows[0];
const detail=`SELECT p.*,w.payload,w.state,w.note,w.version,f.attachment AS live_file,
  p.updated_at::text || '|' || COALESCE(w.version::text,'0') AS token
  FROM posts p LEFT JOIN avaye_work w ON w.post_id=p.id
  LEFT JOIN avaye_public_files f ON f.post_id=p.id`;
export async function getWork(db,id,user,lock=false) {
  if(lock)await db.query('SELECT id FROM posts WHERE id=$1 FOR UPDATE',[id]);
  const row=await one(db,detail+' WHERE p.id=$1',[id]);
  check(row&&(editor(user)||row.owner_id===user?.id),404,'مطلب پیدا نشد.');
  return row;
}
export async function topics(db) {
  return (await db.query('SELECT title FROM avaye_topics UNION SELECT DISTINCT category AS title FROM posts WHERE status=$1 ORDER BY title',['published'])).rows.map(x=>x.title);
}
export async function desk(db,user) {
  return (await db.query(`SELECT p.id,COALESCE(w.payload->>'title',p.title) AS title,COALESCE(w.state,p.status) AS state
    FROM posts p LEFT JOIN avaye_work w ON w.post_id=p.id
    WHERE $1 OR p.owner_id=$2 ORDER BY COALESCE(w.updated_at,p.updated_at) DESC,p.id DESC`,[editor(user),user.id])).rows;
}
export async function catalogue(db,q,category,page) {
  const rows=await db.query(`SELECT slug,title,excerpt,category,author_name,published_at,kind FROM posts
    WHERE status='published' AND ($1='' OR category=$1)
    AND ($2='' OR position($2 IN regexp_replace(translate(concat_ws(' ',title,author_name,excerpt,body,array_to_string(tags,' ')),'يك','یک'),'[[:space:]‌]+',' ','g'))>0)
    ORDER BY published_at DESC NULLS LAST,id DESC LIMIT 25 OFFSET $3`,[category,q,(page-1)*24]);
  return rows.rows;
}
export async function getPublic(db,slug) {
  const p=await one(db,`SELECT p.id,p.slug,p.title,p.body,p.excerpt,p.category,p.kind,p.author_name,p.author_role,
    p.tags,p.sources,p.published_at,p.updated_at,p.cover_key,f.attachment AS live_file
    FROM posts p LEFT JOIN avaye_public_files f ON f.post_id=p.id WHERE slug=$1 AND status='published'`,[slug]);
  check(p,404,'مطلب منتشرشده پیدا نشد.');return p;
}
function verifyToken(row,token){check(row.token===token,409,'نسخهٔ دیگری ذخیره شده است. صفحهٔ ویرایش را دوباره باز کنید.');}
async function syncPost(db,id,d,state,note) {
  await db.query(`UPDATE posts SET title=$2,excerpt=$3,body=$4,category=$5,kind=$6,author_name=$7,author_role=$8,
    tags=$9,sources=$10,status=$11,review_note=$12,updated_at=now(),
    published_at=CASE WHEN $11='published' THEN COALESCE(published_at,now()) ELSE published_at END WHERE id=$1`,
    [id,d.title,d.excerpt,d.body,d.category,d.kind,d.author_name,d.author_role,d.tags,d.sources,state,note]);
}
async function writeWork(db,id,d,state,note) {
  await db.query(`INSERT INTO avaye_work(post_id,version,payload,state,note) VALUES($1,1,$2::jsonb,$3,$4)
    ON CONFLICT(post_id) DO UPDATE SET version=avaye_work.version+1,payload=excluded.payload,state=excluded.state,note=excluded.note,updated_at=now()`,
    [id,JSON.stringify(d),state,note]);
}
export async function save(db,user,id,token,d,action,uploaded,remove) {
  check(['draft','submit'].includes(action),400,'عملیات ناشناخته است.');
  if(!id){
    check(/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(token),400,'فرم تازهٔ نوشتن را باز کنید.');
    await db.query('INSERT INTO avaye_create_requests(owner_id,request_id) VALUES($1,$2) ON CONFLICT DO NOTHING',[user.id,token]);
    const previous=await one(db,'SELECT post_id FROM avaye_create_requests WHERE owner_id=$1 AND request_id=$2 FOR UPDATE',[user.id,token]);
    if(previous.post_id)return previous.post_id;
  }
  let row=null;
  if(id){row=await getWork(db,id,user,true);verifyToken(row,token);}
  const existing=row?.payload??(row?fromPost(row):{});
  check(Object.hasOwn(kinds,d.kind)||existing.kind===d.kind,400,'نوع مطلب معتبر نیست.');
  const currentTopics=await topics(db);
  check(currentTopics.includes(d.category)||existing.category===d.category,400,'موضوع را از فهرست انتخاب کنید.');
  d.attachment=uploaded?.meta??(remove?null:existing.attachment??null);
  if(action==='submit')check(d.rights&&(d.body||d.attachment),400,'برای ارسال، متن یا پیوست و تأیید اجازهٔ انتشار لازم است.');
  const state=action==='submit'?'review':'draft';
  if(!id){
    const p=await one(db,`INSERT INTO posts(slug,title,category,author_name,owner_id,owner_email) VALUES($1,$2,$3,$4,$5,$6) RETURNING id`,
      [makeSlug(d.title),d.title,d.category,d.author_name,user.id,user.email??'']);id=p.id;
    await db.query('UPDATE avaye_create_requests SET post_id=$3 WHERE owner_id=$1 AND request_id=$2',[user.id,token,id]);
  }
  if(uploaded)await db.query('INSERT INTO avaye_uploads(key,post_id,bytes) VALUES($1,$2,$3)',[uploaded.meta.key,id,Buffer.from(uploaded.bytes)]);
  if(row?.status!=='published')await syncPost(db,id,d,state,'');
  await writeWork(db,id,d,state,'');await discardUnusedFiles(db,id);return id;
}
export async function moderate(db,user,id,token,action,note) {
  check(editor(user),403,'این کار به اجازهٔ ویراستار نیاز دارد.');
  const row=await getWork(db,id,user,true);verifyToken(row,token);
  check(['approve','return'].includes(action)&&(row.state??row.status)==='review',409,'این نسخه در صف بررسی نیست.');
  const d=row.payload??fromPost(row);
  if(action==='approve'){
    check(d.rights&&(d.body||d.attachment),400,'نویسنده باید اجازهٔ انتشار این نسخه را ثبت کند.');
    await syncPost(db,id,d,'published','');
    if(d.attachment)await db.query(`INSERT INTO avaye_public_files(post_id,attachment) VALUES($1,$2::jsonb)
      ON CONFLICT(post_id) DO UPDATE SET attachment=excluded.attachment`,[id,JSON.stringify(d.attachment)]);
    else await db.query('DELETE FROM avaye_public_files WHERE post_id=$1',[id]);
    await writeWork(db,id,d,'published','');await discardUnusedFiles(db,id);
  } else {
    check(note,400,'دلیل درخواست اصلاح را بنویسید.');
    if(row.status!=='published')await syncPost(db,id,d,'rejected',note);
    await writeWork(db,id,d,'rejected',note);
  }
}

async function discardUnusedFiles(db,id) {
  await db.query(`DELETE FROM avaye_uploads u WHERE u.post_id=$1
    AND NOT EXISTS (SELECT 1 FROM avaye_public_files f WHERE f.post_id=u.post_id AND f.attachment->>'key'=u.key::text)
    AND NOT EXISTS (SELECT 1 FROM avaye_work w WHERE w.post_id=u.post_id AND w.payload->'attachment'->>'key'=u.key::text)`,[id]);
}
export async function download(db,row,meta) {
  check(meta,404,'این نسخه پیوست ندارد.');
  const file=await one(db,'SELECT bytes FROM avaye_uploads WHERE post_id=$1 AND key=$2',[row.id,meta.key]);
  check(file,404,'فایل پیدا نشد.');
  return new Response(new Uint8Array(file.bytes),{headers:{'Content-Type':meta.type,'X-Content-Type-Options':'nosniff',
    'Cache-Control':'private, no-store','Content-Security-Policy':"sandbox; default-src 'none'",
    'Content-Disposition':"attachment; filename*=UTF-8''"+encodeURIComponent(meta.name)}});
}
