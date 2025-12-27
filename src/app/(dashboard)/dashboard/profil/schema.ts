import { z } from "zod";

export const profileSchema = z.object({
  name: z.string().min(2, "Nama minimal 2 karakter"),
  phone: z.string().min(10, "No. telepon minimal 10 digit"),
  company_name: z.string().optional().or(z.literal("")),
  company_address: z.string().optional().or(z.literal("")),
  logo_url: z.string().optional().or(z.literal("")),
});
