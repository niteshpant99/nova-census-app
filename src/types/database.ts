export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
  graphql_public: {
    Tables: Record<never, never>;
    Views: Record<never, never>;
    Functions: {
      graphql: {
        Args: {
          operationName?: string;
          query?: string;
          variables?: Json;
          extensions?: Json;
        };
        Returns: Json;
      };
    };
    Enums: Record<never, never>;
    CompositeTypes: Record<never, never>;
  };
  public: {
    Tables: {
      audit_logs: {
        Row: {
          action: string;
          changed_at: string | null;
          changed_by: string;
          id: string;
          new_data: Json | null;
          old_data: Json | null;
          record_id: string;
          table_name: string;
        };
        Insert: {
          action: string;
          changed_at?: string | null;
          changed_by: string;
          id?: string;
          new_data?: Json | null;
          old_data?: Json | null;
          record_id: string;
          table_name: string;
        };
        Update: {
          action?: string;
          changed_at?: string | null;
          changed_by?: string;
          id?: string;
          new_data?: Json | null;
          old_data?: Json | null;
          record_id?: string;
          table_name?: string;
        };
        Relationships: [];
      };
      census_entries: {
        Row: {
          absconded: number | null;
          admissions: number | null;
          created_at: string | null;
          created_by: string;
          current_patients: number | null;
          date: string;
          deaths: number | null;
          department: string;
          department_transfers_in: number | null;
          id: string;
          is_locked: boolean | null;
          lama: number | null;
          not_improved: number | null;
          ot_cases: number | null;
          previous_patients: number;
          recovered: number | null;
          referrals_in: number | null;
          referred_out: number | null;
          total_transfers_in: number | null;
          total_transfers_out: number | null;
          updated_at: string | null;
        };
        Insert: {
          absconded?: number | null;
          admissions?: number | null;
          created_at?: string | null;
          created_by: string;
          current_patients?: number | null;
          date: string;
          deaths?: number | null;
          department: string;
          department_transfers_in?: number | null;
          id?: string;
          is_locked?: boolean | null;
          lama?: number | null;
          not_improved?: number | null;
          ot_cases?: number | null;
          previous_patients: number;
          recovered?: number | null;
          referrals_in?: number | null;
          referred_out?: number | null;
          total_transfers_in?: number | null;
          total_transfers_out?: number | null;
          updated_at?: string | null;
        };
        Update: {
          absconded?: number | null;
          admissions?: number | null;
          created_at?: string | null;
          created_by?: string;
          current_patients?: number | null;
          date?: string;
          deaths?: number | null;
          department?: string;
          department_transfers_in?: number | null;
          id?: string;
          is_locked?: boolean | null;
          lama?: number | null;
          not_improved?: number | null;
          ot_cases?: number | null;
          previous_patients?: number;
          recovered?: number | null;
          referrals_in?: number | null;
          referred_out?: number | null;
          total_transfers_in?: number | null;
          total_transfers_out?: number | null;
          updated_at?: string | null;
        };
        Relationships: [];
      };
      user_profiles: {
        Row: {
          created_at: string | null;
          departments: string[];
          id: string;
          last_active: string | null;
          role: string;
        };
        Insert: {
          created_at?: string | null;
          departments: string[];
          id: string;
          last_active?: string | null;
          role: string;
        };
        Update: {
          created_at?: string | null;
          departments?: string[];
          id?: string;
          last_active?: string | null;
          role?: string;
        };
        Relationships: [];
      };
    };
    Views: Record<never, never>;
    Functions: {
      create_super_admin: {
        Args: {
          auth_id: string;
          departments?: string[];
        };
        Returns: undefined;
      };
    };
    Enums: Record<never, never>;
    CompositeTypes: Record<never, never>;
  };
};

type PublicSchema = Database[Extract<keyof Database, "public">];

export type Tables<T extends keyof Database["public"]["Tables"]> = Database["public"]["Tables"][T];

// Helper types for each table
export type UserProfile = Tables<"user_profiles">["Row"];
export type CensusEntry = Tables<"census_entries">["Row"];
export type AuditLog = Tables<"audit_logs">["Row"];

// Helper types for inserts
export type UserProfileInsert = Tables<"user_profiles">["Insert"];
export type CensusEntryInsert = Tables<"census_entries">["Insert"];
export type AuditLogInsert = Tables<"audit_logs">["Insert"];

// Helper types for updates
export type UserProfileUpdate = Tables<"user_profiles">["Update"];
export type CensusEntryUpdate = Tables<"census_entries">["Update"];
export type AuditLogUpdate = Tables<"audit_logs">["Update"];