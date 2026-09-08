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
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      connections: {
        Row: {
          created_at: string | null
          event_id: string
          id: string
          is_mutual: boolean | null
          profile_a_id: string
          profile_b_id: string
        }
        Insert: {
          created_at?: string | null
          event_id: string
          id?: string
          is_mutual?: boolean | null
          profile_a_id: string
          profile_b_id: string
        }
        Update: {
          created_at?: string | null
          event_id?: string
          id?: string
          is_mutual?: boolean | null
          profile_a_id?: string
          profile_b_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "connections_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "events"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "connections_profile_a_id_fkey"
            columns: ["profile_a_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "connections_profile_b_id_fkey"
            columns: ["profile_b_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      event_participations: {
        Row: {
          created_at: string | null
          event_id: string
          id: string
          profile_id: string
          status: Database["public"]["Enums"]["participation_status"]
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          event_id: string
          id?: string
          profile_id: string
          status?: Database["public"]["Enums"]["participation_status"]
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          event_id?: string
          id?: string
          profile_id?: string
          status?: Database["public"]["Enums"]["participation_status"]
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "event_participations_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "events"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "event_participations_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      events: {
        Row: {
          benefits: string | null
          created_at: string | null
          description: string | null
          end_time: string | null
          event_date: string
          house_id: string
          id: string
          image_url: string | null
          is_active: boolean | null
          start_time: string
          title: string
          updated_at: string | null
        }
        Insert: {
          benefits?: string | null
          created_at?: string | null
          description?: string | null
          end_time?: string | null
          event_date: string
          house_id: string
          id?: string
          image_url?: string | null
          is_active?: boolean | null
          start_time: string
          title: string
          updated_at?: string | null
        }
        Update: {
          benefits?: string | null
          created_at?: string | null
          description?: string | null
          end_time?: string | null
          event_date?: string
          house_id?: string
          id?: string
          image_url?: string | null
          is_active?: boolean | null
          start_time?: string
          title?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "events_house_id_fkey"
            columns: ["house_id"]
            isOneToOne: false
            referencedRelation: "houses"
            referencedColumns: ["id"]
          },
        ]
      }
      houses: {
        Row: {
          about: string | null
          created_at: string | null
          custom_domain: string | null
          description: string | null
          id: string
          is_active: boolean | null
          logo_url: string | null
          name: string
          primary_color: string | null
          rules: string | null
          secondary_color: string | null
          slug: string
          updated_at: string | null
        }
        Insert: {
          about?: string | null
          created_at?: string | null
          custom_domain?: string | null
          description?: string | null
          id?: string
          is_active?: boolean | null
          logo_url?: string | null
          name: string
          primary_color?: string | null
          rules?: string | null
          secondary_color?: string | null
          slug: string
          updated_at?: string | null
        }
        Update: {
          about?: string | null
          created_at?: string | null
          custom_domain?: string | null
          description?: string | null
          id?: string
          is_active?: boolean | null
          logo_url?: string | null
          name?: string
          primary_color?: string | null
          rules?: string | null
          secondary_color?: string | null
          slug?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      likes: {
        Row: {
          created_at: string | null
          event_id: string
          from_profile_id: string
          id: string
          to_profile_id: string
        }
        Insert: {
          created_at?: string | null
          event_id: string
          from_profile_id: string
          id?: string
          to_profile_id: string
        }
        Update: {
          created_at?: string | null
          event_id?: string
          from_profile_id?: string
          id?: string
          to_profile_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "likes_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "events"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "likes_from_profile_id_fkey"
            columns: ["from_profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "likes_to_profile_id_fkey"
            columns: ["to_profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      messages: {
        Row: {
          connection_id: string
          content: string
          created_at: string | null
          id: string
          sender_profile_id: string
        }
        Insert: {
          connection_id: string
          content: string
          created_at?: string | null
          id?: string
          sender_profile_id: string
        }
        Update: {
          connection_id?: string
          content?: string
          created_at?: string | null
          id?: string
          sender_profile_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "messages_connection_id_fkey"
            columns: ["connection_id"]
            isOneToOne: false
            referencedRelation: "connections"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "messages_sender_profile_id_fkey"
            columns: ["sender_profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          age: number
          avatar_url: string | null
          bio: string | null
          city: string
          created_at: string | null
          house_id: string
          id: string
          identity: Database["public"]["Enums"]["identity_type"]
          identity_other: string | null
          interaction_preference: Database["public"]["Enums"]["interaction_preference"]
          is_active: boolean | null
          is_subscriber: boolean | null
          nickname: string
          profile_type: Database["public"]["Enums"]["profile_type"]
          subscription_expires_at: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          age: number
          avatar_url?: string | null
          bio?: string | null
          city: string
          created_at?: string | null
          house_id: string
          id?: string
          identity?: Database["public"]["Enums"]["identity_type"]
          identity_other?: string | null
          interaction_preference?: Database["public"]["Enums"]["interaction_preference"]
          is_active?: boolean | null
          is_subscriber?: boolean | null
          nickname: string
          profile_type?: Database["public"]["Enums"]["profile_type"]
          subscription_expires_at?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          age?: number
          avatar_url?: string | null
          bio?: string | null
          city?: string
          created_at?: string | null
          house_id?: string
          id?: string
          identity?: Database["public"]["Enums"]["identity_type"]
          identity_other?: string | null
          interaction_preference?: Database["public"]["Enums"]["interaction_preference"]
          is_active?: boolean | null
          is_subscriber?: boolean | null
          nickname?: string
          profile_type?: Database["public"]["Enums"]["profile_type"]
          subscription_expires_at?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "profiles_house_id_fkey"
            columns: ["house_id"]
            isOneToOne: false
            referencedRelation: "houses"
            referencedColumns: ["id"]
          },
        ]
      }
      user_roles: {
        Row: {
          created_at: string | null
          house_id: string | null
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string | null
          house_id?: string | null
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string | null
          house_id?: string | null
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_roles_house_id_fkey"
            columns: ["house_id"]
            isOneToOne: false
            referencedRelation: "houses"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_user_house_id: { Args: { _user_id: string }; Returns: string }
      has_role: {
        Args: {
          _house_id?: string
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "super_admin" | "house_admin" | "user"
      identity_type: "man" | "woman" | "non_binary" | "other"
      interaction_preference: "individuals" | "couples" | "all"
      participation_status: "listed" | "confirmed"
      profile_type: "individual" | "couple"
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
  public: {
    Enums: {
      app_role: ["super_admin", "house_admin", "user"],
      identity_type: ["man", "woman", "non_binary", "other"],
      interaction_preference: ["individuals", "couples", "all"],
      participation_status: ["listed", "confirmed"],
      profile_type: ["individual", "couple"],
    },
  },
} as const
