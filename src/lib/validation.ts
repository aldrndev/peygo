/**
 * Creates event handlers for custom Indonesian validation messages
 * to override browser's default "Please fill out this field"
 */
export function createValidationHandlers(message: string) {
  return {
    onInvalid: (e: React.FormEvent<HTMLInputElement>) => {
      (e.target as HTMLInputElement).setCustomValidity(message);
    },
    onInput: (e: React.FormEvent<HTMLInputElement>) => {
      (e.target as HTMLInputElement).setCustomValidity("");
    },
  };
}

/**
 * Predefined Indonesian validation messages
 */
export const validationMessages = {
  name: "Nama wajib diisi",
  email: "Email wajib diisi",
  password: "Password wajib diisi",
  phone: "Nomor telepon wajib diisi",
  required: "Field ini wajib diisi",
  address: "Alamat wajib diisi",
  bankName: "Nama bank wajib diisi",
  accountNumber: "Nomor rekening wajib diisi",
  accountName: "Nama pemilik rekening wajib diisi",
  description: "Deskripsi wajib diisi",
  quantity: "Jumlah wajib diisi",
  price: "Harga wajib diisi",
  dueDate: "Jatuh tempo wajib diisi",
  recipientName: "Nama penerima wajib diisi",
} as const;
