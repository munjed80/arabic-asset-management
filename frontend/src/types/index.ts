// Shared TypeScript types for the frontend

export type AssetStatus =
  | "in_stock"
  | "active"
  | "assigned"
  | "under_maintenance"
  | "damaged"
  | "lost"
  | "retired";

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
