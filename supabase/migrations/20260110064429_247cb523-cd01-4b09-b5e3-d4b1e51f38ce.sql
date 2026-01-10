-- Enum for user roles
CREATE TYPE public.app_role AS ENUM ('super_admin', 'house_admin', 'user');

-- Enum for profile types
CREATE TYPE public.profile_type AS ENUM ('individual', 'couple');

-- Enum for identity options
CREATE TYPE public.identity_type AS ENUM ('man', 'woman', 'non_binary', 'other');

-- Enum for interaction preferences
CREATE TYPE public.interaction_preference AS ENUM ('individuals', 'couples', 'all');

-- Enum for event participation status
CREATE TYPE public.participation_status AS ENUM ('listed', 'confirmed');

-- Houses (Event Venues) - Multi-tenant core table
CREATE TABLE public.houses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  logo_url TEXT,
  primary_color TEXT DEFAULT '#8B5CF6',
  secondary_color TEXT DEFAULT '#1A1F2C',
  custom_domain TEXT UNIQUE,
  rules TEXT,
  about TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- User profiles (linked to auth.users)
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
  house_id UUID REFERENCES public.houses(id) ON DELETE CASCADE NOT NULL,
  nickname TEXT NOT NULL,
  profile_type profile_type NOT NULL DEFAULT 'individual',
  age INTEGER NOT NULL CHECK (age >= 18),
  city TEXT NOT NULL,
  avatar_url TEXT,
  bio TEXT,
  identity identity_type NOT NULL DEFAULT 'other',
  identity_other TEXT,
  interaction_preference interaction_preference NOT NULL DEFAULT 'all',
  is_subscriber BOOLEAN DEFAULT false,
  subscription_expires_at TIMESTAMP WITH TIME ZONE,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- User roles table (security best practice)
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  house_id UUID REFERENCES public.houses(id) ON DELETE CASCADE,
  role app_role NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE (user_id, house_id, role)
);

-- Events
CREATE TABLE public.events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  house_id UUID REFERENCES public.houses(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  benefits TEXT,
  image_url TEXT,
  event_date DATE NOT NULL,
  start_time TIME NOT NULL,
  end_time TIME,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Event participations (list and confirmations)
CREATE TABLE public.event_participations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id UUID REFERENCES public.events(id) ON DELETE CASCADE NOT NULL,
  profile_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  status participation_status NOT NULL DEFAULT 'listed',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE (event_id, profile_id)
);

-- Connections (mutual interest)
CREATE TABLE public.connections (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id UUID REFERENCES public.events(id) ON DELETE CASCADE NOT NULL,
  profile_a_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  profile_b_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  is_mutual BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE (event_id, profile_a_id, profile_b_id)
);

-- Likes (interest demonstration)
CREATE TABLE public.likes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id UUID REFERENCES public.events(id) ON DELETE CASCADE NOT NULL,
  from_profile_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  to_profile_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE (event_id, from_profile_id, to_profile_id)
);

-- Chat messages
CREATE TABLE public.messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  connection_id UUID REFERENCES public.connections(id) ON DELETE CASCADE NOT NULL,
  sender_profile_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE public.houses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.event_participations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.connections ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.likes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;

-- Security definer function to check roles
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role, _house_id UUID DEFAULT NULL)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
      AND (house_id = _house_id OR _house_id IS NULL OR role = 'super_admin')
  )
$$;

-- Function to get user's house_id
CREATE OR REPLACE FUNCTION public.get_user_house_id(_user_id UUID)
RETURNS UUID
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT house_id FROM public.profiles WHERE user_id = _user_id LIMIT 1
$$;

-- Houses policies (public read for institutional pages)
CREATE POLICY "Anyone can view active houses" ON public.houses
  FOR SELECT USING (is_active = true);

CREATE POLICY "Super admins can manage all houses" ON public.houses
  FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'super_admin'))
  WITH CHECK (public.has_role(auth.uid(), 'super_admin'));

-- Profiles policies
CREATE POLICY "Users can view profiles from same house" ON public.profiles
  FOR SELECT TO authenticated
  USING (house_id = public.get_user_house_id(auth.uid()));

CREATE POLICY "Users can update own profile" ON public.profiles
  FOR UPDATE TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can insert own profile" ON public.profiles
  FOR INSERT TO authenticated
  WITH CHECK (user_id = auth.uid());

-- User roles policies
CREATE POLICY "Users can view own roles" ON public.user_roles
  FOR SELECT TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Super admins can manage all roles" ON public.user_roles
  FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'super_admin'))
  WITH CHECK (public.has_role(auth.uid(), 'super_admin'));

-- Events policies (public read for institutional pages)
CREATE POLICY "Anyone can view active events" ON public.events
  FOR SELECT USING (is_active = true);

CREATE POLICY "House admins can manage events" ON public.events
  FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'house_admin', house_id))
  WITH CHECK (public.has_role(auth.uid(), 'house_admin', house_id));

-- Event participations policies
CREATE POLICY "Users can view participations from same house events" ON public.event_participations
  FOR SELECT TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.events e
      WHERE e.id = event_id
      AND e.house_id = public.get_user_house_id(auth.uid())
    )
  );

CREATE POLICY "Users can manage own participations" ON public.event_participations
  FOR ALL TO authenticated
  USING (profile_id = (SELECT id FROM public.profiles WHERE user_id = auth.uid()))
  WITH CHECK (profile_id = (SELECT id FROM public.profiles WHERE user_id = auth.uid()));

-- Connections policies
CREATE POLICY "Users can view own connections" ON public.connections
  FOR SELECT TO authenticated
  USING (
    profile_a_id = (SELECT id FROM public.profiles WHERE user_id = auth.uid())
    OR profile_b_id = (SELECT id FROM public.profiles WHERE user_id = auth.uid())
  );

-- Likes policies
CREATE POLICY "Users can view likes involving them" ON public.likes
  FOR SELECT TO authenticated
  USING (
    from_profile_id = (SELECT id FROM public.profiles WHERE user_id = auth.uid())
    OR to_profile_id = (SELECT id FROM public.profiles WHERE user_id = auth.uid())
  );

CREATE POLICY "Subscribers can create likes" ON public.likes
  FOR INSERT TO authenticated
  WITH CHECK (
    from_profile_id = (SELECT id FROM public.profiles WHERE user_id = auth.uid() AND is_subscriber = true)
  );

-- Messages policies
CREATE POLICY "Users can view messages from their connections" ON public.messages
  FOR SELECT TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.connections c
      WHERE c.id = connection_id
      AND (c.profile_a_id = (SELECT id FROM public.profiles WHERE user_id = auth.uid())
           OR c.profile_b_id = (SELECT id FROM public.profiles WHERE user_id = auth.uid()))
    )
  );

CREATE POLICY "Users can send messages in their connections" ON public.messages
  FOR INSERT TO authenticated
  WITH CHECK (
    sender_profile_id = (SELECT id FROM public.profiles WHERE user_id = auth.uid())
    AND EXISTS (
      SELECT 1 FROM public.connections c
      WHERE c.id = connection_id
      AND c.is_mutual = true
      AND (c.profile_a_id = sender_profile_id OR c.profile_b_id = sender_profile_id)
    )
  );

-- Updated at trigger function
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply updated_at triggers
CREATE TRIGGER handle_houses_updated_at
  BEFORE UPDATE ON public.houses
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER handle_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER handle_events_updated_at
  BEFORE UPDATE ON public.events
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER handle_event_participations_updated_at
  BEFORE UPDATE ON public.event_participations
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- Enable realtime for messages
ALTER PUBLICATION supabase_realtime ADD TABLE public.messages;