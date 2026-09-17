-- Parent profiles
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY,
  full_name TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.profiles TO authenticated;
GRANT ALL ON public.profiles TO service_role;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "own profile select" ON public.profiles FOR SELECT TO authenticated USING (auth.uid() = id);
CREATE POLICY "own profile insert" ON public.profiles FOR INSERT TO authenticated WITH CHECK (auth.uid() = id);
CREATE POLICY "own profile update" ON public.profiles FOR UPDATE TO authenticated USING (auth.uid() = id);

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name)
  VALUES (NEW.id, NEW.raw_user_meta_data ->> 'full_name')
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$;
CREATE TRIGGER on_auth_user_created
AFTER INSERT ON auth.users
FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Children (learners)
CREATE TABLE public.children (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  parent_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  age INT NOT NULL DEFAULT 10,
  avatar TEXT NOT NULL DEFAULT 'kente',
  tier TEXT NOT NULL DEFAULT 'junior',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.children TO authenticated;
GRANT ALL ON public.children TO service_role;
ALTER TABLE public.children ENABLE ROW LEVEL SECURITY;
CREATE POLICY "parent manages children" ON public.children FOR ALL TO authenticated
  USING (auth.uid() = parent_id) WITH CHECK (auth.uid() = parent_id);

CREATE OR REPLACE FUNCTION public.owns_child(_child_id UUID)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (SELECT 1 FROM public.children c WHERE c.id = _child_id AND c.parent_id = auth.uid());
$$;

-- Lesson / activity progress
CREATE TABLE public.progress_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  child_id UUID NOT NULL REFERENCES public.children(id) ON DELETE CASCADE,
  track_id TEXT NOT NULL DEFAULT 'save',
  item_type TEXT NOT NULL,
  item_id TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'completed',
  score INT,
  max_score INT,
  details JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (child_id, item_type, item_id)
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.progress_events TO authenticated;
GRANT ALL ON public.progress_events TO service_role;
ALTER TABLE public.progress_events ENABLE ROW LEVEL SECURITY;
CREATE POLICY "parent manages child progress" ON public.progress_events FOR ALL TO authenticated
  USING (public.owns_child(child_id)) WITH CHECK (public.owns_child(child_id));

CREATE INDEX progress_events_child_idx ON public.progress_events (child_id);