-- updated_at helper
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS updated_at timestamptz NOT NULL DEFAULT now();
DROP TRIGGER IF EXISTS profiles_set_updated_at ON public.profiles;
CREATE TRIGGER profiles_set_updated_at BEFORE UPDATE ON public.profiles
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- families
CREATE TABLE public.families (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL DEFAULT 'My family',
  created_by uuid NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT, UPDATE ON public.families TO authenticated;
GRANT ALL ON public.families TO service_role;
ALTER TABLE public.families ENABLE ROW LEVEL SECURITY;

-- family_members
CREATE TABLE public.family_members (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  family_id uuid NOT NULL REFERENCES public.families(id) ON DELETE CASCADE,
  user_id uuid NOT NULL,
  role text NOT NULL DEFAULT 'parent',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (family_id, user_id)
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.family_members TO authenticated;
GRANT ALL ON public.family_members TO service_role;
ALTER TABLE public.family_members ENABLE ROW LEVEL SECURITY;

-- membership helper (security definer avoids recursive RLS)
CREATE OR REPLACE FUNCTION public.is_family_member(_family_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.family_members fm
    WHERE fm.family_id = _family_id AND fm.user_id = auth.uid()
  );
$$;

CREATE POLICY "members read their families" ON public.families
FOR SELECT TO authenticated USING (public.is_family_member(id) OR created_by = auth.uid());

CREATE POLICY "create own family" ON public.families
FOR INSERT TO authenticated WITH CHECK (created_by = auth.uid());

CREATE POLICY "members update their families" ON public.families
FOR UPDATE TO authenticated USING (public.is_family_member(id)) WITH CHECK (public.is_family_member(id));

CREATE POLICY "read own membership rows" ON public.family_members
FOR SELECT TO authenticated USING (user_id = auth.uid() OR public.is_family_member(family_id));

CREATE POLICY "join own family" ON public.family_members
FOR INSERT TO authenticated WITH CHECK (user_id = auth.uid());

CREATE POLICY "remove own membership" ON public.family_members
FOR DELETE TO authenticated USING (user_id = auth.uid());

-- child_profiles
CREATE TABLE public.child_profiles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  family_id uuid NOT NULL REFERENCES public.families(id) ON DELETE CASCADE,
  created_by uuid NOT NULL,
  name text NOT NULL,
  age integer NOT NULL DEFAULT 10,
  avatar text NOT NULL DEFAULT 'kojo',
  tier text NOT NULL DEFAULT 'junior',
  curriculum_level text,
  onboarding_step integer NOT NULL DEFAULT 0,
  onboarding_completed boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.child_profiles TO authenticated;
GRANT ALL ON public.child_profiles TO service_role;
ALTER TABLE public.child_profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "family manages child profiles" ON public.child_profiles
FOR ALL TO authenticated
USING (public.is_family_member(family_id))
WITH CHECK (public.is_family_member(family_id) AND created_by = auth.uid());

CREATE OR REPLACE FUNCTION public.owns_child_profile(_child_profile_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.child_profiles cp
    JOIN public.family_members fm ON fm.family_id = cp.family_id
    WHERE cp.id = _child_profile_id AND fm.user_id = auth.uid()
  );
$$;

-- learning progress for child profiles
CREATE TABLE public.learning_progress (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  child_profile_id uuid NOT NULL REFERENCES public.child_profiles(id) ON DELETE CASCADE,
  track_id text NOT NULL DEFAULT 'save',
  item_type text NOT NULL,
  item_id text NOT NULL,
  status text NOT NULL DEFAULT 'completed',
  score integer,
  max_score integer,
  details jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (child_profile_id, item_type, item_id)
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.learning_progress TO authenticated;
GRANT ALL ON public.learning_progress TO service_role;
ALTER TABLE public.learning_progress ENABLE ROW LEVEL SECURITY;

CREATE POLICY "family manages child progress" ON public.learning_progress
FOR ALL TO authenticated
USING (public.owns_child_profile(child_profile_id))
WITH CHECK (public.owns_child_profile(child_profile_id));

CREATE TRIGGER families_set_updated_at BEFORE UPDATE ON public.families
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
CREATE TRIGGER family_members_set_updated_at BEFORE UPDATE ON public.family_members
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
CREATE TRIGGER child_profiles_set_updated_at BEFORE UPDATE ON public.child_profiles
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
CREATE TRIGGER learning_progress_set_updated_at BEFORE UPDATE ON public.learning_progress
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
