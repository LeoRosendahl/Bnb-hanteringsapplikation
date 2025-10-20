interface NewUser { 
  email: string;
  username: string;
}


interface User extends NewUser {
    id: string; // samma som auth.users.id som är supabase egna tabell för auth.users
    username: string;
    email: string;
    created_at?: string;
}