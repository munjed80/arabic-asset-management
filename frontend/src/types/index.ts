// Shared TypeScript types for the frontend

export type AssetStatus =
  | "in_stock"
  | "active"
  | "assigned"
  | "under_maintenance"
  | "damaged"
  | "lost"
  | "retired";

export type MovementType =
  | "assign"
  | "transfer"
  | "send_to_maintenance"
  | "return_from_maintenance"
  | "mark_lost"
  | "mark_damaged";

export interface Asset {
  id: number;
  asset_code: string;
  name: string;
  serial_number?: string;
  brand?: string;
  asset_model?: string;
  status: AssetStatus;
  acquisition_date?: string;
  purchase_cost?: number;
  warranty_end?: string;
  supplier?: string;
  notes?: string;
  category_id?: number;
  location_id?: number;
  department_id?: number;
  assigned_to_user_id?: number;
  created_at: string;
  updated_at: string;
}

export interface AssetMovement {
  id: number;
  asset_id: number;
  movement_type: MovementType;
  from_location_id?: number;
  to_location_id?: number;
  from_department_id?: number;
  to_department_id?: number;
  from_user_id?: number;
  to_user_id?: number;
  reason?: string;
  notes?: string;
  created_by?: number;
  created_at: string;
}

export interface User {
  id: number;
  email: string;
  full_name: string;
  role: "admin" | "manager" | "viewer";
  is_active: boolean;
}

export interface Category {
  id: number;
  name: string;
  description?: string;
}

export interface Location {
  id: number;
  name: string;
  address?: string;
}

export interface Department {
  id: number;
  name: string;
  description?: string;
}
