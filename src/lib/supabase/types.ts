// Placeholder types until `npm run db:types` is run after migrations.
// Keep in sync with supabase/migrations/*.sql.

export type TechniqueCategory =
  | "guards"
  | "passing"
  | "takedowns"
  | "upper_body_submissions"
  | "lower_body_submissions"
  | "sweeps";

export type TechniqueLevel = "beginner" | "intermediate" | "advanced";

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
      sessions: {
        Row: {
          id: string;
          session_date: string;
          time_slot: string;
          class_type: string;
          notes: string | null;
          published: boolean;
          created_by: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          session_date: string;
          time_slot: string;
          class_type: string;
          notes?: string | null;
          published?: boolean;
          created_by: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          session_date?: string;
          time_slot?: string;
          class_type?: string;
          notes?: string | null;
          published?: boolean;
          created_by?: string;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      session_techniques: {
        Row: {
          id: string;
          session_id: string;
          technique_id: string;
          position: number;
        };
        Insert: {
          id?: string;
          session_id: string;
          technique_id: string;
          position: number;
        };
        Update: {
          id?: string;
          session_id?: string;
          technique_id?: string;
          position?: number;
        };
        Relationships: [
          {
            foreignKeyName: "session_techniques_session_id_fkey";
            columns: ["session_id"];
            referencedRelation: "sessions";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "session_techniques_technique_id_fkey";
            columns: ["technique_id"];
            referencedRelation: "techniques";
            referencedColumns: ["id"];
          }
        ];
      };
      strength_programs: {
        Row: {
          id: string;
          type: "base" | "peak";
          title: string;
          description: string | null;
          total_weeks: number;
          updated_at: string;
        };
        Insert: {
          id?: string;
          type: "base" | "peak";
          title: string;
          description?: string | null;
          total_weeks: number;
          updated_at?: string;
        };
        Update: {
          id?: string;
          type?: "base" | "peak";
          title?: string;
          description?: string | null;
          total_weeks?: number;
          updated_at?: string;
        };
        Relationships: [];
      };
      strength_weeks: {
        Row: {
          id: string;
          program_id: string;
          week_number: number;
          title: string;
          content: string;
        };
        Insert: {
          id?: string;
          program_id: string;
          week_number: number;
          title: string;
          content: string;
        };
        Update: {
          id?: string;
          program_id?: string;
          week_number?: number;
          title?: string;
          content?: string;
        };
        Relationships: [
          {
            foreignKeyName: "strength_weeks_program_id_fkey";
            columns: ["program_id"];
            referencedRelation: "strength_programs";
            referencedColumns: ["id"];
          }
        ];
      };
      member_peak_start: {
        Row: {
          member_id: string;
          started_at: string;
        };
        Insert: {
          member_id: string;
          started_at?: string;
        };
        Update: {
          member_id?: string;
          started_at?: string;
        };
        Relationships: [];
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
