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
    PostgrestVersion: "13.0.4"
  }
  public: {
    Tables: {
      affiliates: {
        Row: {
          affiliate_code: string
          application_note: string | null
          approved_at: string | null
          approved_by: string | null
          available_balance: number
          commission_rate: number
          created_at: string
          id: string
          rejection_reason: string | null
          status: Database["public"]["Enums"]["affiliate_status"]
          total_earnings: number
          total_referrals: number
          updated_at: string
          user_id: string
        }
        Insert: {
          affiliate_code: string
          application_note?: string | null
          approved_at?: string | null
          approved_by?: string | null
          available_balance?: number
          commission_rate?: number
          created_at?: string
          id?: string
          rejection_reason?: string | null
          status?: Database["public"]["Enums"]["affiliate_status"]
          total_earnings?: number
          total_referrals?: number
          updated_at?: string
          user_id: string
        }
        Update: {
          affiliate_code?: string
          application_note?: string | null
          approved_at?: string | null
          approved_by?: string | null
          available_balance?: number
          commission_rate?: number
          created_at?: string
          id?: string
          rejection_reason?: string | null
          status?: Database["public"]["Enums"]["affiliate_status"]
          total_earnings?: number
          total_referrals?: number
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      ai_tips: {
        Row: {
          category: string | null
          created_at: string
          description: string
          id: string
          is_active: boolean | null
          is_global: boolean | null
          title: string
          updated_at: string
          user_id: string | null
        }
        Insert: {
          category?: string | null
          created_at?: string
          description: string
          id?: string
          is_active?: boolean | null
          is_global?: boolean | null
          title: string
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          category?: string | null
          created_at?: string
          description?: string
          id?: string
          is_active?: boolean | null
          is_global?: boolean | null
          title?: string
          updated_at?: string
          user_id?: string | null
        }
        Relationships: []
      }
      billing_invoices: {
        Row: {
          amount: number
          created_at: string
          description: string
          id: string
          invoice_number: string
          payment_method: string | null
          status: string
          updated_at: string
          user_id: string
        }
        Insert: {
          amount: number
          created_at?: string
          description: string
          id?: string
          invoice_number: string
          payment_method?: string | null
          status?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          amount?: number
          created_at?: string
          description?: string
          id?: string
          invoice_number?: string
          payment_method?: string | null
          status?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      career_preferences: {
        Row: {
          created_at: string
          experience_level: string | null
          id: string
          onboarding_completed: boolean | null
          preferred_tone: string | null
          target_industry: string | null
          target_role: string | null
          target_salary: string | null
          updated_at: string
          user_id: string
          walkthrough_completed: boolean | null
          work_style: string | null
        }
        Insert: {
          created_at?: string
          experience_level?: string | null
          id?: string
          onboarding_completed?: boolean | null
          preferred_tone?: string | null
          target_industry?: string | null
          target_role?: string | null
          target_salary?: string | null
          updated_at?: string
          user_id: string
          walkthrough_completed?: boolean | null
          work_style?: string | null
        }
        Update: {
          created_at?: string
          experience_level?: string | null
          id?: string
          onboarding_completed?: boolean | null
          preferred_tone?: string | null
          target_industry?: string | null
          target_role?: string | null
          target_salary?: string | null
          updated_at?: string
          user_id?: string
          walkthrough_completed?: boolean | null
          work_style?: string | null
        }
        Relationships: []
      }
      commissions: {
        Row: {
          affiliate_id: string
          amount: number
          commission_rate: number
          created_at: string
          description: string | null
          id: string
          referral_id: string | null
          status: string
          subscription_id: string | null
        }
        Insert: {
          affiliate_id: string
          amount: number
          commission_rate: number
          created_at?: string
          description?: string | null
          id?: string
          referral_id?: string | null
          status?: string
          subscription_id?: string | null
        }
        Update: {
          affiliate_id?: string
          amount?: number
          commission_rate?: number
          created_at?: string
          description?: string | null
          id?: string
          referral_id?: string | null
          status?: string
          subscription_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "commissions_affiliate_id_fkey"
            columns: ["affiliate_id"]
            isOneToOne: false
            referencedRelation: "affiliates"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "commissions_referral_id_fkey"
            columns: ["referral_id"]
            isOneToOne: false
            referencedRelation: "referrals"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "commissions_subscription_id_fkey"
            columns: ["subscription_id"]
            isOneToOne: false
            referencedRelation: "user_subscriptions"
            referencedColumns: ["id"]
          },
        ]
      }
      connected_services: {
        Row: {
          color_class: string | null
          created_at: string
          icon_name: string | null
          id: string
          is_connected: boolean | null
          service_description: string | null
          service_name: string
          updated_at: string
          user_id: string
        }
        Insert: {
          color_class?: string | null
          created_at?: string
          icon_name?: string | null
          id?: string
          is_connected?: boolean | null
          service_description?: string | null
          service_name: string
          updated_at?: string
          user_id: string
        }
        Update: {
          color_class?: string | null
          created_at?: string
          icon_name?: string | null
          id?: string
          is_connected?: boolean | null
          service_description?: string | null
          service_name?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      cover_letters: {
        Row: {
          company_name: string | null
          content: string
          created_at: string
          id: string
          job_title: string
          updated_at: string
          user_id: string
        }
        Insert: {
          company_name?: string | null
          content: string
          created_at?: string
          id?: string
          job_title: string
          updated_at?: string
          user_id: string
        }
        Update: {
          company_name?: string | null
          content?: string
          created_at?: string
          id?: string
          job_title?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      interview_answers: {
        Row: {
          answer: string
          created_at: string
          feedback: Json | null
          id: string
          question: string
          score: number
          session_id: string
        }
        Insert: {
          answer: string
          created_at?: string
          feedback?: Json | null
          id?: string
          question: string
          score: number
          session_id: string
        }
        Update: {
          answer?: string
          created_at?: string
          feedback?: Json | null
          id?: string
          question?: string
          score?: number
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
          completed_at: string
          created_at: string
          id: string
          overall_score: number
          position: string
          user_id: string
        }
        Insert: {
          completed_at?: string
          created_at?: string
          id?: string
          overall_score: number
          position: string
          user_id: string
        }
        Update: {
          completed_at?: string
          created_at?: string
          id?: string
          overall_score?: number
          position?: string
          user_id?: string
        }
        Relationships: []
      }
      job_applications: {
        Row: {
          applied_date: string
          company_name: string
          contact_email: string | null
          contact_person: string | null
          created_at: string
          deadline: string | null
          follow_up_date: string | null
          id: string
          job_title: string
          job_url: string | null
          location: string | null
          notes: string | null
          priority: string | null
          resume_id: string | null
          salary_range: string | null
          status: string
          updated_at: string
          user_id: string
        }
        Insert: {
          applied_date?: string
          company_name: string
          contact_email?: string | null
          contact_person?: string | null
          created_at?: string
          deadline?: string | null
          follow_up_date?: string | null
          id?: string
          job_title: string
          job_url?: string | null
          location?: string | null
          notes?: string | null
          priority?: string | null
          resume_id?: string | null
          salary_range?: string | null
          status?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          applied_date?: string
          company_name?: string
          contact_email?: string | null
          contact_person?: string | null
          created_at?: string
          deadline?: string | null
          follow_up_date?: string | null
          id?: string
          job_title?: string
          job_url?: string | null
          location?: string | null
          notes?: string | null
          priority?: string | null
          resume_id?: string | null
          salary_range?: string | null
          status?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "job_applications_resume_id_fkey"
            columns: ["resume_id"]
            isOneToOne: false
            referencedRelation: "resumes"
            referencedColumns: ["id"]
          },
        ]
      }
      payouts: {
        Row: {
          affiliate_id: string
          amount: number
          created_at: string
          id: string
          notes: string | null
          payment_details: Json | null
          payment_method: string | null
          processed_at: string | null
          processed_by: string | null
          status: Database["public"]["Enums"]["payout_status"]
          updated_at: string
        }
        Insert: {
          affiliate_id: string
          amount: number
          created_at?: string
          id?: string
          notes?: string | null
          payment_details?: Json | null
          payment_method?: string | null
          processed_at?: string | null
          processed_by?: string | null
          status?: Database["public"]["Enums"]["payout_status"]
          updated_at?: string
        }
        Update: {
          affiliate_id?: string
          amount?: number
          created_at?: string
          id?: string
          notes?: string | null
          payment_details?: Json | null
          payment_method?: string | null
          processed_at?: string | null
          processed_by?: string | null
          status?: Database["public"]["Enums"]["payout_status"]
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "payouts_affiliate_id_fkey"
            columns: ["affiliate_id"]
            isOneToOne: false
            referencedRelation: "affiliates"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          bio: string | null
          created_at: string
          full_name: string | null
          id: string
          location: string | null
          phone: string | null
          plan: string | null
          profile_completion: number | null
          updated_at: string
          user_id: string
          website: string | null
        }
        Insert: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string
          full_name?: string | null
          id?: string
          location?: string | null
          phone?: string | null
          plan?: string | null
          profile_completion?: number | null
          updated_at?: string
          user_id: string
          website?: string | null
        }
        Update: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string
          full_name?: string | null
          id?: string
          location?: string | null
          phone?: string | null
          plan?: string | null
          profile_completion?: number | null
          updated_at?: string
          user_id?: string
          website?: string | null
        }
        Relationships: []
      }
      referrals: {
        Row: {
          affiliate_id: string
          converted: boolean
          converted_at: string | null
          created_at: string
          id: string
          ip_address: string | null
          referral_code: string
          referred_user_id: string | null
          user_agent: string | null
        }
        Insert: {
          affiliate_id: string
          converted?: boolean
          converted_at?: string | null
          created_at?: string
          id?: string
          ip_address?: string | null
          referral_code: string
          referred_user_id?: string | null
          user_agent?: string | null
        }
        Update: {
          affiliate_id?: string
          converted?: boolean
          converted_at?: string | null
          created_at?: string
          id?: string
          ip_address?: string | null
          referral_code?: string
          referred_user_id?: string | null
          user_agent?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "referrals_affiliate_id_fkey"
            columns: ["affiliate_id"]
            isOneToOne: false
            referencedRelation: "affiliates"
            referencedColumns: ["id"]
          },
        ]
      }
      resume_analytics: {
        Row: {
          created_at: string
          downloads: number | null
          id: string
          resume_id: string | null
          updated_at: string
          user_id: string
          views: number | null
        }
        Insert: {
          created_at?: string
          downloads?: number | null
          id?: string
          resume_id?: string | null
          updated_at?: string
          user_id: string
          views?: number | null
        }
        Update: {
          created_at?: string
          downloads?: number | null
          id?: string
          resume_id?: string | null
          updated_at?: string
          user_id?: string
          views?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "resume_analytics_resume_id_fkey"
            columns: ["resume_id"]
            isOneToOne: false
            referencedRelation: "resumes"
            referencedColumns: ["id"]
          },
        ]
      }
      resume_scores: {
        Row: {
          created_at: string
          education_score: number | null
          experience_score: number | null
          formatting_score: number | null
          id: string
          keywords_score: number | null
          missing_keywords: string[] | null
          overall_score: number
          resume_id: string | null
          strengths: string[] | null
          suggestions: Json | null
          updated_at: string
          user_id: string
          weaknesses: string[] | null
        }
        Insert: {
          created_at?: string
          education_score?: number | null
          experience_score?: number | null
          formatting_score?: number | null
          id?: string
          keywords_score?: number | null
          missing_keywords?: string[] | null
          overall_score: number
          resume_id?: string | null
          strengths?: string[] | null
          suggestions?: Json | null
          updated_at?: string
          user_id: string
          weaknesses?: string[] | null
        }
        Update: {
          created_at?: string
          education_score?: number | null
          experience_score?: number | null
          formatting_score?: number | null
          id?: string
          keywords_score?: number | null
          missing_keywords?: string[] | null
          overall_score?: number
          resume_id?: string | null
          strengths?: string[] | null
          suggestions?: Json | null
          updated_at?: string
          user_id?: string
          weaknesses?: string[] | null
        }
        Relationships: [
          {
            foreignKeyName: "resume_scores_resume_id_fkey"
            columns: ["resume_id"]
            isOneToOne: false
            referencedRelation: "resumes"
            referencedColumns: ["id"]
          },
        ]
      }
      resume_templates: {
        Row: {
          ats_features: Json | null
          ats_friendly: boolean | null
          ats_score: number | null
          category: string
          created_at: string
          description: string
          id: string
          is_premium: boolean
          json_content: Json | null
          name: string
          preview_image: string | null
          styles: Json
          template: Json
          updated_at: string
        }
        Insert: {
          ats_features?: Json | null
          ats_friendly?: boolean | null
          ats_score?: number | null
          category?: string
          created_at?: string
          description: string
          id?: string
          is_premium?: boolean
          json_content?: Json | null
          name: string
          preview_image?: string | null
          styles: Json
          template: Json
          updated_at?: string
        }
        Update: {
          ats_features?: Json | null
          ats_friendly?: boolean | null
          ats_score?: number | null
          category?: string
          created_at?: string
          description?: string
          id?: string
          is_premium?: boolean
          json_content?: Json | null
          name?: string
          preview_image?: string | null
          styles?: Json
          template?: Json
          updated_at?: string
        }
        Relationships: []
      }
      resumes: {
        Row: {
          content: Json | null
          created_at: string
          id: string
          is_public: boolean | null
          template_name: string | null
          title: string
          updated_at: string
          user_id: string
        }
        Insert: {
          content?: Json | null
          created_at?: string
          id?: string
          is_public?: boolean | null
          template_name?: string | null
          title?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          content?: Json | null
          created_at?: string
          id?: string
          is_public?: boolean | null
          template_name?: string | null
          title?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      saved_jobs: {
        Row: {
          company: string
          created_at: string
          description: string | null
          id: string
          job_title: string
          job_url: string | null
          location: string | null
          salary: string | null
          user_id: string
        }
        Insert: {
          company: string
          created_at?: string
          description?: string | null
          id?: string
          job_title: string
          job_url?: string | null
          location?: string | null
          salary?: string | null
          user_id: string
        }
        Update: {
          company?: string
          created_at?: string
          description?: string | null
          id?: string
          job_title?: string
          job_url?: string | null
          location?: string | null
          salary?: string | null
          user_id?: string
        }
        Relationships: []
      }
      scouted_jobs: {
        Row: {
          company_name: string | null
          created_at: string
          id: number
          is_active: boolean | null
          job_title: string | null
          job_url: string | null
          location: string | null
          salary_range: string | null
          skills: string[] | null
        }
        Insert: {
          company_name?: string | null
          created_at?: string
          id?: number
          is_active?: boolean | null
          job_title?: string | null
          job_url?: string | null
          location?: string | null
          salary_range?: string | null
          skills?: string[] | null
        }
        Update: {
          company_name?: string | null
          created_at?: string
          id?: number
          is_active?: boolean | null
          job_title?: string | null
          job_url?: string | null
          location?: string | null
          salary_range?: string | null
          skills?: string[] | null
        }
        Relationships: []
      }
      skill_gaps: {
        Row: {
          created_at: string
          id: string
          job_title: string
          match_percentage: number | null
          matching_skills: string[]
          missing_skills: string[]
          recommendations: Json | null
          required_skills: string[]
          resume_id: string | null
          user_id: string
          user_skills: string[]
        }
        Insert: {
          created_at?: string
          id?: string
          job_title: string
          match_percentage?: number | null
          matching_skills: string[]
          missing_skills: string[]
          recommendations?: Json | null
          required_skills: string[]
          resume_id?: string | null
          user_id: string
          user_skills: string[]
        }
        Update: {
          created_at?: string
          id?: string
          job_title?: string
          match_percentage?: number | null
          matching_skills?: string[]
          missing_skills?: string[]
          recommendations?: Json | null
          required_skills?: string[]
          resume_id?: string | null
          user_id?: string
          user_skills?: string[]
        }
        Relationships: [
          {
            foreignKeyName: "skill_gaps_resume_id_fkey"
            columns: ["resume_id"]
            isOneToOne: false
            referencedRelation: "resumes"
            referencedColumns: ["id"]
          },
        ]
      }
      subscription_plans: {
        Row: {
          color_class: string | null
          created_at: string
          description: string | null
          features: Json | null
          icon_name: string | null
          id: string
          is_popular: boolean | null
          name: string
          price_monthly: number | null
          price_yearly: number | null
          updated_at: string
        }
        Insert: {
          color_class?: string | null
          created_at?: string
          description?: string | null
          features?: Json | null
          icon_name?: string | null
          id?: string
          is_popular?: boolean | null
          name: string
          price_monthly?: number | null
          price_yearly?: number | null
          updated_at?: string
        }
        Update: {
          color_class?: string | null
          created_at?: string
          description?: string | null
          features?: Json | null
          icon_name?: string | null
          id?: string
          is_popular?: boolean | null
          name?: string
          price_monthly?: number | null
          price_yearly?: number | null
          updated_at?: string
        }
        Relationships: []
      }
      user_activities: {
        Row: {
          created_at: string
          description: string | null
          id: string
          metadata: Json | null
          title: string
          type: string
          user_id: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          metadata?: Json | null
          title: string
          type: string
          user_id: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          metadata?: Json | null
          title?: string
          type?: string
          user_id?: string
        }
        Relationships: []
      }
      user_subscriptions: {
        Row: {
          billing_cycle: string | null
          created_at: string
          current_period_end: string | null
          features: Json | null
          id: string
          plan_id: string
          plan_status: string
          price: number | null
          tier: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          billing_cycle?: string | null
          created_at?: string
          current_period_end?: string | null
          features?: Json | null
          id?: string
          plan_id: string
          plan_status?: string
          price?: number | null
          tier?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          billing_cycle?: string | null
          created_at?: string
          current_period_end?: string | null
          features?: Json | null
          id?: string
          plan_id?: string
          plan_status?: string
          price?: number | null
          tier?: string | null
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
      user_usage_stats: {
        Row: {
          ai_generations: number | null
          created_at: string
          downloads: number | null
          id: string
          monthly_ai_generations: number | null
          monthly_pdf_downloads: number | null
          monthly_template_selections: number | null
          resumes_created: number | null
          templates_used: number | null
          updated_at: string
          usage_cycle_reset_date: string | null
          user_id: string
        }
        Insert: {
          ai_generations?: number | null
          created_at?: string
          downloads?: number | null
          id?: string
          monthly_ai_generations?: number | null
          monthly_pdf_downloads?: number | null
          monthly_template_selections?: number | null
          resumes_created?: number | null
          templates_used?: number | null
          updated_at?: string
          usage_cycle_reset_date?: string | null
          user_id: string
        }
        Update: {
          ai_generations?: number | null
          created_at?: string
          downloads?: number | null
          id?: string
          monthly_ai_generations?: number | null
          monthly_pdf_downloads?: number | null
          monthly_template_selections?: number | null
          resumes_created?: number | null
          templates_used?: number | null
          updated_at?: string
          usage_cycle_reset_date?: string | null
          user_id?: string
        }
        Relationships: []
      }
      webhook_logs: {
        Row: {
          created_at: string | null
          error: string | null
          event_type: string | null
          id: string
          payload: Json
          processed: boolean | null
        }
        Insert: {
          created_at?: string | null
          error?: string | null
          event_type?: string | null
          id?: string
          payload: Json
          processed?: boolean | null
        }
        Update: {
          created_at?: string | null
          error?: string | null
          event_type?: string | null
          id?: string
          payload?: Json
          processed?: boolean | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      generate_affiliate_code: { Args: never; Returns: string }
    }
    Enums: {
      affiliate_status: "pending" | "approved" | "rejected" | "suspended"
      payout_status: "pending" | "processing" | "paid" | "failed"
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
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
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
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
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
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
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
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
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
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
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
      affiliate_status: ["pending", "approved", "rejected", "suspended"],
      payout_status: ["pending", "processing", "paid", "failed"],
    },
  },
} as const
