export interface User {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  role: 'admin' | 'cppo' | 'ppo';
  unit_id?: number;
  active: boolean;
  created_at: Date;
  updated_at: Date;
}

export interface Unit {
  id: number;
  name: string;
  created_at: Date;
}

export interface Shift {
  id: number;
  user_id: number;
  shift_date: Date;
  shift_type: 'Office Hours' | 'In the Field' | 'E-Day';
  start_time?: string;
  end_time?: string;
  is_split_shift: boolean;
  is_on_call: boolean;
  notes?: string;
  created_at: Date;
  updated_at: Date;
}

export interface JWTPayload {
  id: number;
  email: string;
  role: string;
}

export interface AuthRequest extends Express.Request {
  user?: JWTPayload;
}

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
}
