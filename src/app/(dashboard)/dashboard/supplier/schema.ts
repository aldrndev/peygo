import { z } from "zod";

export const supplierSchema = z.object({
  name: z.string().min(2, "Nama minimal 2 karakter"),
  email: z.email({ message: "Format email tidak valid" }),
  phone: z.string().optional().or(z.literal("")),
  address: z.string().optional().or(z.literal("")),
  bank_name: z.string().min(2, "Nama bank wajib diisi"),
  bank_account_number: z.string().min(5, "Nomor rekening wajib diisi"),
  bank_account_name: z.string().min(2, "Atas nama rekening wajib diisi"),
});
