
-- Table to represent a confidential chat room between exactly two users
create table public.private_chats (
  id uuid primary key default gen_random_uuid(),
  participant_a uuid references auth.users on delete cascade not null,
  participant_b uuid references auth.users on delete cascade not null,
  created_at timestamp with time zone default now() not null,
  -- Ensure a unique chat per participant pair (order-agnostic)
  unique (participant_a, participant_b)
);

-- Table for storing confidential chat messages
create table public.private_messages (
  id uuid primary key default gen_random_uuid(),
  chat_id uuid references public.private_chats(id) on delete cascade not null,
  sender_id uuid references auth.users on delete cascade not null,
  content text not null,
  sent_at timestamp with time zone default now() not null
);

-- Enable row level security
alter table public.private_chats enable row level security;
alter table public.private_messages enable row level security;

-- Only allow chat participants to select (view) their chat
create policy "Participants can view their own chat" on public.private_chats
  for select using (
    auth.uid() = participant_a or auth.uid() = participant_b
  );

-- Only allow participants to insert/view messages in their chat
create policy "Participants can insert messages" on public.private_messages
  for insert with check (
    auth.uid() = sender_id and
    chat_id in (select id from public.private_chats where auth.uid() = participant_a or auth.uid() = participant_b)
  );
create policy "Participants can view messages in their chat" on public.private_messages
  for select using (
    chat_id in (select id from public.private_chats where auth.uid() = participant_a or auth.uid() = participant_b)
  );

-- Only allow participants to update/delete their own messages
create policy "Message owner can update/delete their message" on public.private_messages
  for update using (auth.uid() = sender_id);
create policy "Message owner can delete their message" on public.private_messages
  for delete using (auth.uid() = sender_id);
