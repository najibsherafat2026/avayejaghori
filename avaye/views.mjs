import {randomUUID} from 'node:crypto';
import {base,states,kinds,sections,editor,fromPost} from './model.mjs';
export const h=value=>String(value??'').replace(/[&<>"']/g,char=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'})[char]);
const date=value=>value?new Intl.DateTimeFormat('fa-AF-u-ca-persian',{dateStyle:'long',timeZone:'Asia/Kabul'}).format(new Date(value)):'';
const styles=`
:root{color-scheme:light;--ink:#162f30;--teal:#115755;--paper:#faf8f1;--rule:#d5d4c8;--gold:#9b753b}
*{box-sizing:border-box}body{margin:0;background:var(--paper);color:var(--ink);font:1.04rem/1.85 Tahoma,Arial,sans-serif}header,footer{border-block-end:1px solid var(--rule)}.wrap{max-width:72rem;margin:auto;padding:0 clamp(1rem,5vw,4rem)}header .wrap,footer .wrap{display:flex;align-items:center;justify-content:space-between;gap:1.3rem;flex-wrap:wrap;padding-block:1rem}
a{color:var(--teal);text-underline-offset:.25em}nav,.actions{display:flex;gap:1rem;align-items:center;flex-wrap:wrap}.brand{font-size:1.38rem;font-weight:bold;text-decoration:none}.brand small{display:block;font: .63rem/1.3 Georgia,serif;letter-spacing:.17em;color:#4b5954}
main{min-height:65vh;padding-block:2rem!important}h1,h2,h3{line-height:1.5;margin-block:.3em .7em}h1{font-size:clamp(1.85rem,5vw,3.55rem)}h2{font-size:1.5rem}.hero{padding-block:clamp(1.5rem,5vw,3.8rem);border-block-end:3px double var(--gold)}.hero p,.muted,small,time{color:#52615a}.hero p{max-width:52ch;margin-bottom:0}.grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(min(100%,18rem),1fr));gap:1rem}.card,fieldset,.panel{border:1px solid var(--rule);border-radius:.45rem;background:#fffefa;padding:1.15rem}.card h2{font-size:1.3rem}.read{max-width:49rem;margin-inline:auto}.read p,.excerpt{white-space:pre-wrap;overflow-wrap:anywhere}.read article{margin-block:2rem}.row{display:grid;grid-template-columns:repeat(auto-fit,minmax(min(100%,14rem),1fr));gap:1rem}label{display:block;font-weight:600;margin-block:.7rem .25rem}input,textarea,select{display:block;width:100%;background:#fffefb;border:1px solid #87988e;border-radius:.3rem;color:var(--ink);font:inherit;padding:.5rem .65rem}textarea{resize:vertical}input[type=checkbox]{width:auto;display:inline}
button,.btn{display:inline-block;font:inherit;font-weight:600;border:1px solid var(--teal);background:var(--teal);color:white;border-radius:.3rem;padding:.45rem 1rem;cursor:pointer;text-decoration:none}.alt{background:transparent;color:var(--teal)}form{margin-block:1rem}.actions{margin-top:1rem}.list{padding:0;list-style:none}.list li{display:flex;justify-content:space-between;align-items:baseline;gap:.75rem;border-bottom:1px solid var(--rule);padding:.75rem 0;flex-wrap:wrap}.pill{font-size:.87rem;color:#354f48}.notice,.empty{padding:1rem;background:#efeee2;border-inline-start:3px solid var(--gold);margin-block:1rem}.skip{position:absolute;inset-inline-start:-9999px}.skip:focus{inset-inline-start:1rem;background:white;z-index:3}:focus-visible{outline:3px solid #a2531a;outline-offset:3px}footer{border-top:1px solid var(--rule);font-size:.9rem}.search{margin:1.3rem 0 2rem}
@media(max-width:38rem){header .wrap{align-items:flex-start}nav{gap:.8rem;font-size:.95rem}.actions>*{flex:1;text-align:center}.brand small{font-size:.6rem}}
`;
export function page(title,body,{status=200,privatePage=false,description='مطالب فرهنگی، آموزشی و دینی آوای جاغوری'}={}) {
  return new Response(`<!doctype html><html lang="fa-AF" dir="rtl"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${h(title)} | آوای جاغوری</title><meta name="description" content="${h(description)}">${privatePage?'<meta name="robots" content="noindex,nofollow">':''}<style>${styles}</style></head><body><a class="skip" href="#main">رفتن به محتوا</a><header><div class="wrap"><a class="brand" href="/">آوای جاغوری<small dir="ltr" lang="en">AVAYE JAGHORI</small></a><nav aria-label="منوی بخش نشر"><a href="${base}">مطالب</a><a href="${base}/desk">میز نویسنده</a></nav></div></header><main class="wrap" id="main">${body}</main><footer><div class="wrap"><span>آوای جاغوری</span><span>نام نویسنده و منابع هر اثر در صفحهٔ آن آمده است.</span><a href="/">صفحهٔ اصلی</a></div></footer></body></html>`,{status,headers:{'Content-Type':'text/html; charset=utf-8','Cache-Control':'no-store','X-Content-Type-Options':'nosniff','Referrer-Policy':'same-origin','Content-Security-Policy':"default-src 'none'; style-src 'unsafe-inline'; img-src 'self'; form-action 'self'; base-uri 'none'; frame-ancestors 'none'"}});
}
const options=(values,selected)=>values.map(([k,v])=>`<option value="${h(k)}"${k===selected?' selected':''}>${h(v)}</option>`).join('');
const topicOptions=(values,selected)=>options([...new Set([...values,...(selected?[selected]:[])])].map(v=>[v,v]),selected);
const field=(key,title,value,max,extra='')=>`<label for="${key}">${title}</label><input id="${key}" name="${key}" value="${h(value)}" maxlength="${max}" ${extra}>`;
const area=(key,title,value,max,rows)=>`<label for="${key}">${title}</label><textarea name="${key}" id="${key}" rows="${rows}" maxlength="${max}">${h(value)}</textarea>`;
const kindName=k=>kinds[k]??k;
export function libraryView(items,topics,q,category,number) {
  const next=items.length>24;
  const pagelink=n=>base+'?'+new URLSearchParams({q,category,page:String(n)});
  return page('دفتر مطالب',`<section class="hero"><h1>دفتر مطالب آوای جاغوری</h1><p>مقاله‌ها، یادداشت‌ها و گزارش‌های فرهنگی، آموزشی و دینی را بر اساس موضوع یا نام نویسنده بیابید.</p></section><form class="search" action="${base}"><div class="row"><div>${field('q','جست‌وجوی مطالب',q,180,'type="search"')}</div><div><label for="category">موضوع</label><select id="category" name="category"><option value="">همهٔ موضوعات</option>${topicOptions(topics,category)}</select></div></div><div class="actions"><button>جست‌وجو</button><a href="${base}/desk">ارسال اثر</a></div></form><h2>${q||category?'نتیجهٔ جست‌وجو':'تازه‌ترین آثار'}</h2><div class="grid">${items.slice(0,24).map(p=>`<article class="card"><small>${h(p.category)} · ${h(kindName(p.kind))}</small><h2><a href="${base}/read/${encodeURIComponent(p.slug)}">${h(p.title)}</a></h2><p>${h(p.excerpt)}</p><small>${h(p.author_name)} · ${h(date(p.published_at))}</small></article>`).join('')}</div>${items.length?'':`<p class="empty">${q||category?'مطلبی با این مشخصات پیدا نشد.':'هنوز اثری منتشر نشده است. نخستین اثر تأییدشده در همین صفحه نمایش داده می‌شود.'}</p>`}<nav class="actions">${number>1?`<a href="${h(pagelink(number-1))}">صفحهٔ قبل</a>`:''}${next?`<a href="${h(pagelink(number+1))}">صفحهٔ بعد</a>`:''}</nav>`);
}
export function article(d,attachmentUrl) {
  const parts=sections(d.body);
  return `<article class="read"><small>${h(d.category)} · ${h(kindName(d.kind))}</small><h1>${h(d.title)}</h1><p class="muted">${h(d.author_name)} ${h(d.author_role)} ${d.published_at?' · '+h(date(d.published_at)):''}</p><p class="excerpt">${h(d.excerpt)}</p>${d.cover_key?`<img style="max-width:100%;height:auto" src="/api/media/${encodeURIComponent(d.cover_key)}" alt="">`:''}
  ${parts.filter(x=>x.heading).length>2?`<details><summary>فهرست مطلب</summary><ul>${parts.map((s,i)=>s.heading?`<li><a href="#s${i}">${h(s.heading)}</a></li>`:'').join('')}</ul></details>`:''}
  ${parts.map((s,i)=>`<section>${s.heading?`<h2 id="s${i}">${h(s.heading)}</h2>`:''}<p>${h(s.body)}</p></section>`).join('')}
  ${d.attachment?`<p><a class="btn alt" href="${h(attachmentUrl)}" download>دریافت پیوست · ${h(d.attachment.name)}</a> <small>${Math.ceil(d.attachment.size/1024).toLocaleString('fa')} کیلوبایت</small></p>`:''}
  ${d.tags?.length?`<p>برچسب‌ها · ${d.tags.map(h).join('، ')}</p>`:''}${d.sources?.length?`<h2>منابع</h2><ul>${d.sources.map(s=>`<li>${h(s)}</li>`).join('')}</ul>`:''}</article>`;
}
export function deskView(rows,user) {
  const isEditor=editor(user);
  return page('میز نشر',`<h1>${isEditor?'میز تحریریه':'میز نویسنده'}</h1><p>${h(user.name||user.email)}</p><nav class="actions"><a class="btn" href="${base}/new">نوشتن مطلب</a>${isEditor?`<a href="${base}/topics">مدیریت موضوعات</a>`:''}<form method="post" action="${base}/logout"><button class="alt">خروج</button></form></nav><h2>${isEditor?'آثار تحریریه':'آثار من'}</h2>${rows.length?`<ul class="list">${rows.map(p=>`<li><a href="${base}/edit/${p.id}">${h(p.title)}</a><span class="pill">${h(states[p.state]??p.state)}</span></li>`).join('')}</ul>`:'<p class="empty">هنوز مطلبی برای نمایش وجود ندارد.</p>'}`,{privatePage:true});
}
export function editView(row,user,topics){
  const d=row?.payload??(row?fromPost(row):{author_name:user.name||'',kind:'article'});
  const state=row?.state??row?.status;
  const action=row?base+'/edit/'+row.id:base+'/new';
  const token=`<input type="hidden" name="token" value="${h(row?row.token:randomUUID())}">`;
  return page('ویرایش اثر',`<div class="read"><a href="${base}/desk">بازگشت به میز نشر</a><h1>${row?'ویرایش اثر':'مطلب تازه'}</h1>
  ${row?`<p>وضعیت نسخهٔ کاری · ${h(states[state]??state)} · <a href="${base}/preview/${row.id}">پیش‌نمایش نسخهٔ ذخیره‌شده</a></p>`:''}
  ${row?.note||row?.review_note?`<p class="notice">پیام ویراستار · ${h(row.note||row.review_note)}</p>`:''}
  ${state==='review'&&editor(user)?`<section class="panel"><h2>تصمیم تحریریه</h2><p>تصمیم روی نسخهٔ ذخیره‌شده اعمال می‌شود.</p><form method="post" action="${base}/review/${row.id}">${token}${area('note','پیام برای نویسنده','',1500,2)}<div class="actions"><button name="action" value="approve">تأیید و انتشار</button><button class="alt" name="action" value="return">درخواست اصلاح</button></div></form></section>`:''}
  <form method="post" enctype="multipart/form-data" action="${action}">${token}${field('title','عنوان مطلب',d.title,240,'required')}
  <div class="row"><div>${field('author_name','نام نمایشی نویسنده',d.author_name,160,'required')}</div><div>${field('author_role','معرفی کوتاه نویسنده',d.author_role,160)}</div></div>
  <div class="row"><div><label for="category">موضوع</label><select id="category" name="category" required>${topicOptions(topics,d.category)}</select></div><div><label for="kind">نوع نوشته</label><select id="kind" name="kind">${options(Object.entries({...kinds,...(d.kind&&!Object.hasOwn(kinds,d.kind)?{[d.kind]:d.kind}:{})}),d.kind)}</select></div></div>
  ${area('excerpt','خلاصه',d.excerpt,1800,3)}${area('body','متن اثر',d.body,120000,14)}<small>برای میان‌تیتر، ابتدای سطر دو علامت # و یک فاصله بگذارید.</small>
  ${field('tags','برچسب‌ها با ویرگول',d.tags?.join('، '),1200)}${area('sources','منابع یا نشانی مأخذ، هر کدام در یک سطر',d.sources?.join('\n'),8000,3)}
  <label for="file">پیوست · PDF، JPG یا PNG تا ۲ مگابایت</label><input type="file" name="file" id="file" accept=".pdf,.jpg,.jpeg,.png">
  ${d.attachment?`<p>پیوست فعلی · <a href="${base}/working-file/${row.id}">${h(d.attachment.name)}</a></p><label><input type="checkbox" name="remove" value="yes"> حذف پیوست از این نسخه</label>`:''}
  <label><input type="checkbox" name="rights" value="yes" ${d.rights?'checked':''}> صاحب اثر هستم یا اجازهٔ نشر متن و پیوست را دارم.</label>
  <div class="actions"><button class="alt" name="action" value="draft">ذخیرهٔ پیش‌نویس</button><button name="action" value="submit">ارسال برای بررسی</button></div></form></div>`,{privatePage:true});
}
export function topicsView(all) {
  return page('مدیریت موضوعات',`<div class="read"><a href="${base}/desk">میز نشر</a><h1>موضوعات نشر</h1><ul>${all.map(v=>`<li>${h(v)}</li>`).join('')}</ul><form method="post">${field('title','نام موضوع جدید','',100,'required')}<div class="actions"><button>افزودن موضوع</button></div></form></div>`,{privatePage:true});
}
export function loginView() {
  return page('ورود به میز نشر',`<div class="read"><h1>ورود به میز نشر</h1><p>با حساب کاربری این نشریه وارد شوید.</p><form method="post" action="${base}/login"><label for="email">ایمیل</label><input dir="ltr" type="email" id="email" name="email" autocomplete="username" required><label for="password">گذرواژه</label><input id="password" type="password" dir="ltr" name="password" autocomplete="current-password" required><div class="actions"><button>ورود</button><a href="${base}">مطالعه بدون ورود</a></div></form></div>`,{privatePage:true});
}
