
-- Create the community_chat table for public group chat
CREATE TABLE public.community_chat (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sender_id UUID REFERENCES auth.users (id),
  sender_name TEXT,
  avatar_url TEXT,
  content TEXT NOT NULL,
  sent_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.community_chat ENABLE ROW LEVEL SECURITY;

-- Allow any logged-in user to SELECT (view) messages
CREATE POLICY "Logged-in users can view messages"
  ON public.community_chat
  FOR SELECT
  USING (auth.uid() IS NOT NULL);

-- Allow any logged-in user to INSERT (send message)
CREATE POLICY "Logged-in users can send messages"
  ON public.community_chat
  FOR INSERT
  WITH CHECK (auth.uid() = sender_id);

-- (Optional) Allow senders to DELETE their own messages
-- CREATE POLICY "Senders can delete their own messages"
--   ON public.community_chat
--   FOR DELETE
--   USING (auth.uid() = sender_id);

