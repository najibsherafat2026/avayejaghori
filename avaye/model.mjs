import {randomUUID} from 'node:crypto';

export const base = '/journal';
export const states = {draft:'پیش‌نویس',review:'در انتظار بررسی',rejected:'نیازمند اصلاح',published:'منتشرشده'};
export const kinds = {article:'مقاله', note:'یادداشت', report:'گزارش', resource:'منبع آموزشی'};
export const editor = user => !!user?.roles?.some(role => ['admin','editor'].includes(role));
export class Problem extends Error {
  constructor(status,message) {super(message); this.status=status;}
}
export function check(test,status,message) {if (!test) throw new Problem(status,message);}
export const norm = v => String(v??'').replaceAll('ي','ی').replaceAll('ك','ک').replace(/[\u200c\s]+/gu,' ').trim();
export const splitLines = value => value.split(/\r?\n/).map(v=>v.trim()).filter(Boolean);
export function field(form,name,max,required=false) {
  const input=form.get(name)??'';
  check(typeof input==='string',400,'فیلد نامعتبر است.');
  const v=input.replace(/\r\n?/g,'\n').trim();
  check(v.length<=max && (!required||v.length),400,'یک فیلد ضروری خالی است یا متن از حد مجاز بلندتر است.');
  return v;
}
export function content(form) {
  const kind=field(form,'kind',65,true);
  return {title:field(form,'title',240,true), excerpt:field(form,'excerpt',1800), body:field(form,'body',120000),
    author_name:field(form,'author_name',160,true),category:field(form,'category',100,true),kind,
    author_role:field(form,'author_role',160),tags:field(form,'tags',1200).split(/[،,]/).map(v=>v.trim()).filter(Boolean),
    sources:splitLines(field(form,'sources',8000)),rights:form.get('rights')==='yes'};
}
export function makeSlug(title) {
  return (title.replace(/[^\p{L}\p{N}]+/gu,'-').replace(/^-|-$/g,'').slice(0,64)||'post')+'-'+randomUUID().slice(0,12);
}
export function fromPost(p) {
  return {title:p.title,excerpt:p.excerpt,body:p.body,author_name:p.author_name,author_role:p.author_role,
    category:p.category,kind:p.kind,tags:p.tags??[],sources:p.sources??[],rights:false,attachment:p.live_file??null};
}
export function sections(body) {
  const out=[];let heading='',lines=[];
  function flush(){if(heading||lines.some(Boolean))out.push({heading,body:lines.join('\n').trim()});}
  for(const line of body.replace(/\r\n/g,'\n').split('\n')){
    const match=/^#{2,3}\s+(.+)$/.exec(line.trim());
    if(match){flush();heading=match[1].trim();lines=[];}else lines.push(line);
  }
  flush();return out;
}
export async function attachment(file) {
  if(!file||typeof file==='string'||!file.size)return null;
  check(file.size<=2*1024*1024,413,'حجم پیوست باید حداکثر ۲ مگابایت باشد.');
  const bytes=new Uint8Array(await file.arrayBuffer());
  const begins=(prefix)=>prefix.every((b,i)=>b===bytes[i]);
  const type=begins([37,80,68,70,45])?'application/pdf':begins([255,216,255])?'image/jpeg':begins([137,80,78,71,13,10,26,10])?'image/png':null;
  check(type,400,'قالب مجاز پیوست PDF، JPEG یا PNG است.');
  const ext={'application/pdf':'pdf','image/jpeg':'jpg','image/png':'png'}[type];
  const name=(file.name.split(/[\\/]/).pop().replace(/\.[^.]*$/,'').replace(/[^\p{L}\p{N} _-]/gu,'').slice(0,90)||'attachment')+'.'+ext;
  return {bytes,meta:{key:randomUUID(),name,type,size:file.size}};
}
