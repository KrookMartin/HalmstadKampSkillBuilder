export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.18"
  }
  graphql_public: {
    Tables: {
      [_ in never]: never
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      graphql: {
        Args: {
          extensions?: Json
          operationName?: string
          query?: string
          variables?: Json
        }
        Returns: Json
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
  public: {
    Tables: {
      profiles: {
        Row: {
          created_at: string
          email: string
          id: string
          name: string | null
          role: Database["public"]["Enums"]["user_role"]
          status: Database["public"]["Enums"]["user_status"]
        }
        Insert: {
          created_at?: string
          email: string
          id: string
          name?: string | null
          role?: Database["public"]["Enums"]["user_role"]
          status?: Database["public"]["Enums"]["user_status"]
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          name?: string | null
          role?: Database["public"]["Enums"]["user_role"]
          status?: Database["public"]["Enums"]["user_status"]
        }
        Relationships: []
      }
      session_techniques: {
        Row: {
          id: string
          position: number
          session_id: string
          technique_id: string
        }
        Insert: {
          id?: string
          position: number
          session_id: string
          technique_id: string
        }
        Update: {
          id?: string
          position?: number
          session_id?: string
          technique_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "session_techniques_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "sessions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "session_techniques_technique_id_fkey"
            columns: ["technique_id"]
            isOneToOne: false
            referencedRelation: "techniques"
            referencedColumns: ["id"]
          },
        ]
      }
      sessions: {
        Row: {
          class_type: string
          created_at: string
          created_by: string
          id: string
          notes: string | null
          published: boolean
          session_date: string
          time_slot: string
          updated_at: string
        }
        Insert: {
          class_type: string
          created_at?: string
          created_by: string
          id?: string
          notes?: string | null
          published?: boolean
          session_date: string
          time_slot: string
          updated_at?: string
        }
        Update: {
          class_type?: string
          created_at?: string
          created_by?: string
          id?: string
          notes?: string | null
          published?: boolean
          session_date?: string
          time_slot?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "sessions_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      strength_programs: {
        Row: {
          description: string | null
          id: string
          title: string
          total_weeks: number
          type: Database["public"]["Enums"]["program_type"]
          updated_at: string
        }
        Insert: {
          description?: string | null
          id?: string
          title: string
          total_weeks: number
          type: Database["public"]["Enums"]["program_type"]
          updated_at?: string
        }
        Update: {
          description?: string | null
          id?: string
          title?: string
          total_weeks?: number
          type?: Database["public"]["Enums"]["program_type"]
          updated_at?: string
        }
        Relationships: []
      }
      strength_weeks: {
        Row: {
          content: string
          id: string
          program_id: string
          title: string
          week_number: number
        }
        Insert: {
          content: string
          id?: string
          program_id: string
          title: string
          week_number: number
        }
        Update: {
          content?: string
          id?: string
          program_id?: string
          title?: string
          week_number?: number
        }
        Relationships: [
          {
            foreignKeyName: "strength_weeks_program_id_fkey"
            columns: ["program_id"]
            isOneToOne: false
            referencedRelation: "strength_programs"
            referencedColumns: ["id"]
          },
        ]
      }
      techniques: {
        Row: {
          category: Database["public"]["Enums"]["technique_category"]
          created_at: string
          created_by: string
          id: string
          level: Database["public"]["Enums"]["technique_level"]
          notes: string | null
          title: string
          updated_at: string
          youtube_url: string
        }
        Insert: {
          category: Database["public"]["Enums"]["technique_category"]
          created_at?: string
          created_by: string
          id?: string
          level: Database["public"]["Enums"]["technique_level"]
          notes?: string | null
          title: string
          updated_at?: string
          youtube_url: string
        }
        Update: {
          category?: Database["public"]["Enums"]["technique_category"]
          created_at?: string
          created_by?: string
          id?: string
          level?: Database["public"]["Enums"]["technique_level"]
          notes?: string | null
          title?: string
          updated_at?: string
          youtube_url?: string
        }
        Relationships: [
          {
            foreignKeyName: "techniques_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_role: {
        Args: { roles: Database["public"]["Enums"]["user_role"][] }
        Returns: boolean
      }
    }
    Enums: {
      program_type: "base" | "peak"
      technique_category:
        | "guards"
        | "passing"
        | "takedowns"
        | "upper_body_submissions"
        | "lower_body_submissions"
        | "sweeps"
      technique_level: "beginner" | "intermediate" | "advanced"
      user_role: "member" | "coach" | "admin"
      user_status: "pending" | "active" | "inactive"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends (DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never) = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends (PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never) = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  graphql_public: {
    Enums: {},
  },
  public: {
    Enums: {
      program_type: ["base", "peak"],
      technique_category: [
        "guards",
        "passing",
        "takedowns",
        "upper_body_submissions",
        "lower_body_submissions",
        "sweeps",
      ],
      technique_level: ["beginner", "intermediate", "advanced"],
      user_role: ["member", "coach", "admin"],
      user_status: ["pending", "active", "inactive"],
    },
  },
} as const
