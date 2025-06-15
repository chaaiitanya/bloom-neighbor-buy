
-- Create table for plant photos (supports multiple images per plant)
CREATE TABLE public.plant_photos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  plant_id UUID NOT NULL REFERENCES plants(id) ON DELETE CASCADE,
  photo_url TEXT NOT NULL,
  position SMALLINT, -- for ordering images (0 = cover/primary)
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- Users can read photos of public listings
ALTER TABLE public.plant_photos ENABLE ROW LEVEL SECURITY;

-- Allow all users (since listings are public) to view plant photos
CREATE POLICY "Allow all users to view plant photos"
  ON public.plant_photos FOR SELECT
  USING (true);

-- Allow owners to add photos to their own plants (when posting)
CREATE POLICY "Allow owners to insert photos for their own plants"
  ON public.plant_photos FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM plants
      WHERE plants.id = plant_photos.plant_id
        AND plants.user_id = auth.uid()
    )
  );

-- Allow owners to delete photos from their own plants
CREATE POLICY "Allow owners to delete plant photos"
  ON public.plant_photos FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM plants
      WHERE plants.id = plant_photos.plant_id
        AND plants.user_id = auth.uid()
    )
  );
