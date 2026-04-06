export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          email: string
          username: string | null
          avatar_url: string | null
          full_name: string | null
          credits: number
          daily_generations: number
          last_generation_date: string
          total_generations: number
          subscription_tier: string
          subscription_expires_at: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          username?: string | null
          avatar_url?: string | null
          full_name?: string | null
          credits?: number
          daily_generations?: number
          last_generation_date?: string
          total_generations?: number
          subscription_tier?: string
          subscription_expires_at?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          username?: string | null
          avatar_url?: string | null
          full_name?: string | null
          credits?: number
          daily_generations?: number
          last_generation_date?: string
          total_generations?: number
          subscription_tier?: string
          subscription_expires_at?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      generations: {
        Row: {
          id: string
          user_id: string
          prompt: string
          negative_prompt: string | null
          model: string
          size: string
          quality: string
          style: string | null
          seed: number | null
          image_url: string | null
          thumbnail_url: string | null
          status: string
          error_message: string | null
          credits_used: number
          generation_time: number | null
          metadata: Json | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          prompt: string
          negative_prompt?: string | null
          model: string
          size?: string
          quality?: string
          style?: string | null
          seed?: number | null
          image_url?: string | null
          thumbnail_url?: string | null
          status?: string
          error_message?: string | null
          credits_used?: number
          generation_time?: number | null
          metadata?: Json | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          prompt?: string
          negative_prompt?: string | null
          model?: string
          size?: string
          quality?: string
          style?: string | null
          seed?: number | null
          image_url?: string | null
          thumbnail_url?: string | null
          status?: string
          error_message?: string | null
          credits_used?: number
          generation_time?: number | null
          metadata?: Json | null
          created_at?: string
        }
      }
      credits_transactions: {
        Row: {
          id: string
          user_id: string
          amount: number
          type: string
          description: string | null
          reference_id: string | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          amount: number
          type: string
          description?: string | null
          reference_id?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          amount?: number
          type?: string
          description?: string | null
          reference_id?: string | null
          created_at?: string
        }
      }
      notifications: {
        Row: {
          id: string
          user_id: string
          title: string
          message: string
          type: string
          status: number
          link: string | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          title: string
          message: string
          type?: string
          status?: number
          link?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          title?: string
          message?: string
          type?: string
          status?: number
          link?: string | null
          created_at?: string
        }
      }
    }
  }
}
