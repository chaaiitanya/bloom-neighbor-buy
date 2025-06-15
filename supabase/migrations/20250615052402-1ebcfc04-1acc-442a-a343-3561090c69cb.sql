
-- Enable RLS if not already enabled (won't hurt to repeat)
ALTER TABLE public.private_chats ENABLE ROW LEVEL SECURITY;

-- Allow users to view chats they are part of (participant_a or participant_b is current user)
CREATE POLICY "Users can view their own chats"
  ON public.private_chats
  FOR SELECT
  USING (
    auth.uid() = participant_a OR auth.uid() = participant_b
  );

-- Allow users to create a chat where they are a participant (either a or b)
CREATE POLICY "Users can start chats where they are participant"
  ON public.private_chats
  FOR INSERT
  WITH CHECK (
    auth.uid() = participant_a OR auth.uid() = participant_b
  );
