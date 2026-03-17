-- Complete Waitlist Table with Referral System
-- Run this in Supabase SQL Editor or via CLI:
--   supabase link --project-ref YOUR_PROJECT_REF
--   supabase db execute -f supabase/migrations/2026_03_15_referral_system.sql

-- Drop existing table if exists (uncomment if you want to start fresh)
-- DROP TABLE IF EXISTS public.waitlist CASCADE;

-- Create waitlist table with all columns including referral system
CREATE TABLE IF NOT EXISTS public.waitlist (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('student', 'teacher', 'institution')),
  avatar_url TEXT,
  status TEXT NOT NULL DEFAULT 'PENDING' CHECK (status IN ('PENDING', 'CONFIRMED', 'REJECTED')),

  -- Referral system columns
  referral_code VARCHAR(20) UNIQUE,
  referred_by UUID REFERENCES waitlist(id) ON DELETE SET NULL,
  referral_count INTEGER DEFAULT 0,

  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE public.waitlist ENABLE ROW LEVEL SECURITY;

-- Allow anyone to submit to waitlist (insert)
CREATE POLICY "Allow public insert on waitlist"
  ON public.waitlist FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

-- Allow reading waitlist data
CREATE POLICY "Allow public read on waitlist"
  ON public.waitlist FOR SELECT
  TO anon, authenticated
  USING (true);

-- Create indexes for faster lookups
CREATE INDEX IF NOT EXISTS idx_waitlist_email ON public.waitlist(email);
CREATE INDEX IF NOT EXISTS idx_waitlist_created_at ON public.waitlist(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_waitlist_role ON public.waitlist(role);
CREATE INDEX IF NOT EXISTS idx_waitlist_referral_code ON public.waitlist(referral_code);
CREATE INDEX IF NOT EXISTS idx_waitlist_referred_by ON public.waitlist(referred_by);

-- Create RPC function to atomically increment referral count
CREATE OR REPLACE FUNCTION increment_referral_count(row_id UUID)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  UPDATE waitlist
  SET referral_count = referral_count + 1
  WHERE id = row_id;
END;
$$;
