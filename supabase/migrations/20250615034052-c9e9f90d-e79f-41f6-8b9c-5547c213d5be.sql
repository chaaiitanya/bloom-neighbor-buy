
-- Add extra profile fields
ALTER TABLE public.profiles
  ADD COLUMN location text,
  ADD COLUMN bio text,
  ADD COLUMN socials jsonb,
  ADD COLUMN qr_code_url text;

-- Table for plant favorites
CREATE TABLE public.favorites (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  plant_id uuid NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, plant_id)
);

-- Table for purchase/sale transactions
CREATE TABLE public.transactions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  buyer_id uuid NOT NULL,
  seller_id uuid NOT NULL,
  plant_id uuid NOT NULL,
  price numeric NOT NULL,
  sold_at timestamptz NOT NULL DEFAULT now()
);

-- Enable RLS and policies for privacy

ALTER TABLE public.favorites ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view their favorites" ON public.favorites
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert to favorites" ON public.favorites
  FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can delete their favorites" ON public.favorites
  FOR DELETE USING (auth.uid() = user_id);

ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view transactions (buyer or seller)" ON public.transactions
  FOR SELECT USING (auth.uid() = buyer_id OR auth.uid() = seller_id);
CREATE POLICY "Users can insert their transaction" ON public.transactions
  FOR INSERT WITH CHECK (auth.uid() = buyer_id OR auth.uid() = seller_id);

-- Add a profile rating field
ALTER TABLE public.profiles
  ADD COLUMN rating numeric DEFAULT 0;

-- Give profile owners permission to update their own details (avatar, name, etc)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Profile owners can view their profile" ON public.profiles
  FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Profile owners can update their profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

