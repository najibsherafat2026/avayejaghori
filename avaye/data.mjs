import { check, editor, fromPost, makeSlug, kinds, norm } from './model.mjs';

const one = async (db, sql, params = []) => (await db.query(sql, params)).rows[0];
const detail = `SELECT p.*, w.payload, w.state, w.note, w.version, f.attachment AS live_file,
  p.updated_at::text || '|' || COALESCE(w.version::text,'0') AS token
  FROM posts p LEFT JOIN avaye_work w ON w.post_id=p.id
  LEFT JOIN avaye_public_files f ON f.post_id=p.id`;

export async function getWork(db, id, user, lock = false) {
  if (lock) await db.query('SELECT id FROM posts WHERE id=$1 FOR UPDATE', [id]);
  const row = await one(db, detail + ' WHERE p.id=$1', [id]);
  check(row && (editor(user) || row.owner_id === user?.id), 404, 'مطلب پیدا نشد.');
  return row;
}
export async function getPublic(db, slug) {
  const row = await one(db, `SELECT p.*, f.attachment AS live_file FROM posts p
    LEFT JOIN avaye_public_files f ON f.post_id=p.id WHERE p.slug=$1 AND p.status='published'`, [slug]);
  check(row, 404, 'مطلب منتشرشده پیدا نشد.'); return row;
}
export async function topics(db) {
  return (await db.query(`SELECT title FROM avaye_topics UNION
    SELECT DISTINCT category AS title FROM posts WHERE status='published' ORDER BY title`)).rows.map(row => row.title);
}
export async function desk(db, user) {
  return (await db.query(`SELECT p.id, p.slug, COALESCE(w.payload->>'title',p.title) AS title,
    COALESCE(w.state,p.status) AS state, p.status, p.owner_id
    FROM posts p LEFT JOIN avaye_work w ON w.post_id=p.id
    WHERE $1 OR p.owner_id=$2 ORDER BY COALESCE(w.updated_at,p.updated_at) DESC,p.id DESC`, [editor(user), user.id])).rows;
}
export async function catalogue(db, query, category, page) {
  const rows = await db.query(`SELECT slug,title,excerpt,category,author_name,published_at,kind,cover_key FROM posts
    WHERE status='published' AND ($1='' OR category=$1)
    AND ($2='' OR position($2 IN regexp_replace(translate(concat_ws(' ',title,author_name,excerpt,body,array_to_string(tags,' ')),'يك','یک'),'[[:space:]‌]+',' ','g'))>0)
    ORDER BY published_at DESC NULLS LAST,id DESC LIMIT 25 OFFSET $3`, [category, query, (page - 1) * 24]);
  return rows.rows;
}

async function syncPost(db, id, data, status, note = '') {
  await db.query(`UPDATE posts SET title=$2,excerpt=$3,body=$4,category=$5,kind=$6,author_name=$7,author_role=$8,
    tags=$9,sources=$10,status=$11,review_note=$12,cover_key=$13,updated_at=now(),
    published_at=CASE WHEN $11='published' THEN COALESCE(published_at,now()) ELSE published_at END WHERE id=$1`,
  [id,data.title,data.excerpt,data.body,data.category,data.kind,data.author_name,data.author_role,
    data.tags,data.sources,status,note,data.cover?.key ?? null]);
}
async function writeWork(db, id, data, state, note = '') {
  await db.query(`INSERT INTO avaye_work(post_id,version,payload,state,note) VALUES($1,1,$2::jsonb,$3,$4)
    ON CONFLICT(post_id) DO UPDATE SET version=avaye_work.version+1,payload=excluded.payload,state=excluded.state,note=excluded.note,updated_at=now()`,
  [id, JSON.stringify(data), state, note]);
}
function verifyToken(row, token) { check(row.token === token, 409, 'نسخهٔ دیگری ذخیره شده است؛ صفحه را دوباره باز کنید.'); }
async function storeUpload(db, id, uploaded) {
  if (uploaded) await db.query('INSERT INTO avaye_uploads(key,post_id,bytes) VALUES($1,$2,$3)',
    [uploaded.meta.key, id, Buffer.from(uploaded.bytes)]);
}

