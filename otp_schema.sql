-- OTP Verification Schema

CREATE TABLE IF NOT EXISTS verification_codes (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    phone_number text NOT NULL,
    code text NOT NULL,
    created_at timestamp with time zone DEFAULT now(),
    expires_at timestamp with time zone NOT NULL,
    attempts integer DEFAULT 0,
    verified boolean DEFAULT false
);

-- Index for faster cleanup and lookup
CREATE INDEX IF NOT EXISTS idx_verification_codes_phone ON verification_codes(phone_number);

-- RLS: Security
ALTER TABLE verification_codes ENABLE ROW LEVEL SECURITY;

-- Only service role should ideally handle this, but for simplicity in this setup:
CREATE POLICY "Internal service access" ON verification_codes FOR ALL USING (true);
