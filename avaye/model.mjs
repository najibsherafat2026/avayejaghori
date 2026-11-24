import { randomUUID } from 'node:crypto';

export const base = '/journal';
export const states = { draft: 'پیش‌نویس', review: 'در انتظار بررسی', rejected: 'نیازمند اصلاح', published: 'منتشرشده' };
export const kinds = { article: 'مقاله', note: 'یادداشت', report: 'گزارش', resource: 'منبع آموزشی' };
export const editor = user => !!user?.roles?.some(role => ['admin', 'editor'].includes(role));
export class Problem extends Error {
  constructor(status, message) { super(message); this.status = status; }
}
export function check(test, status, message) { if (!test) throw new Problem(status, message); }
export const norm = value => String(value ?? '').replaceAll('ي', 'ی').replaceAll('ك', 'ک').replace(/[\u200c\s]+/gu, ' ').trim();
export const splitLines = value => value.split(/\r?\n/).map(v => v.trim()).filter(Boolean);
export function field(form, name, max, required = false) {
  const input = form.get(name) ?? '';
  check(typeof input === 'string', 400, 'فیلد نامعتبر است.');
  const value = input.replace(/\r\n?/g, '\n').trim();
  check(value.length <= max && (!required || value.length), 400, 'فیلد ضروری خالی است یا متن از حد مجاز بلندتر است.');
  return value;
}
export function content(form) {
  const kind = field(form, 'kind', 65, true);
  return {
    title: field(form, 'title', 240, true), excerpt: field(form, 'excerpt', 1800), body: field(form, 'body', 120000),
    author_name: field(form, 'author_name', 160, true), category: norm(field(form, 'category', 100, true)), kind,
    author_role: field(form, 'author_role', 160), tags: field(form, 'tags', 1200).split(/[،,]/).map(norm).filter(Boolean).slice(0, 40),
    sources: splitLines(field(form, 'sources', 8000)).slice(0, 80), rights: form.get('rights') === 'yes'
  };
}
export function bookContent(form) {
  const yearText = field(form, 'publication_year', 4);
  const year = yearText ? Number(yearText) : null;
  check(year === null || (Number.isInteger(year) && year >= 1000 && year <= new Date().getFullYear() + 1), 400, 'سال نشر معتبر نیست.');
  return {
    title: field(form, 'title', 240, true), author: field(form, 'author', 180), publisher: field(form, 'publisher', 180),
    publication_year: year, isbn: field(form, 'isbn', 40), description: field(form, 'description', 5000)
  };
}
export function makeSlug(title) {
  return (title.replace(/[^\p{L}\p{N}]+/gu, '-').replace(/^-|-$/g, '').slice(0, 64) || 'post') + '-' + randomUUID().slice(0, 12);
}
export function fromPost(post) {
  return {
    title: post.title, excerpt: post.excerpt, body: post.body, author_name: post.author_name, author_role: post.author_role,
    category: post.category, kind: post.kind, tags: post.tags ?? [], sources: post.sources ?? [], rights: false,
    attachment: post.live_file ?? null, cover: post.cover_key ? { key: post.cover_key, name: 'تصویر شاخص' } : null
  };
}
export function sections(body) {
  const out = []; let heading = ''; let lines = [];
  const flush = () => { if (heading || lines.some(Boolean)) out.push({ heading, body: lines.join('\n').trim() }); };
  for (const line of body.replace(/\r\n/g, '\n').split('\n')) {
    const match = /^#{2,3}\s+(.+)$/.exec(line.trim());
    if (match) { flush(); heading = match[1].trim(); lines = []; } else lines.push(line);
  }
  flush(); return out;
}
export async function uploadFile(file, imageOnly = false) {
  if (!file || typeof file === 'string' || !file.size) return null;
  check(file.size <= 2 * 1024 * 1024, 413, 'حجم فایل باید حداکثر ۲ مگابایت باشد.');
  const bytes = new Uint8Array(await file.arrayBuffer());
  const begins = prefix => prefix.every((byte, index) => byte === bytes[index]);
  let type = begins([255, 216, 255]) ? 'image/jpeg' : begins([137, 80, 78, 71, 13, 10, 26, 10]) ? 'image/png' : null;
  if (!imageOnly && begins([37, 80, 68, 70, 45])) type = 'application/pdf';
  check(type, 400, imageOnly ? 'تصویر شاخص باید JPG یا PNG باشد.' : 'فایل مجاز PDF، JPG یا PNG است.');
  const ext = { 'application/pdf': 'pdf', 'image/jpeg': 'jpg', 'image/png': 'png' }[type];
  const rawName = String(file.name ?? 'file').split(/[\\/]/).pop().replace(/\.[^.]*$/, '').replace(/[^\p{L}\p{N} _-]/gu, '').slice(0, 90);
  return { bytes, meta: { key: randomUUID(), name: (rawName || 'file') + '.' + ext, type, size: file.size } };
}
