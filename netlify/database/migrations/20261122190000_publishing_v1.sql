CREATE TABLE posts (
  id serial PRIMARY KEY,
  slug text NOT NULL UNIQUE,
  title text NOT NULL,
  excerpt text NOT NULL DEFAULT '',
  body text NOT NULL DEFAULT '',
  category text NOT NULL,
  kind text NOT NULL DEFAULT 'article',
  status text NOT NULL DEFAULT 'draft' CHECK (status IN ('draft','review','published')),
  author_name text NOT NULL,
  author_role text NOT NULL DEFAULT '',
  owner_id text NOT NULL,
  owner_email text NOT NULL DEFAULT '',
  tags text[] NOT NULL DEFAULT '{}',
  sources text[] NOT NULL DEFAULT '{}',
  cover_key text,
  review_note text NOT NULL DEFAULT '',
  published_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX posts_status_published_idx ON posts(status,published_at);
CREATE INDEX posts_owner_idx ON posts(owner_id);

CREATE TABLE avaye_work (
  post_id integer PRIMARY KEY REFERENCES posts(id),
  version integer NOT NULL,
  state text NOT NULL CHECK (state IN ('draft','review','rejected','published')),
  payload jsonb NOT NULL,
  note text NOT NULL DEFAULT '',
  updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE TABLE avaye_topics (
  title text PRIMARY KEY CHECK (length(title) BETWEEN 1 AND 100)
);
INSERT INTO avaye_topics(title) VALUES ('فرهنگی'),('آموزشی'),('معارف دینی');
CREATE TABLE avaye_public_files (
  post_id integer PRIMARY KEY REFERENCES posts(id),
  attachment jsonb NOT NULL
);
CREATE TABLE avaye_uploads (
  key uuid PRIMARY KEY,
  post_id integer NOT NULL REFERENCES posts(id),
  bytes bytea NOT NULL CHECK (octet_length(bytes) BETWEEN 1 AND 2097152)
);
CREATE INDEX avaye_uploads_post_idx ON avaye_uploads(post_id);
CREATE TABLE avaye_create_requests (
  owner_id text NOT NULL,
  request_id uuid NOT NULL,
  post_id integer REFERENCES posts(id),
  PRIMARY KEY(owner_id,request_id)
);
CREATE TABLE avaye_books (
  id serial PRIMARY KEY,
  slug text NOT NULL UNIQUE,
  title text NOT NULL,
  author text NOT NULL DEFAULT '',
  publisher text NOT NULL DEFAULT '',
  publication_year integer,
  isbn text NOT NULL DEFAULT '',
  description text NOT NULL DEFAULT '',
  status text NOT NULL DEFAULT 'draft' CHECK (status IN ('draft','published')),
  owner_id text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  published_at timestamptz
);
CREATE INDEX avaye_books_status_published_idx ON avaye_books(status,published_at);
