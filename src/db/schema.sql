CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  username TEXT NOT NULL UNIQUE
);

CREATE TABLE platform_accounts (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id),
  platform TEXT NOT NULL,
  platform_username TEXT NOT NULL
);