export async function save(db, user, id, token, data, action, attachment, cover, removeAttachment, removeCover) {
  check(['draft','submit','publish'].includes(action), 400, 'عملیات ناشناخته است.');
  if (action === 'publish') check(editor(user), 403, 'انتشار فقط برای ویراستار مجاز است.');
  if (!id) {
    check(/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(token), 400, 'فرم تازه را دوباره باز کنید.');
    await db.query('INSERT INTO avaye_create_requests(owner_id,request_id) VALUES($1,$2) ON CONFLICT DO NOTHING', [user.id, token]);
    const previous = await one(db, 'SELECT post_id FROM avaye_create_requests WHERE owner_id=$1 AND request_id=$2 FOR UPDATE', [user.id, token]);
    if (previous.post_id) id = previous.post_id;
  }
  let row = null;
  if (id) { row = await getWork(db, id, user, true); verifyToken(row, token); }
  const existing = row?.payload ?? (row ? fromPost(row) : {});
  check(Object.hasOwn(kinds, data.kind) || existing.kind === data.kind, 400, 'نوع مطلب معتبر نیست.');
  const allTopics = await topics(db);
  check(allTopics.includes(data.category) || existing.category === data.category, 400, 'موضوع را از فهرست انتخاب کنید.');
  data.attachment = attachment?.meta ?? (removeAttachment ? null : existing.attachment ?? null);
  data.cover = cover?.meta ?? (removeCover ? null : existing.cover ?? null);
  if (action !== 'draft') check(data.rights && (data.body || data.attachment), 400, 'برای انتشار، متن یا پیوست و تأیید اجازهٔ نشر لازم است.');

  if (!id) {
    const created = await one(db, `INSERT INTO posts(slug,title,category,author_name,owner_id,owner_email)
      VALUES($1,$2,$3,$4,$5,$6) RETURNING id`, [makeSlug(data.title),data.title,data.category,data.author_name,user.id,user.email ?? '']);
    id = created.id;
    await db.query('UPDATE avaye_create_requests SET post_id=$3 WHERE owner_id=$1 AND request_id=$2', [user.id,token,id]);
  }
  await storeUpload(db, id, attachment); await storeUpload(db, id, cover);
  if (action === 'publish') {
    await syncPost(db, id, data, 'published');
    if (data.attachment) await db.query(`INSERT INTO avaye_public_files(post_id,attachment) VALUES($1,$2::jsonb)
      ON CONFLICT(post_id) DO UPDATE SET attachment=excluded.attachment`, [id,JSON.stringify(data.attachment)]);
    else await db.query('DELETE FROM avaye_public_files WHERE post_id=$1', [id]);
    await writeWork(db,id,data,'published');
  } else {
    const state = action === 'submit' ? 'review' : 'draft';
    if (row?.status !== 'published') await syncPost(db,id,data,state);
    await writeWork(db,id,data,state);
  }
  await discardUnusedFiles(db,id);
  return id;
}
export async function moderate(db, user, id, token, action, note) {
  check(editor(user), 403, 'این کار به اجازهٔ ویراستار نیاز دارد.');
  const row = await getWork(db,id,user,true); verifyToken(row,token);
  check(['approve','return'].includes(action) && (row.state ?? row.status) === 'review',409,'این نسخه در صف بررسی نیست.');
  const data = row.payload ?? fromPost(row);
  if (action === 'approve') {
    check(data.rights && (data.body || data.attachment),400,'اجازهٔ نشر و متن یا پیوست لازم است.');
    await syncPost(db,id,data,'published');
    if (data.attachment) await db.query(`INSERT INTO avaye_public_files(post_id,attachment) VALUES($1,$2::jsonb)
      ON CONFLICT(post_id) DO UPDATE SET attachment=excluded.attachment`,[id,JSON.stringify(data.attachment)]);
    else await db.query('DELETE FROM avaye_public_files WHERE post_id=$1',[id]);
    await writeWork(db,id,data,'published');
  } else {
    check(note,400,'دلیل درخواست اصلاح را بنویسید.');
    if (row.status !== 'published') await syncPost(db,id,data,'review',note);
    await writeWork(db,id,data,'rejected',note);
  }
  await discardUnusedFiles(db,id);
}
export async function unpublish(db, user, id) {
  check(editor(user),403,'خروج از انتشار فقط برای ویراستار مجاز است.');
  const row = await getWork(db,id,user,true);
  check(row.status === 'published',409,'این مطلب منتشرشده نیست.');
  await db.query("UPDATE posts SET status='draft',updated_at=now() WHERE id=$1",[id]);
  await db.query('DELETE FROM avaye_public_files WHERE post_id=$1',[id]);
  if (row.payload) await writeWork(db,id,row.payload,'draft');
  await discardUnusedFiles(db,id);
}
export async function removePost(db, user, id) {
  const row = await getWork(db,id,user,true);
  check(editor(user) || (row.owner_id === user.id && row.status !== 'published'),403,'حذف این مطلب مجاز نیست.');
  await db.query('DELETE FROM avaye_public_files WHERE post_id=$1',[id]);
  await db.query('DELETE FROM avaye_work WHERE post_id=$1',[id]);
  await db.query('DELETE FROM avaye_uploads WHERE post_id=$1',[id]);
  await db.query('DELETE FROM avaye_create_requests WHERE post_id=$1',[id]);
  await db.query('DELETE FROM posts WHERE id=$1',[id]);
}
async function discardUnusedFiles(db,id) {
  await db.query(`DELETE FROM avaye_uploads u WHERE u.post_id=$1
    AND NOT EXISTS (SELECT 1 FROM avaye_public_files f WHERE f.post_id=u.post_id AND f.attachment->>'key'=u.key::text)
    AND NOT EXISTS (SELECT 1 FROM avaye_work w WHERE w.post_id=u.post_id AND
      (w.payload->'attachment'->>'key'=u.key::text OR w.payload->'cover'->>'key'=u.key::text))
    AND NOT EXISTS (SELECT 1 FROM posts p WHERE p.id=u.post_id AND p.cover_key=u.key::text)`,[id]);
}
export async function download(db,row,meta) {
  check(meta,404,'این نسخه پیوست ندارد.');
  const file=await one(db,'SELECT bytes FROM avaye_uploads WHERE post_id=$1 AND key=$2',[row.id,meta.key]);
  check(file,404,'فایل پیدا نشد.');
  return new Response(new Uint8Array(file.bytes),{headers:{'Content-Type':meta.type,'X-Content-Type-Options':'nosniff',
    'Cache-Control':'private, no-store','Content-Security-Policy':"sandbox; default-src 'none'",
    'Content-Disposition':"attachment; filename*=UTF-8''"+encodeURIComponent(meta.name)}});
}
export async function publicCover(db,key) {
  const file=await one(db,`SELECT u.bytes FROM avaye_uploads u JOIN posts p ON p.id=u.post_id
    WHERE u.key=$1 AND p.cover_key=$1 AND p.status='published'`,[key]);
  check(file,404,'تصویر پیدا نشد.');
  const bytes=new Uint8Array(file.bytes);
  const type=bytes[0]===255?'image/jpeg':'image/png';
  return new Response(bytes,{headers:{'Content-Type':type,'X-Content-Type-Options':'nosniff','Cache-Control':'public, max-age=300'}});
}

