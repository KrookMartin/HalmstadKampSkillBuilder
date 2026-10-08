// Placeholder types until `npx supabase gen types typescript --local` is run
// after the first migration. Add table stubs here so the rest of the codebase
// compiles while migrations are being written.

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          email: string;
          name: string | null;
          role: "member" | "coach" | "admin";
          status: "pending" | "active" | "inactive";
          created_at: string;
        };
        Insert: {
          id: string;
          email: string;
          name?: string | null;
          role?: "member" | "coach" | "admin";
          status?: "pending" | "active" | "inactive";
          created_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          name?: string | null;
          role?: "member" | "coach" | "admin";
          status?: "pending" | "active" | "inactive";
          created_at?: string;
        };
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
  };
};
