// Shared TypeScript types for the frontend

export interface Asset {
  id: number;
  asset_tag: string;
  name: string;
  description?: string;
  serial_number?: string;
  status: "active" | "inactive" | "under_maintenance" | "disposed";
  purchase_date?: string;
  purchase_cost?: number;
  category_id?: number;
  location_id?: number;
  department_id?: number;
  assigned_to_id?: number;
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
