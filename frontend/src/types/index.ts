export interface User {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  role: 'admin' | 'cppo' | 'ppo';
  unit_id?: number;
  active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Shift {
  id: number;
  user_id: number;
  shift_date: string;
  shift_type: 'Office Hours' | 'In the Field' | 'E-Day';
  start_time?: string;
  end_time?: string;
  is_split_shift: boolean;
  is_on_call: boolean;
  notes?: string;
  first_name?: string;
  last_name?: string;
  email?: string;
  created_at: string;
  updated_at: string;
}

export interface Unit {
  id: number;
  name: string;
  created_at: string;
}

export interface AuthContextType {
  user: User | null;
  token: string | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, first_name: string, last_name: string) => Promise<void>;
  logout: () => void;
}
