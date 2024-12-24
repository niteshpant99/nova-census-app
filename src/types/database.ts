export type Database = {
    public: {
      Tables: {
        user_profiles: {
          Row: {
            id: string
            role: 'super_admin' | 'admin' | 'nurse' | 'viewer'
            departments: string[]
            created_at: string
            last_active: string | null
          }
          Insert: {
            id: string
            role: 'super_admin' | 'admin' | 'nurse' | 'viewer'
            departments: string[]
            created_at?: string
            last_active?: string | null
          }
          Update: {
            id?: string
            role?: 'super_admin' | 'admin' | 'nurse' | 'viewer'
            departments?: string[]
            created_at?: string
            last_active?: string | null
          }
        }
        census_entries: {
          Row: {
            id: string
            date: string
            department: string
            previous_patients: number
            admissions: number
            referrals_in: number
            department_transfers_in: number
            total_transfers_in: number // Computed
            recovered: number
            lama: number
            absconded: number
            referred_out: number
            not_improved: number
            deaths: number
            total_transfers_out: number // Computed
            current_patients: number // Computed
            ot_cases: number
            created_by: string
            created_at: string
            updated_at: string
            is_locked: boolean
          }
          Insert: {
            id?: string
            date: string
            department: string
            previous_patients: number
            admissions?: number
            referrals_in?: number
            department_transfers_in?: number
            recovered?: number
            lama?: number
            absconded?: number
            referred_out?: number
            not_improved?: number
            deaths?: number
            ot_cases?: number
            created_by: string
            created_at?: string
            updated_at?: string
            is_locked?: boolean
          }
          Update: {
            id?: string
            date?: string
            department?: string
            previous_patients?: number
            admissions?: number
            referrals_in?: number
            department_transfers_in?: number
            recovered?: number
            lama?: number
            absconded?: number
            referred_out?: number
            not_improved?: number
            deaths?: number
            ot_cases?: number
            created_by?: string
            created_at?: string
            updated_at?: string
            is_locked?: boolean
          }
        }
        audit_logs: {
          Row: {
            id: string
            table_name: string
            record_id: string
            action: string
            old_data: Record<string, unknown> | null
            new_data: Record<string, unknown> | null
            changed_by: string
            changed_at: string
          }
          Insert: {
            id?: string
            table_name: string
            record_id: string
            action: string
            old_data?: Record<string, unknown> | null
            new_data?: Record<string, unknown> | null
            changed_by: string
            changed_at?: string
          }
          Update: {
            id?: string
            table_name?: string
            record_id?: string
            action?: string
            old_data?: Record<string, unknown> | null
            new_data?: Record<string, unknown> | null
            changed_by?: string
            changed_at?: string
          }
        }
      }
      Functions: {
        create_super_admin: {
          Args: {
            auth_id: string
            departments?: string[]
          }
          Returns: void
        }
      }
    }
  }
  
  // Helper type to get table types
  export type Tables<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]
  
  // Helper types for each table
  export type UserProfile = Tables<'user_profiles'>['Row']
  export type CensusEntry = Tables<'census_entries'>['Row']
  export type AuditLog = Tables<'audit_logs'>['Row']
  
  // Helper types for inserts
  export type UserProfileInsert = Tables<'user_profiles'>['Insert']
  export type CensusEntryInsert = Tables<'census_entries'>['Insert']
  export type AuditLogInsert = Tables<'audit_logs'>['Insert']
  
  // Helper types for updates
  export type UserProfileUpdate = Tables<'user_profiles'>['Update']
  export type CensusEntryUpdate = Tables<'census_entries'>['Update']
  export type AuditLogUpdate = Tables<'audit_logs'>['Update']