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
        Relationships: never[];
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
          parent_department: string | null;
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
          parent_department?: string | null;
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
          parent_department?: string | null;
          previous_patients?: number;
          recovered?: number | null;
          referrals_in?: number | null;
          referred_out?: number | null;
          total_transfers_in?: number | null;
          total_transfers_out?: number | null;
          updated_at?: string | null;
        };
        Relationships: never[];
      };
      user_profiles: {
        Row: {
          avatar_url: string | null;
          contact_number: string | null;
          created_at: string | null;
          departments: string[];
          display_name: string;
          email: string;
          full_name: string | null;
          id: string;
          initials: string | null;
          last_active: string | null;
          role: string;
        };
        Insert: {
          avatar_url?: string | null;
          contact_number?: string | null;
          created_at?: string | null;
          departments: string[];
          display_name: string;
          email: string;
          full_name?: string | null;
          id: string;
          initials?: string | null;
          last_active?: string | null;
          role: string;
        };
        Update: {
          avatar_url?: string | null;
          contact_number?: string | null;
          created_at?: string | null;
          departments?: string[];
          display_name?: string;
          email?: string;
          full_name?: string | null;
          id?: string;
          initials?: string | null;
          last_active?: string | null;
          role?: string;
        };
        Relationships: never[];
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

// This type is used by the Tables helper below, so we need to keep it
export type PublicSchema = Database[Extract<keyof Database, "public">];

// Keeping your existing table type helper
export type Tables<T extends keyof Database["public"]["Tables"]> = Database["public"]["Tables"][T];

// Keeping your existing type exports exactly as they are
export type UserProfile = Tables<"user_profiles">["Row"];
export type CensusEntry = Tables<"census_entries">["Row"];
export type AuditLog = Tables<"audit_logs">["Row"];

export type UserProfileInsert = Tables<"user_profiles">["Insert"];
export type CensusEntryInsert = Tables<"census_entries">["Insert"];
export type AuditLogInsert = Tables<"audit_logs">["Insert"];

export type UserProfileUpdate = Tables<"user_profiles">["Update"];
export type CensusEntryUpdate = Tables<"census_entries">["Update"];
export type AuditLogUpdate = Tables<"audit_logs">["Update"];