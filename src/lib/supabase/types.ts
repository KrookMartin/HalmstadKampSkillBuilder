// Placeholder types until `npm run db:types` is run after the first migration.
// Keep in sync with supabase/migrations/*.sql until generated types replace this.

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
      techniques: {
        Row: {
          id: string;
          title: string;
          category: TechniqueCategory;
          level: TechniqueLevel;
          youtube_url: string;
          notes: string | null;
          created_by: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          title: string;
          category: TechniqueCategory;
          level: TechniqueLevel;
          youtube_url: string;
          notes?: string | null;
          created_by: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          title?: string;
          category?: TechniqueCategory;
          level?: TechniqueLevel;
          youtube_url?: string;
          notes?: string | null;
          created_by?: string;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "techniques_created_by_fkey";
            columns: ["created_by"];
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          }
        ];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: {
      technique_category: TechniqueCategory;
      technique_level: TechniqueLevel;
      user_role: "member" | "coach" | "admin";
      user_status: "pending" | "active" | "inactive";
    };
  };
};

export type TechniqueCategory =
  | "guards"
  | "passing"
  | "takedowns"
  | "upper_body_submissions"
  | "lower_body_submissions"
  | "sweeps";

export type TechniqueLevel = "beginner" | "intermediate" | "advanced";
