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

-- Indexes
CREATE INDEX IF NOT EXISTS questions_embedding_idx
  ON questions USING ivfflat (question_embedding vector_cosine_ops)
  WITH (lists = 100);

CREATE INDEX IF NOT EXISTS questions_subject_idx ON questions(subject_id);
CREATE INDEX IF NOT EXISTS api_usage_ip_idx      ON api_usage(ip_address, called_at);
