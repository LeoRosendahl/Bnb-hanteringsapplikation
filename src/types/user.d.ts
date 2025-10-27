interface NewUserProfile { 
  email: string;
  name: string;
}


interface Profile extends NewUserProfile {
    id: string; // samma som auth.users.id som är supabase egna tabell för auth.users
    name: string;
    email: string;
    is_admin: boolean
    created_at?: string;
}