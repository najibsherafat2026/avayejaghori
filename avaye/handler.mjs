import {base,Problem,check,editor,norm,content,field,fromPost,attachment} from './model.mjs';
import {topics,getWork,desk,catalogue,getPublic,save,moderate,download} from './data.mjs';
import {h,page,libraryView,article,deskView,editView,topicsView,loginView} from './views.mjs';
const redirect=path=>new Response(null,{status:303,headers:{Location:path,'Cache-Control':'no-store'}});
const privatePage={privatePage:true};
export function createHandler(runtime) {
  return async function handle(req) {
    try{
      const url=new URL(req.url);
      const prefix=url.pathname.replace(/\/+$/,'');
      check(prefix===base||prefix.startsWith(base+'/'),404,'صفحه پیدا نشد.');
      const parts=prefix.substring(base.length).split('/').filter(Boolean).map(decodeURIComponent);
      const [route='',key]=parts;
      check(parts.length<=2,404,'صفحه پیدا نشد.');
      const post=req.method==='POST';
      check(post||req.method==='GET',405,'روش درخواست معتبر نیست.');
      if(post){
        check(req.headers.get('origin')===url.origin,403,'مبدأ درخواست معتبر نیست.');
        check(Number(req.headers.get('content-length')||0)<=3*1024*1024,413,'حجم درخواست بیش از اندازه است.');
      }
      if(!post&&route===''){
        const q=(url.searchParams.get('q')??'').slice(0,180),category=(url.searchParams.get('category')??'').slice(0,100);
        const num=Math.min(100000,Math.max(1,Math.floor(Number(url.searchParams.get('page'))||1)));
        const [rows,all]=await Promise.all([catalogue(runtime.db,norm(q),category,num),topics(runtime.db)]);
        return libraryView(rows,all,q,category,num);
      }
      if(!post&&['read','file'].includes(route)&&key){
        const row=await getPublic(runtime.db,key);
        if(route==='file')return await download(runtime.db,row,row.live_file);
        return page(row.title,article({...row,attachment:row.live_file},base+'/file/'+encodeURIComponent(key)),{description:row.excerpt});
      }
      if(route==='login'&&!key) {
        if(!post)return loginView();
        const f=await req.formData();
        const email=field(f,'email',320,true),password=f.get('password');
        check(typeof password==='string'&&password.length<=1024,400,'گذرواژه معتبر نیست.');
        const headers=await runtime.login(email,password);
        return new Response(null,{status:303,headers:{...headers,Location:base+'/desk','Cache-Control':'no-store'}});
      }
      if(post&&route==='logout'&&!key) {
        const headers=await runtime.logout();
        return new Response(null,{status:303,headers:{...headers,Location:base,'Cache-Control':'no-store'}});
      }
      const user=await runtime.user(req);
      if(!user){if(!post)return redirect(base+'/login');throw new Problem(401,'ابتدا وارد حساب خود شوید.');}
      if(route==='desk'&&!key&&!post)return deskView(await desk(runtime.db,user),user);
      if(route==='topics'&&!key){
        check(editor(user),403,'مدیریت موضوعات به اجازهٔ ویراستار نیاز دارد.');
        if(!post)return topicsView(await topics(runtime.db));
        const form=await req.formData(),title=norm(field(form,'title',100,true));
        await runtime.db.query('INSERT INTO avaye_topics(title) VALUES($1) ON CONFLICT DO NOTHING',[title]);
        return redirect(base+'/topics');
      }
      const id=key&&/^\d{1,9}$/.test(key)?Number(key):null;
      if(!post&&route==='new'&&!key)return editView(null,user,await topics(runtime.db));
      if(!post&&id&&['preview','working-file','edit'].includes(route)) {
        const row=await getWork(runtime.db,id,user);
        const d=row.payload??fromPost(row);
        if(route==='working-file')return await download(runtime.db,row,d.attachment);
        if(route==='preview')return page('پیش‌نمایش '+d.title,`<p class="notice">پیش‌نمایش خصوصی · <a href="${base}/edit/${id}">ویرایش اثر</a></p>`+article(d,base+'/working-file/'+id),privatePage);
        return editView(row,user,await topics(runtime.db));
      }
      if(post&&((route==='new'&&!key)||(route==='edit'&&id))){
        const f=await req.formData(),d=content(f),action=field(f,'action',16,true);
        const file=await attachment(f.get('file'));
        const saved=await runtime.transaction(client=>save(client,user,id,field(f,'token',120),d,action,file,f.get('remove')==='yes'));
        return redirect(base+'/edit/'+saved);
      }
      if(post&&route==='review'&&id){
        const f=await req.formData();
        await runtime.transaction(client=>moderate(client,user,id,field(f,'token',120,true),field(f,'action',16,true),field(f,'note',1500)));
        return redirect(base+'/edit/'+id);
      }
      throw new Problem(404,'صفحه پیدا نشد.');
    }catch(err){
      const known=err instanceof Problem;
      if(!known)console.error('Journal request failed',err.name,err.code??'');
      return page('درخواست انجام نشد',`<h1>درخواست انجام نشد</h1><p>${h(known?err.message:'سرویس موقتاً در دسترس نیست. دوباره تلاش کنید.')}</p><a href="${base}/desk">بازگشت به میز نشر</a> · <a href="${base}">مطالب عمومی</a>`,{privatePage:true,status:known?err.status:503});
    }
  };
}
