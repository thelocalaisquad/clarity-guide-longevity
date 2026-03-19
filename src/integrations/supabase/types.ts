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
    PostgrestVersion: "14.1"
  }
  public: {
    Tables: {
      activity_log: {
        Row: {
          action_type: string
          created_at: string
          details: string | null
          id: string
          job_id: string | null
          user_id: string | null
        }
        Insert: {
          action_type: string
          created_at?: string
          details?: string | null
          id?: string
          job_id?: string | null
          user_id?: string | null
        }
        Update: {
          action_type?: string
          created_at?: string
          details?: string | null
          id?: string
          job_id?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "activity_log_job_id_fkey"
            columns: ["job_id"]
            isOneToOne: false
            referencedRelation: "content_jobs"
            referencedColumns: ["id"]
          },
        ]
      }
      comparison_page_technologies: {
        Row: {
          comparison_page_id: string
          technology_id: string
        }
        Insert: {
          comparison_page_id: string
          technology_id: string
        }
        Update: {
          comparison_page_id?: string
          technology_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "comparison_page_technologies_comparison_page_id_fkey"
            columns: ["comparison_page_id"]
            isOneToOne: false
            referencedRelation: "comparison_pages"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "comparison_page_technologies_technology_id_fkey"
            columns: ["technology_id"]
            isOneToOne: false
            referencedRelation: "technologies"
            referencedColumns: ["id"]
          },
        ]
      }
      comparison_pages: {
        Row: {
          content: string | null
          created_at: string
          id: string
          slug: string
          title: string
          updated_at: string
        }
        Insert: {
          content?: string | null
          created_at?: string
          id?: string
          slug: string
          title: string
          updated_at?: string
        }
        Update: {
          content?: string | null
          created_at?: string
          id?: string
          slug?: string
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      content_briefs: {
        Row: {
          angles: Json | null
          approved: boolean
          article_angle: string | null
          created_at: string
          headline_options: Json | null
          id: string
          job_id: string
          key_insights: Json | null
          key_quotes: Json | null
          newsletter_angle: string | null
          social_hooks: Json | null
          summary: string | null
          version: number
        }
        Insert: {
          angles?: Json | null
          approved?: boolean
          article_angle?: string | null
          created_at?: string
          headline_options?: Json | null
          id?: string
          job_id: string
          key_insights?: Json | null
          key_quotes?: Json | null
          newsletter_angle?: string | null
          social_hooks?: Json | null
          summary?: string | null
          version?: number
        }
        Update: {
          angles?: Json | null
          approved?: boolean
          article_angle?: string | null
          created_at?: string
          headline_options?: Json | null
          id?: string
          job_id?: string
          key_insights?: Json | null
          key_quotes?: Json | null
          newsletter_angle?: string | null
          social_hooks?: Json | null
          summary?: string | null
          version?: number
        }
        Relationships: [
          {
            foreignKeyName: "content_briefs_job_id_fkey"
            columns: ["job_id"]
            isOneToOne: false
            referencedRelation: "content_jobs"
            referencedColumns: ["id"]
          },
        ]
      }
      content_jobs: {
        Row: {
          content_type: string
          created_at: string
          guest_name: string | null
          id: string
          internal_notes: string | null
          owner_id: string | null
          primary_cta_label: string | null
          primary_cta_url: string | null
          product_name: string | null
          secondary_cta_label: string | null
          secondary_cta_url: string | null
          status: string
          tags: string[] | null
          target_audience: string | null
          title: string
          updated_at: string
        }
        Insert: {
          content_type?: string
          created_at?: string
          guest_name?: string | null
          id?: string
          internal_notes?: string | null
          owner_id?: string | null
          primary_cta_label?: string | null
          primary_cta_url?: string | null
          product_name?: string | null
          secondary_cta_label?: string | null
          secondary_cta_url?: string | null
          status?: string
          tags?: string[] | null
          target_audience?: string | null
          title: string
          updated_at?: string
        }
        Update: {
          content_type?: string
          created_at?: string
          guest_name?: string | null
          id?: string
          internal_notes?: string | null
          owner_id?: string | null
          primary_cta_label?: string | null
          primary_cta_url?: string | null
          product_name?: string | null
          secondary_cta_label?: string | null
          secondary_cta_url?: string | null
          status?: string
          tags?: string[] | null
          target_audience?: string | null
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      content_outputs: {
        Row: {
          approved: boolean
          body: string | null
          channel: string
          created_at: string
          id: string
          job_id: string
          meta_description: string | null
          meta_title: string | null
          output_group: string
          slug: string | null
          title: string | null
          updated_at: string
          version: number
        }
        Insert: {
          approved?: boolean
          body?: string | null
          channel?: string
          created_at?: string
          id?: string
          job_id: string
          meta_description?: string | null
          meta_title?: string | null
          output_group?: string
          slug?: string | null
          title?: string | null
          updated_at?: string
          version?: number
        }
        Update: {
          approved?: boolean
          body?: string | null
          channel?: string
          created_at?: string
          id?: string
          job_id?: string
          meta_description?: string | null
          meta_title?: string | null
          output_group?: string
          slug?: string | null
          title?: string | null
          updated_at?: string
          version?: number
        }
        Relationships: [
          {
            foreignKeyName: "content_outputs_job_id_fkey"
            columns: ["job_id"]
            isOneToOne: false
            referencedRelation: "content_jobs"
            referencedColumns: ["id"]
          },
        ]
      }
      content_sources: {
        Row: {
          created_at: string
          id: string
          job_id: string
          research_notes: string | null
          source_status: string
          transcript_file_url: string | null
          transcript_text: string | null
          video_url: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          job_id: string
          research_notes?: string | null
          source_status?: string
          transcript_file_url?: string | null
          transcript_text?: string | null
          video_url?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          job_id?: string
          research_notes?: string | null
          source_status?: string
          transcript_file_url?: string | null
          transcript_text?: string | null
          video_url?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "content_sources_job_id_fkey"
            columns: ["job_id"]
            isOneToOne: false
            referencedRelation: "content_jobs"
            referencedColumns: ["id"]
          },
        ]
      }
      editions: {
        Row: {
          author: string
          body_html: string | null
          canonical_url: string | null
          category: string
          created_at: string
          edition_number: string
          expert_credential: string | null
          expert_name: string | null
          expert_photo_url: string | null
          expert_title: string | null
          faqs: Json | null
          id: string
          is_published: boolean
          lead_summary: string | null
          lead_summary_plain: string | null
          meta_description: string | null
          og_image: string | null
          product_cta_url: string | null
          product_description: string | null
          product_image_alt: string | null
          product_image_url: string | null
          product_name: string | null
          product_price_range: string | null
          published_date: string
          raw_information: string | null
          read_time: string
          section_how_it_works: string | null
          section_what_is_it: string | null
          section_who_is_it_for: string | null
          section_why_different: string | null
          slug: string
          title: string
          updated_at: string
          video_caption: string | null
          video_embed_url: string | null
          video_title: string | null
        }
        Insert: {
          author?: string
          body_html?: string | null
          canonical_url?: string | null
          category?: string
          created_at?: string
          edition_number: string
          expert_credential?: string | null
          expert_name?: string | null
          expert_photo_url?: string | null
          expert_title?: string | null
          faqs?: Json | null
          id?: string
          is_published?: boolean
          lead_summary?: string | null
          lead_summary_plain?: string | null
          meta_description?: string | null
          og_image?: string | null
          product_cta_url?: string | null
          product_description?: string | null
          product_image_alt?: string | null
          product_image_url?: string | null
          product_name?: string | null
          product_price_range?: string | null
          published_date?: string
          raw_information?: string | null
          read_time?: string
          section_how_it_works?: string | null
          section_what_is_it?: string | null
          section_who_is_it_for?: string | null
          section_why_different?: string | null
          slug: string
          title: string
          updated_at?: string
          video_caption?: string | null
          video_embed_url?: string | null
          video_title?: string | null
        }
        Update: {
          author?: string
          body_html?: string | null
          canonical_url?: string | null
          category?: string
          created_at?: string
          edition_number?: string
          expert_credential?: string | null
          expert_name?: string | null
          expert_photo_url?: string | null
          expert_title?: string | null
          faqs?: Json | null
          id?: string
          is_published?: boolean
          lead_summary?: string | null
          lead_summary_plain?: string | null
          meta_description?: string | null
          og_image?: string | null
          product_cta_url?: string | null
          product_description?: string | null
          product_image_alt?: string | null
          product_image_url?: string | null
          product_name?: string | null
          product_price_range?: string | null
          published_date?: string
          raw_information?: string | null
          read_time?: string
          section_how_it_works?: string | null
          section_what_is_it?: string | null
          section_who_is_it_for?: string | null
          section_why_different?: string | null
          slug?: string
          title?: string
          updated_at?: string
          video_caption?: string | null
          video_embed_url?: string | null
          video_title?: string | null
        }
        Relationships: []
      }
      operator_page_technologies: {
        Row: {
          operator_page_id: string
          technology_id: string
        }
        Insert: {
          operator_page_id: string
          technology_id: string
        }
        Update: {
          operator_page_id?: string
          technology_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "operator_page_technologies_operator_page_id_fkey"
            columns: ["operator_page_id"]
            isOneToOne: false
            referencedRelation: "operator_pages"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "operator_page_technologies_technology_id_fkey"
            columns: ["technology_id"]
            isOneToOne: false
            referencedRelation: "technologies"
            referencedColumns: ["id"]
          },
        ]
      }
      operator_pages: {
        Row: {
          content: Json | null
          created_at: string
          id: string
          slug: string
          summary: string | null
          title: string
          updated_at: string
        }
        Insert: {
          content?: Json | null
          created_at?: string
          id?: string
          slug: string
          summary?: string | null
          title: string
          updated_at?: string
        }
        Update: {
          content?: Json | null
          created_at?: string
          id?: string
          slug?: string
          summary?: string | null
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      products: {
        Row: {
          created_at: string
          description: string | null
          id: string
          installation_notes: string | null
          is_commercial: boolean
          name: string
          safety_notes: string | null
          slug: string
          specs: Json | null
          technology_id: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          installation_notes?: string | null
          is_commercial?: boolean
          name: string
          safety_notes?: string | null
          slug: string
          specs?: Json | null
          technology_id?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          installation_notes?: string | null
          is_commercial?: boolean
          name?: string
          safety_notes?: string | null
          slug?: string
          specs?: Json | null
          technology_id?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "products_technology_id_fkey"
            columns: ["technology_id"]
            isOneToOne: false
            referencedRelation: "technologies"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          created_at: string
          email: string
          full_name: string | null
          id: string
        }
        Insert: {
          created_at?: string
          email: string
          full_name?: string | null
          id: string
        }
        Update: {
          created_at?: string
          email?: string
          full_name?: string | null
          id?: string
        }
        Relationships: []
      }
      publishing_jobs: {
        Row: {
          created_at: string
          destination: string
          error_message: string | null
          id: string
          job_id: string
          output_id: string | null
          payload_json: Json | null
          response_body: string | null
          response_code: number | null
          status: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          destination: string
          error_message?: string | null
          id?: string
          job_id: string
          output_id?: string | null
          payload_json?: Json | null
          response_body?: string | null
          response_code?: number | null
          status?: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          destination?: string
          error_message?: string | null
          id?: string
          job_id?: string
          output_id?: string | null
          payload_json?: Json | null
          response_body?: string | null
          response_code?: number | null
          status?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "publishing_jobs_job_id_fkey"
            columns: ["job_id"]
            isOneToOne: false
            referencedRelation: "content_jobs"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "publishing_jobs_output_id_fkey"
            columns: ["output_id"]
            isOneToOne: false
            referencedRelation: "content_outputs"
            referencedColumns: ["id"]
          },
        ]
      }
      publishing_targets: {
        Row: {
          active: boolean
          created_at: string
          id: string
          name: string
          target_type: string
          webhook_url: string | null
        }
        Insert: {
          active?: boolean
          created_at?: string
          id?: string
          name: string
          target_type?: string
          webhook_url?: string | null
        }
        Update: {
          active?: boolean
          created_at?: string
          id?: string
          name?: string
          target_type?: string
          webhook_url?: string | null
        }
        Relationships: []
      }
      technologies: {
        Row: {
          created_at: string
          description: string | null
          evidence: string | null
          faqs: Json | null
          how_it_works: string | null
          id: string
          individual_use: string | null
          name: string
          operator_use: string | null
          slug: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          evidence?: string | null
          faqs?: Json | null
          how_it_works?: string | null
          id?: string
          individual_use?: string | null
          name: string
          operator_use?: string | null
          slug: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          evidence?: string | null
          faqs?: Json | null
          how_it_works?: string | null
          id?: string
          individual_use?: string | null
          name?: string
          operator_use?: string | null
          slug?: string
          updated_at?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
      video_technologies: {
        Row: {
          technology_id: string
          video_id: string
        }
        Insert: {
          technology_id: string
          video_id: string
        }
        Update: {
          technology_id?: string
          video_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "video_technologies_technology_id_fkey"
            columns: ["technology_id"]
            isOneToOne: false
            referencedRelation: "technologies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "video_technologies_video_id_fkey"
            columns: ["video_id"]
            isOneToOne: false
            referencedRelation: "videos"
            referencedColumns: ["id"]
          },
        ]
      }
      videos: {
        Row: {
          audience_label: string | null
          created_at: string
          id: string
          slug: string
          summary: string | null
          title: string
          transcript: string | null
          updated_at: string
          youtube_url: string
        }
        Insert: {
          audience_label?: string | null
          created_at?: string
          id?: string
          slug: string
          summary?: string | null
          title: string
          transcript?: string | null
          updated_at?: string
          youtube_url: string
        }
        Update: {
          audience_label?: string | null
          created_at?: string
          id?: string
          slug?: string
          summary?: string | null
          title?: string
          transcript?: string | null
          updated_at?: string
          youtube_url?: string
        }
        Relationships: []
      }
      visual_assets: {
        Row: {
          approved: boolean
          created_at: string
          cta_text: string | null
          id: string
          image_url: string | null
          job_id: string
          output_image_url: string | null
          overlay_headline: string | null
          overlay_subheadline: string | null
          platform: string
          related_output_id: string | null
          template_name: string
          updated_at: string
        }
        Insert: {
          approved?: boolean
          created_at?: string
          cta_text?: string | null
          id?: string
          image_url?: string | null
          job_id: string
          output_image_url?: string | null
          overlay_headline?: string | null
          overlay_subheadline?: string | null
          platform?: string
          related_output_id?: string | null
          template_name?: string
          updated_at?: string
        }
        Update: {
          approved?: boolean
          created_at?: string
          cta_text?: string | null
          id?: string
          image_url?: string | null
          job_id?: string
          output_image_url?: string | null
          overlay_headline?: string | null
          overlay_subheadline?: string | null
          platform?: string
          related_output_id?: string | null
          template_name?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "visual_assets_job_id_fkey"
            columns: ["job_id"]
            isOneToOne: false
            referencedRelation: "content_jobs"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "visual_assets_related_output_id_fkey"
            columns: ["related_output_id"]
            isOneToOne: false
            referencedRelation: "content_outputs"
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
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      is_editor_or_admin: { Args: { _user_id: string }; Returns: boolean }
    }
    Enums: {
      app_role: "admin" | "editor"
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
      app_role: ["admin", "editor"],
    },
  },
} as const
