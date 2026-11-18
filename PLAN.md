# آوای جاغوری | Avaye Jaghori — Product Roadmap

Avaye Jaghori is a multi-purpose Persian (Dari) media and knowledge hub. The product is delivered in small, self-contained milestones so each step ships something usable.

## ✅ Milestone 1 — Brand and product surface (done)
- Brand identity: SVG logo (book, Jaghori peaks, sound waves, girih star), emerald/forest/gold/cream/navy palette, Vazirmatn font, full RTL layout.
- Custom hero artwork (Jaghori valley, village, mosque) served through the Netlify Image CDN.
- Top bar with Shamsi, Hijri and Gregorian dates, social links, language menu, contact link; sticky header with mega menu; mobile drawer; footer.
- Screens: Home (hero, featured, latest with filter, categories, news/religious/history columns, new books, media, popular, authors, occasions, newsletter), article archive and search, article page, digital library with book details, About/editorial policy/contact.
- All content is stub data in `src/data/fixtures.ts`, labelled «نمونه».

## Milestone 2 — Content database and real articles
- Netlify Database + Drizzle schema: categories (hierarchical), authors, posts (kind, status: draft / in review / approved / scheduled / published, tags, sources, featured flag, view count), static pages, menu items.
- Replace fixtures with server functions/loaders; keep the same shapes.
- View counting, related posts, archive pagination, sitemap.xml, robots.txt, Schema.org and Open Graph per page.

## Milestone 3 — Accounts and roles
- Netlify Identity: signup, login, password recovery, profile editing.
- Roles: super admin, content manager, editor-in-chief, author, copy editor, researcher, librarian, teacher, regular user.
- Favourites, reading history, comments with moderation.

## Milestone 4 — Admin panel (Persian)
- Manage posts and the review workflow, categories, menus, authors, users and roles, comments, static pages, settings.
- Image and file uploads with Netlify Blobs (featured images, PDFs, audio).
- Basic visit statistics.

## Milestone 5 — Specialist centres
- Quran centre (licensed text and translation, surah/ayah search, recitation audio, tajwid lessons).
- Hadith and Ahl al-Bayt section with mandatory source fields (book, volume, page, number, verification notes).
- Ahkam Q&A with cited sources; Tabligh centre.
- Jaghori and Hazara history archive: documents, old photos, oral histories, clearly separated into documented / oral / scholarly view / hypothesis.

## Milestone 6 — Library and multimedia
- Library management for librarians: covers, PDFs only with a licence, online reader, book suggestions from users.
- Image gallery, video centre, audio archive, podcast series with a mobile-friendly player.

## Milestone 7 — Forms, newsletter and engagement
- Contact, collaboration and article-submission forms (with file upload), the newsletter (subscribers and sending), and notifications for new content.

## Milestone 8 — Advanced
- Site-wide search across all content types, with filters by date, author, type, category and tag.
- Islamic occasions calendar and prayer times by location.
- Courses: enrolment, lessons, online quizzes, certificates.
- Multilingual: Arabic (RTL), English (LTR), Hazaragi when content is ready.
- Analytics integrations (Google Analytics / Search Console), backups.
