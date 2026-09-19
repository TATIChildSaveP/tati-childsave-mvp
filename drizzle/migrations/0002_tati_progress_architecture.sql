-- 1. Close the family_members privilege hole: a user could previously insert
--    themselves into ANY family. Only the family creator may join.
CREATE OR REPLACE FUNCTION public.owns_family(_family_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path TO 'public'
AS $$
  SELECT EXISTS (SELECT 1 FROM public.families f WHERE f.id = _family_id AND f.created_by = auth.uid());
$$;

DROP POLICY IF EXISTS "join own family" ON public.family_members;
CREATE POLICY "creator joins own family" ON public.family_members
  FOR INSERT TO authenticated
  WITH CHECK (user_id = auth.uid() AND public.owns_family(family_id));

-- 2. Scenario sessions + decisions (previously browser-only localStorage)
CREATE TABLE public.scenario_sessions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  child_profile_id uuid NOT NULL REFERENCES public.child_profiles(id) ON DELETE CASCADE,
  scenario_id text NOT NULL,
  state jsonb NOT NULL DEFAULT '{}'::jsonb,
  current_node_id text,
  day_number integer NOT NULL DEFAULT 1,
  status text NOT NULL DEFAULT 'in_progress',
  completed_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (child_profile_id, scenario_id)
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.scenario_sessions TO authenticated;
GRANT ALL ON public.scenario_sessions TO service_role;
ALTER TABLE public.scenario_sessions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "family manages scenario sessions" ON public.scenario_sessions
  FOR ALL TO authenticated
  USING (public.owns_child_profile(child_profile_id))
  WITH CHECK (public.owns_child_profile(child_profile_id));
CREATE INDEX idx_scenario_sessions_child ON public.scenario_sessions(child_profile_id);
CREATE TRIGGER scenario_sessions_set_updated_at BEFORE UPDATE ON public.scenario_sessions
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TABLE public.scenario_decisions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id uuid NOT NULL REFERENCES public.scenario_sessions(id) ON DELETE CASCADE,
  child_profile_id uuid NOT NULL REFERENCES public.child_profiles(id) ON DELETE CASCADE,
  node_id text NOT NULL,
  choice_id text NOT NULL,
  day_number integer NOT NULL DEFAULT 1,
  details jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, DELETE ON public.scenario_decisions TO authenticated;
GRANT ALL ON public.scenario_decisions TO service_role;
ALTER TABLE public.scenario_decisions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "family manages scenario decisions" ON public.scenario_decisions
  FOR ALL TO authenticated
  USING (public.owns_child_profile(child_profile_id))
  WITH CHECK (public.owns_child_profile(child_profile_id));
CREATE INDEX idx_scenario_decisions_session ON public.scenario_decisions(session_id);
CREATE INDEX idx_scenario_decisions_child ON public.scenario_decisions(child_profile_id);

-- 3. Assessment attempts + responses (baseline vs growth for the parent dashboard)
CREATE TABLE public.assessment_attempts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  child_profile_id uuid NOT NULL REFERENCES public.child_profiles(id) ON DELETE CASCADE,
  assessment_id text NOT NULL,
  assessment_type text NOT NULL DEFAULT 'pre',
  points integer NOT NULL DEFAULT 0,
  max_points integer NOT NULL DEFAULT 0,
  competency_scores jsonb NOT NULL DEFAULT '{}'::jsonb,
  status text NOT NULL DEFAULT 'completed',
  completed_at timestamptz NOT NULL DEFAULT now(),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (child_profile_id, assessment_id)
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.assessment_attempts TO authenticated;
GRANT ALL ON public.assessment_attempts TO service_role;
ALTER TABLE public.assessment_attempts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "family manages assessment attempts" ON public.assessment_attempts
  FOR ALL TO authenticated
  USING (public.owns_child_profile(child_profile_id))
  WITH CHECK (public.owns_child_profile(child_profile_id));
CREATE INDEX idx_assessment_attempts_child ON public.assessment_attempts(child_profile_id);
CREATE TRIGGER assessment_attempts_set_updated_at BEFORE UPDATE ON public.assessment_attempts
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TABLE public.assessment_responses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  attempt_id uuid NOT NULL REFERENCES public.assessment_attempts(id) ON DELETE CASCADE,
  child_profile_id uuid NOT NULL REFERENCES public.child_profiles(id) ON DELETE CASCADE,
  question_id text NOT NULL,
  competency text NOT NULL,
  option_id text,
  points integer NOT NULL DEFAULT 0,
  max_points integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (attempt_id, question_id)
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.assessment_responses TO authenticated;
GRANT ALL ON public.assessment_responses TO service_role;
ALTER TABLE public.assessment_responses ENABLE ROW LEVEL SECURITY;
CREATE POLICY "family manages assessment responses" ON public.assessment_responses
  FOR ALL TO authenticated
  USING (public.owns_child_profile(child_profile_id))
  WITH CHECK (public.owns_child_profile(child_profile_id));
CREATE INDEX idx_assessment_responses_attempt ON public.assessment_responses(attempt_id);
CREATE INDEX idx_assessment_responses_child ON public.assessment_responses(child_profile_id);

-- 4. Achievements earned by a learner (badge catalogue stays in app data)
CREATE TABLE public.learner_achievements (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  child_profile_id uuid NOT NULL REFERENCES public.child_profiles(id) ON DELETE CASCADE,
  achievement_id text NOT NULL,
  celebrated boolean NOT NULL DEFAULT false,
  awarded_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (child_profile_id, achievement_id)
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.learner_achievements TO authenticated;
GRANT ALL ON public.learner_achievements TO service_role;
ALTER TABLE public.learner_achievements ENABLE ROW LEVEL SECURITY;
CREATE POLICY "family manages learner achievements" ON public.learner_achievements
  FOR ALL TO authenticated
  USING (public.owns_child_profile(child_profile_id))
  WITH CHECK (public.owns_child_profile(child_profile_id));
CREATE INDEX idx_learner_achievements_child ON public.learner_achievements(child_profile_id);

-- 5. Feedback from parents
CREATE TABLE public.feedback (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL DEFAULT auth.uid(),
  child_profile_id uuid REFERENCES public.child_profiles(id) ON DELETE SET NULL,
  context text NOT NULL DEFAULT 'general',
  rating integer,
  message text,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT ON public.feedback TO authenticated;
GRANT ALL ON public.feedback TO service_role;
ALTER TABLE public.feedback ENABLE ROW LEVEL SECURITY;
CREATE POLICY "own feedback insert" ON public.feedback
  FOR INSERT TO authenticated WITH CHECK (user_id = auth.uid());
CREATE POLICY "own feedback select" ON public.feedback
  FOR SELECT TO authenticated USING (user_id = auth.uid());
CREATE INDEX idx_feedback_user ON public.feedback(user_id);

-- 6. Useful indexes on existing progress tables
CREATE INDEX IF NOT EXISTS idx_learning_progress_child ON public.learning_progress(child_profile_id);
CREATE INDEX IF NOT EXISTS idx_child_profiles_family ON public.child_profiles(family_id);
CREATE INDEX IF NOT EXISTS idx_family_members_user ON public.family_members(user_id);
CREATE INDEX IF NOT EXISTS idx_family_members_family ON public.family_members(family_id);