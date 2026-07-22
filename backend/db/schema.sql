-- Run this in the Supabase SQL editor.
-- Step 1: enable pgvector (must be done before creating the questions table)
CREATE EXTENSION IF NOT EXISTS vector;

-- Branches
CREATE TABLE IF NOT EXISTS branches (
  id      SERIAL PRIMARY KEY,
  key     VARCHAR(20)  UNIQUE NOT NULL,  -- 'cs', 'it', 'me', etc.
  name    VARCHAR(100) NOT NULL,
  pattern VARCHAR(10)  NOT NULL          -- '2019', '2024', or 'both'
);

-- Subjects
CREATE TABLE IF NOT EXISTS subjects (
  id        SERIAL PRIMARY KEY,
  code      VARCHAR(30)  UNIQUE NOT NULL,  -- matches JSON file name e.g. 'TE-CS-502'
  name      VARCHAR(200) NOT NULL,
  branch_id INT REFERENCES branches(id),
  year      VARCHAR(5)   NOT NULL,         -- 'FE', 'SE', 'TE', 'BE'
  semester  INT,
  credits   INT,
  pattern   VARCHAR(10)  NOT NULL          -- '2019' or '2024'
);

-- Previous Year Questions
CREATE TABLE IF NOT EXISTS questions (
  id                 SERIAL PRIMARY KEY,
  subject_id         INT REFERENCES subjects(id) ON DELETE CASCADE,
  unit               INT,
  question_text      TEXT NOT NULL,
  marks              INT,
  exam_year          INT,
  exam_month         VARCHAR(20),   -- 'May' or 'November'
  question_type      VARCHAR(30),   -- 'long', 'short', 'numerical', 'OR'
  question_embedding vector(1536)   -- OpenAI-compatible 1536-dim; populated when embedding is generated
);

-- AI Answer Cache
CREATE TABLE IF NOT EXISTS ai_answers (
  id            SERIAL PRIMARY KEY,
  question_id   INT REFERENCES questions(id) ON DELETE CASCADE,
  answer_text   TEXT        NOT NULL,
  model_used    VARCHAR(60) NOT NULL,
  generated_at  TIMESTAMPTZ DEFAULT NOW(),
  helpful_count INT         DEFAULT 0
);

-- API Usage Log (for rate-limit auditing)
CREATE TABLE IF NOT EXISTS api_usage (
  id         SERIAL PRIMARY KEY,
  user_id    VARCHAR(100),          -- Supabase auth UUID; NULL when unauthenticated
  ip_address VARCHAR(45) NOT NULL,
  endpoint   VARCHAR(100) NOT NULL,
  called_at  TIMESTAMPTZ DEFAULT NOW()
);

-- Contributors
CREATE TABLE IF NOT EXISTS contributors (
  id             SERIAL PRIMARY KEY,
  name           VARCHAR(100) NOT NULL,
  branch         VARCHAR(60),
  year           VARCHAR(10),
  subjects       TEXT[],
  avatar_url     TEXT,
  contributed_at TIMESTAMPTZ DEFAULT NOW()
);

-- Personalised dashboard — user_id references auth.users directly since
-- Supabase's auth schema lives in this same Postgres database.

-- One row per user: branch + current semester, manually set/changed by the student
CREATE TABLE IF NOT EXISTS user_profiles (
  user_id          UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  branch           VARCHAR(20) NOT NULL,   -- 'cs' | 'it' | 'aids' | 'me' | 'ce' | 'ee' | 'etc'
  pattern          VARCHAR(10) NOT NULL,   -- '2019' | '2024'
  current_semester INT NOT NULL CHECK (current_semester BETWEEN 1 AND 8),
  updated_at       TIMESTAMPTZ DEFAULT NOW(),
  created_at       TIMESTAMPTZ DEFAULT NOW()
);

-- Per-user, per-unit completion tick
CREATE TABLE IF NOT EXISTS unit_progress (
  id           SERIAL PRIMARY KEY,
  user_id      UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  subject_code VARCHAR(30) NOT NULL,
  unit         INT NOT NULL,
  completed_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, subject_code, unit)
);

-- Per-user, per-PYQ-question completion tick
CREATE TABLE IF NOT EXISTS question_progress (
  id           SERIAL PRIMARY KEY,
  user_id      UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  question_id  INT REFERENCES questions(id) ON DELETE CASCADE,
  completed_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, question_id)
);

-- Per-user SGPA entry per semester, feeds the CGPA tracker
CREATE TABLE IF NOT EXISTS academic_records (
  id         SERIAL PRIMARY KEY,
  user_id    UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  semester   INT NOT NULL CHECK (semester BETWEEN 1 AND 8),
  sgpa       NUMERIC(4,2) NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, semester)
);

-- Per-user email announcement opt-out. No row = subscribed (opt-out model);
-- a row only gets written when the user actually unsubscribes.
CREATE TABLE IF NOT EXISTS email_preferences (
  user_id    UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  opted_out  BOOLEAN NOT NULL DEFAULT false,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Audit log of admin-sent announcement emails (exams, results, notices).
CREATE TABLE IF NOT EXISTS announcements (
  id               SERIAL PRIMARY KEY,
  subject          VARCHAR(200) NOT NULL,
  body             TEXT NOT NULL,
  sent_by          VARCHAR(200),
  recipient_count  INT NOT NULL DEFAULT 0,
  sent_at          TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX IF NOT EXISTS questions_embedding_idx
  ON questions USING ivfflat (question_embedding vector_cosine_ops)
  WITH (lists = 100);

CREATE INDEX IF NOT EXISTS questions_subject_idx ON questions(subject_id);
CREATE INDEX IF NOT EXISTS api_usage_ip_idx      ON api_usage(ip_address, called_at);
CREATE INDEX IF NOT EXISTS unit_progress_user_idx     ON unit_progress(user_id);
CREATE INDEX IF NOT EXISTS question_progress_user_idx ON question_progress(user_id);
CREATE INDEX IF NOT EXISTS academic_records_user_idx  ON academic_records(user_id);
