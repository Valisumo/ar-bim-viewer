-- Note: Skip the ALTER DATABASE command - it's not needed in hosted Supabase
-- The JWT secret is managed automatically by Supabase

-- Create profiles table
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
    email TEXT,
    full_name TEXT,
    avatar_url TEXT,
    role TEXT DEFAULT 'user' CHECK (role IN ('admin', 'user', 'guest')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create projects table
CREATE TABLE IF NOT EXISTS public.projects (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT,
    ifc_file_url TEXT,
    thumbnail_url TEXT,
    created_by UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    is_public BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create component_info table
CREATE TABLE IF NOT EXISTS public.component_info (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    project_id UUID REFERENCES public.projects(id) ON DELETE CASCADE,
    component_id TEXT NOT NULL,
    name TEXT NOT NULL,
    type TEXT,
    properties JSONB,
    maintenance_notes TEXT,
    last_inspection DATE,
    next_inspection DATE,
    status TEXT DEFAULT 'good' CHECK (status IN ('good', 'warning', 'critical')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(project_id, component_id)
);

-- Create storage bucket for IFC files
INSERT INTO storage.buckets (id, name, public) VALUES ('ifc-files', 'ifc-files', true);

-- Enable Row Level Security
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.component_info ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Public profiles are viewable by everyone" ON public.profiles
    FOR SELECT USING (true);

CREATE POLICY "Users can insert their own profile" ON public.profiles
    FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON public.profiles
    FOR UPDATE USING (auth.uid() = id);

-- Projects policies
CREATE POLICY "Public projects are viewable by everyone" ON public.projects
    FOR SELECT USING (is_public = true OR auth.uid() = created_by);

CREATE POLICY "Authenticated users can create projects" ON public.projects
    FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Users can update own projects" ON public.projects
    FOR UPDATE USING (auth.uid() = created_by);

CREATE POLICY "Users can delete own projects" ON public.projects
    FOR DELETE USING (auth.uid() = created_by);

-- Component info policies
CREATE POLICY "Component info viewable for accessible projects" ON public.component_info
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.projects 
            WHERE projects.id = component_info.project_id 
            AND (projects.is_public = true OR projects.created_by = auth.uid())
        )
    );

CREATE POLICY "Authenticated users can insert component info" ON public.component_info
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.projects 
            WHERE projects.id = component_info.project_id 
            AND projects.created_by = auth.uid()
        )
    );

CREATE POLICY "Users can update component info for own projects" ON public.component_info
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM public.projects 
            WHERE projects.id = component_info.project_id 
            AND projects.created_by = auth.uid()
        )
    );

CREATE POLICY "Users can delete component info for own projects" ON public.component_info
    FOR DELETE USING (
        EXISTS (
            SELECT 1 FROM public.projects 
            WHERE projects.id = component_info.project_id 
            AND projects.created_by = auth.uid()
        )
    );

-- Storage policies
CREATE POLICY "IFC files are publicly accessible" ON storage.objects
    FOR SELECT USING (bucket_id = 'ifc-files');

CREATE POLICY "Authenticated users can upload IFC files" ON storage.objects
    FOR INSERT WITH CHECK (bucket_id = 'ifc-files' AND auth.role() = 'authenticated');

CREATE POLICY "Users can update own IFC files" ON storage.objects
    FOR UPDATE USING (bucket_id = 'ifc-files' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can delete own IFC files" ON storage.objects
    FOR DELETE USING (bucket_id = 'ifc-files' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Function to handle new user registration
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (id, email, full_name)
    VALUES (
        NEW.id,
        NEW.email,
        COALESCE(NEW.raw_user_meta_data->>'full_name', 'New User')
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger for new user registration
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers for updated_at
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_projects_updated_at BEFORE UPDATE ON public.projects
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_component_info_updated_at BEFORE UPDATE ON public.component_info
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
