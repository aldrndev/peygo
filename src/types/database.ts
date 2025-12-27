export type InvoiceType = "BILLING" | "PAYMENT_REQUEST";

export type InvoiceStatus = 
  | "DRAFT" 
  | "SENT" 
  | "PAID" 
  | "DISBURSED" 
  | "FAILED" 
  | "EXPIRED";

export type UserRole = "user" | "admin";

export interface Profile {
  id: string;
  name: string;
  phone: string | null;
  role: UserRole;
  bank_name: string | null;
  bank_account_number: string | null;
  bank_account_name: string | null;
  created_at: string;
  updated_at: string;
  company_name?: string | null;
  company_address?: string | null;
  logo_url?: string | null;
}

export interface Supplier {
  id: string;
  user_id: string;
  name: string;
  email: string | null;
  phone: string | null;
  address: string | null;
  bank_name: string | null;
  bank_account_number: string | null;
  bank_account_name: string | null;
  created_at: string;
  updated_at: string;
}

export interface Invoice {
  id: string;
  invoice_number: string;
  user_id: string;
  type: InvoiceType;
  status: InvoiceStatus;
  recipient_name: string;
  recipient_email: string | null;
  recipient_phone: string | null;
  recipient_address: string | null;
  recipient_bank_name: string | null;
  recipient_bank_account_number: string | null;
  recipient_bank_account_name: string | null;
  description: string | null;
  amount: number;
  subtotal: number | null;
  platform_fee: number;
  total_amount: number;
  
  // New fields
  supplier_id: string | null;
  discount_type: "percentage" | "fixed" | null;
  discount_value: number | null;
  tax_enabled: boolean;
  tax_rate: number | null;
  tax_amount: number | null;
  is_archived: boolean;
  
  due_date: string | null;
  pivot_payment_id: string | null;
  pivot_payment_url: string | null;
  payment_method: string | null;
  paid_at: string | null;
  disbursed_at: string | null;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
  
  items?: InvoiceItem[];
  profile?: Profile | null;
  supplier?: Supplier | null;
}

export interface InvoiceItem {
  id: string;
  invoice_id: string;
  description: string;
  quantity: number;
  unit_price: number;
  total_price: number;
  created_at: string;
}

export interface WebhookLog {
  id: string;
  source: string;
  event_type: string;
  payload: Record<string, unknown>;
  processed: boolean;
  error_message: string | null;
  created_at: string;
}

export interface AuditLog {
  id: string;
  user_id: string | null;
  action: string;
  entity: string;
  entity_id: string | null;
  ip_address: string | null;
  user_agent: string | null;
  metadata: Record<string, unknown> | null;
  created_at: string;
}

export type Database = {
  public: {
    Tables: {
      invoices: {
        Row: Invoice;
        Insert: Partial<Invoice>;
        Update: Partial<Invoice>;
      };
      suppliers: {
        Row: Supplier;
        Insert: Partial<Supplier>;
        Update: Partial<Supplier>;
      };
      // ... allow other tables
    };
  };
};