export async function books(db, query = '') {
  return (await db.query(`SELECT slug,title,author,publisher,publication_year,isbn,description,published_at
    FROM avaye_books WHERE status='published' AND ($1='' OR position($1 IN translate(concat_ws(' ',title,author,publisher,isbn,description),'يك','یک'))>0)
    ORDER BY published_at DESC NULLS LAST,id DESC LIMIT 100`,[query])).rows;
}
export async function deskBooks(db) {
  return (await db.query('SELECT id,slug,title,status FROM avaye_books ORDER BY updated_at DESC,id DESC')).rows;
}
export async function getBook(db, idOrSlug, isSlug = false) {
  const row=await one(db,`SELECT * FROM avaye_books WHERE ${isSlug ? 'slug=$1 AND status=\'published\'' : 'id=$1'}`,[idOrSlug]);
  check(row,404,'کتاب پیدا نشد.'); return row;
}
export async function saveBook(db,user,id,data,action) {
  check(editor(user),403,'مدیریت کتابخانه فقط برای ویراستار مجاز است.');
  check(['draft','publish'].includes(action),400,'عملیات نامعتبر است.');
  if (id) {
    const old=await getBook(db,id);
    await db.query(`UPDATE avaye_books SET title=$2,author=$3,publisher=$4,publication_year=$5,isbn=$6,description=$7,
      status=$8,updated_at=now(),published_at=CASE WHEN $8='published' THEN COALESCE(published_at,now()) ELSE published_at END WHERE id=$1`,
    [id,data.title,data.author,data.publisher,data.publication_year,data.isbn,data.description,action==='publish'?'published':'draft']);
    return old.id;
  }
  const row=await one(db,`INSERT INTO avaye_books(slug,title,author,publisher,publication_year,isbn,description,status,owner_id,published_at)
    VALUES($1,$2,$3,$4,$5,$6,$7,$8,$9,CASE WHEN $8='published' THEN now() ELSE NULL END) RETURNING id`,
  [makeSlug(data.title),data.title,data.author,data.publisher,data.publication_year,data.isbn,data.description,action==='publish'?'published':'draft',user.id]);
  return row.id;
}
export async function changeBookStatus(db,user,id,status) {
  check(editor(user),403,'مدیریت کتابخانه فقط برای ویراستار مجاز است.');
  check(['draft','published'].includes(status),400,'وضعیت نامعتبر است.');
  await db.query('UPDATE avaye_books SET status=$2,updated_at=now() WHERE id=$1',[id,status]);
}
export async function removeBook(db,user,id) {
  check(editor(user),403,'مدیریت کتابخانه فقط برای ویراستار مجاز است.');
  await db.query('DELETE FROM avaye_books WHERE id=$1',[id]);
}
export async function backup(db) {
  const [posts,work,topics,publicFiles,uploads,books] = await Promise.all([
    db.query('SELECT * FROM posts ORDER BY id'),db.query('SELECT * FROM avaye_work ORDER BY post_id'),
    db.query('SELECT * FROM avaye_topics ORDER BY title'),db.query('SELECT * FROM avaye_public_files ORDER BY post_id'),
    db.query('SELECT key,post_id,encode(bytes,\'base64\') AS bytes_base64 FROM avaye_uploads ORDER BY post_id,key'),
    db.query('SELECT * FROM avaye_books ORDER BY id')
  ]);
  return { format:'avaye-jaghori-backup-v1', exported_at:new Date().toISOString(), posts:posts.rows, work:work.rows,
    topics:topics.rows, public_files:publicFiles.rows, uploads:uploads.rows, books:books.rows };
}
