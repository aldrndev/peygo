import { z } from "zod";

export const profileSchema = z.object({
  name: z.string().min(2, "Nama minimal 2 karakter"),
  phone: z.string().min(10, "No. telepon minimal 10 digit"),
  company_name: z.string().nullable().optional(),
  company_address: z.string().nullable().optional(),
  logo_url: z.string().nullable().optional(),
  bank_name: z.string().nullable().optional(),
  bank_account_number: z.string().nullable().optional(),
  bank_account_name: z.string().nullable().optional(),
});
