CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  username TEXT NOT NULL UNIQUE,
  email TEXT NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT NOW()

);

CREATE TABLE platform_accounts (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id),
  platform TEXT NOT NULL,
  platform_username TEXT NOT NULL
);

CREATE TABLE activity_log (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id),
  action TEXT NOT NULL,
  subject TEXT NOT NULL,
  platform TEXT NOT NULL,
  date DATE NOT NULL
);
CREATE TABLE sessions (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id),
  session_token TEXT NOT NULL UNIQUE,
  expiry TIMESTAMP NOT NULL
);

CREATE TABLE leetcode_stats (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id),
  username TEXT NOT NULL,
  ranking TEXT NOT NULL,
  totalProblemsSolved TEXT NOT NULL,
  easyProblems TEXT NOT NULL,
  mediumProblems TEXT NOT NULL,
  hardProblems TEXT NOT NULL
);