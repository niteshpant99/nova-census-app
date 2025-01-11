// src/TODO.md
/**
 * Future Improvements post MVP
 * 
 * Department Handling:
 * - Create a shared types module for department structures
 * - Create a departments table in database
 * - Add proper constraints and validation
 * - Build department management UI for admins
 * - Consolidate department logic into a single service
 * 
 * Current approach works for MVP because:
 * - Department structure is simple and static
 * - Only one sub-department (cabin under post-op)
 * - Changes require developer intervention anyway
 * - Focus is on getting core functionality working
 */

# work related to fixing total patient addition on sql vs webapp
- [ ] Optimize patient count aggregation by moving it to database level using SQL GROUP BY and SUM
- [ ] Add appropriate indexes for date and department columns
- [ ] Consider materialized view for commonly accessed date ranges


 # need to make sure that there is no double addition, here is my census_entries table default values and value type: 
 [
  {
    "column_name": "id",
    "default_value": "uuid_generate_v4()",
    "is_not_null": true
  },
  {
    "column_name": "date",
    "default_value": null,
    "is_not_null": true
  },
  {
    "column_name": "department",
    "default_value": null,
    "is_not_null": true
  },
  {
    "column_name": "previous_patients",
    "default_value": null,
    "is_not_null": true
  },
  {
    "column_name": "admissions",
    "default_value": "0",
    "is_not_null": false
  },
  {
    "column_name": "referrals_in",
    "default_value": "0",
    "is_not_null": false
  },
  {
    "column_name": "department_transfers_in",
    "default_value": "0",
    "is_not_null": false
  },
  {
    "column_name": "total_transfers_in",
    "default_value": "((admissions + referrals_in) + department_transfers_in)",
    "is_not_null": false
  },
  {
    "column_name": "recovered",
    "default_value": "0",
    "is_not_null": false
  },
  {
    "column_name": "lama",
    "default_value": "0",
    "is_not_null": false
  },
  {
    "column_name": "absconded",
    "default_value": "0",
    "is_not_null": false
  },
  {
    "column_name": "referred_out",
    "default_value": "0",
    "is_not_null": false
  },
  {
    "column_name": "not_improved",
    "default_value": "0",
    "is_not_null": false
  },
  {
    "column_name": "deaths",
    "default_value": "0",
    "is_not_null": false
  },
  {
    "column_name": "total_transfers_out",
    "default_value": "(((((recovered + lama) + absconded) + referred_out) + not_improved) + deaths)",
    "is_not_null": false
  },
  {
    "column_name": "current_patients",
    "default_value": "((previous_patients + ((admissions + referrals_in) + department_transfers_in)) - (((((recovered + lama) + absconded) + referred_out) + not_improved) + deaths))",
    "is_not_null": false
  },
  {
    "column_name": "ot_cases",
    "default_value": "0",
    "is_not_null": false
  },
  {
    "column_name": "created_by",
    "default_value": null,
    "is_not_null": true
  },
  {
    "column_name": "created_at",
    "default_value": "now()",
    "is_not_null": false
  },
  {
    "column_name": "updated_at",
    "default_value": "now()",
    "is_not_null": false
  },
  {
    "column_name": "is_locked",
    "default_value": "false",
    "is_not_null": false
  },
  {
    "column_name": "parent_department",
    "default_value": null,
    "is_not_null": false
  }
]