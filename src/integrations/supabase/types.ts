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
      career_preferences: {
        Row: {
          created_at: string
          experience_level: string | null
          id: string
          target_industry: string | null
          target_location: string | null
          target_role: string | null
          target_salary: string | null
          updated_at: string
          user_id: string
          walkthrough_completed: boolean
          work_style: string | null
        }
        Insert: {
          created_at?: string
          experience_level?: string | null
          id?: string
          target_industry?: string | null
          target_location?: string | null
          target_role?: string | null
          target_salary?: string | null
          updated_at?: string
          user_id: string
          walkthrough_completed?: boolean
          work_style?: string | null
        }
        Update: {
          created_at?: string
          experience_level?: string | null
          id?: string
          target_industry?: string | null
          target_location?: string | null
          target_role?: string | null
          target_salary?: string | null
          updated_at?: string
          user_id?: string
          walkthrough_completed?: boolean
          work_style?: string | null
        }
        Relationships: []
      }
      cover_letters: {
        Row: {
          company_name: string | null
          content: string | null
          created_at: string
          id: string
          job_title: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          company_name?: string | null
          content?: string | null
          created_at?: string
          id?: string
          job_title?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          company_name?: string | null
          content?: string | null
          created_at?: string
          id?: string
          job_title?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      interview_answers: {
        Row: {
          answer: string | null
          created_at: string
          feedback: Json
          id: string
          question: string
          score: number | null
          session_id: string
        }
        Insert: {
          answer?: string | null
          created_at?: string
          feedback?: Json
          id?: string
          question: string
          score?: number | null
          session_id: string
        }
        Update: {
          answer?: string | null
          created_at?: string
          feedback?: Json
          id?: string
          question?: string
          score?: number | null
          session_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "interview_answers_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "interview_sessions"
            referencedColumns: ["id"]
          },
        ]
      }
      interview_sessions: {
        Row: {
          company: string | null
          completed_at: string
          created_at: string
          id: string
          overall_score: number | null
          position: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          company?: string | null
          completed_at?: string
          created_at?: string
          id?: string
          overall_score?: number | null
          position?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          company?: string | null
          completed_at?: string
          created_at?: string
          id?: string
          overall_score?: number | null
          position?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      job_applications: {
        Row: {
          applied_date: string
          company_name: string
          created_at: string
          id: string
          job_title: string
          job_url: string | null
          location: string | null
          notes: string | null
          salary_range: string | null
          status: string
          updated_at: string
          user_id: string
        }
        Insert: {
          applied_date?: string
          company_name: string
          created_at?: string
          id?: string
          job_title: string
          job_url?: string | null
          location?: string | null
          notes?: string | null
          salary_range?: string | null
          status?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          applied_date?: string
          company_name?: string
          created_at?: string
          id?: string
          job_title?: string
          job_url?: string | null
          location?: string | null
          notes?: string | null
          salary_range?: string | null
          status?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      linkedin_optimizations: {
        Row: {
          created_at: string
          id: string
          optimized_content: string | null
          original_content: string | null
          target_role: string | null
          type: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          optimized_content?: string | null
          original_content?: string | null
          target_role?: string | null
          type?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          optimized_content?: string | null
          original_content?: string | null
          target_role?: string | null
          type?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          email: string | null
          email_notifications: boolean
          full_name: string | null
          id: string
          marketing_emails: boolean
          plan: string
          push_notifications: boolean
          stripe_customer_id: string | null
          stripe_subscription_id: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          email?: string | null
          email_notifications?: boolean
          full_name?: string | null
          id?: string
          marketing_emails?: boolean
          plan?: string
          push_notifications?: boolean
          stripe_customer_id?: string | null
          stripe_subscription_id?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          email?: string | null
          email_notifications?: boolean
          full_name?: string | null
          id?: string
          marketing_emails?: boolean
          plan?: string
          push_notifications?: boolean
          stripe_customer_id?: string | null
          stripe_subscription_id?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      radar_alerts: {
        Row: {
          created_at: string
          id: string
          insight: string | null
          is_read: boolean
          match_reasons: Json
          match_score: number
          signal_id: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          insight?: string | null
          is_read?: boolean
          match_reasons?: Json
          match_score?: number
          signal_id: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          insight?: string | null
          is_read?: boolean
          match_reasons?: Json
          match_score?: number
          signal_id?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "radar_alerts_signal_id_fkey"
            columns: ["signal_id"]
            isOneToOne: false
            referencedRelation: "radar_signals"
            referencedColumns: ["id"]
          },
        ]
      }
      radar_signals: {
        Row: {
          amount: string | null
          company_name: string
          company_size: string | null
          confidence: number | null
          created_at: string
          departments: Json
          description: string | null
          funding_stage: string | null
          hiring_window: string | null
          id: string
          industry: string | null
          likely_roles: Json
          location: string | null
          outreach_angle: string | null
          published_at: string | null
          signal_type: string | null
          source_name: string | null
          source_url: string | null
          updated_at: string
          why_now: string | null
        }
        Insert: {
          amount?: string | null
          company_name: string
          company_size?: string | null
          confidence?: number | null
          created_at?: string
          departments?: Json
          description?: string | null
          funding_stage?: string | null
          hiring_window?: string | null
          id?: string
          industry?: string | null
          likely_roles?: Json
          location?: string | null
          outreach_angle?: string | null
          published_at?: string | null
          signal_type?: string | null
          source_name?: string | null
          source_url?: string | null
          updated_at?: string
          why_now?: string | null
        }
        Update: {
          amount?: string | null
          company_name?: string
          company_size?: string | null
          confidence?: number | null
          created_at?: string
          departments?: Json
          description?: string | null
          funding_stage?: string | null
          hiring_window?: string | null
          id?: string
          industry?: string | null
          likely_roles?: Json
          location?: string | null
          outreach_angle?: string | null
          published_at?: string | null
          signal_type?: string | null
          source_name?: string | null
          source_url?: string | null
          updated_at?: string
          why_now?: string | null
        }
        Relationships: []
      }
      resumes: {
        Row: {
          ats_score: number | null
          content: Json
          created_at: string
          id: string
          template: string | null
          title: string
          updated_at: string
          user_id: string
        }
        Insert: {
          ats_score?: number | null
          content?: Json
          created_at?: string
          id?: string
          template?: string | null
          title?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          ats_score?: number | null
          content?: Json
          created_at?: string
          id?: string
          template?: string | null
          title?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      skill_gaps: {
        Row: {
          created_at: string
          id: string
          job_title: string | null
          match_percentage: number | null
          matching_skills: Json
          missing_skills: Json
          recommendations: Json
          required_skills: Json
          updated_at: string
          user_id: string
          user_skills: Json
        }
        Insert: {
          created_at?: string
          id?: string
          job_title?: string | null
          match_percentage?: number | null
          matching_skills?: Json
          missing_skills?: Json
          recommendations?: Json
          required_skills?: Json
          updated_at?: string
          user_id: string
          user_skills?: Json
        }
        Update: {
          created_at?: string
          id?: string
          job_title?: string | null
          match_percentage?: number | null
          matching_skills?: Json
          missing_skills?: Json
          recommendations?: Json
          required_skills?: Json
          updated_at?: string
          user_id?: string
          user_skills?: Json
        }
        Relationships: []
      }
      subscription_plans: {
        Row: {
          created_at: string
          description: string | null
          id: string
          is_active: boolean
          monthly_price: number
          name: string
          slug: string
          updated_at: string
          yearly_price: number
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          is_active?: boolean
          monthly_price?: number
          name: string
          slug: string
          updated_at?: string
          yearly_price?: number
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          is_active?: boolean
          monthly_price?: number
          name?: string
          slug?: string
          updated_at?: string
          yearly_price?: number
        }
        Relationships: []
      }
      usage_events: {
        Row: {
          created_at: string
          feature: string
          id: string
          metadata: Json
          user_id: string
        }
        Insert: {
          created_at?: string
          feature: string
          id?: string
          metadata?: Json
          user_id: string
        }
        Update: {
          created_at?: string
          feature?: string
          id?: string
          metadata?: Json
          user_id?: string
        }
        Relationships: []
      }
      user_subscriptions: {
        Row: {
          billing_cycle: string
          created_at: string
          current_period_end: string | null
          id: string
          plan_id: string | null
          plan_status: string
          price: number
          stripe_subscription_id: string | null
          tier: string
          updated_at: string
          user_id: string
        }
        Insert: {
          billing_cycle?: string
          created_at?: string
          current_period_end?: string | null
          id?: string
          plan_id?: string | null
          plan_status?: string
          price?: number
          stripe_subscription_id?: string | null
          tier?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          billing_cycle?: string
          created_at?: string
          current_period_end?: string | null
          id?: string
          plan_id?: string | null
          plan_status?: string
          price?: number
          stripe_subscription_id?: string | null
          tier?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_subscriptions_plan_id_fkey"
            columns: ["plan_id"]
            isOneToOne: false
            referencedRelation: "subscription_plans"
            referencedColumns: ["id"]
          },
        ]
      }
      user_usage: {
        Row: {
          created_at: string
          feature: string
          id: string
          reset_date: string | null
          updated_at: string
          used: number
          user_id: string
        }
        Insert: {
          created_at?: string
          feature: string
          id?: string
          reset_date?: string | null
          updated_at?: string
          used?: number
          user_id: string
        }
        Update: {
          created_at?: string
          feature?: string
          id?: string
          reset_date?: string | null
          updated_at?: string
          used?: number
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
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
    Enums: {},
  },
} as const
