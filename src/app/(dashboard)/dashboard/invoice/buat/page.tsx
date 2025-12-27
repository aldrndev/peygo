"use client";

import { useActionState, useState } from "react";
import { useFormStatus } from "react-dom";
import { 
  Button, 
  Card, 
  CardBody, 
  Input, 
  Select, 
  SelectItem, 
  Textarea,
  Divider 
} from "@heroui/react";
import { Plus, Trash, ArrowLeft, AlertCircle } from "lucide-react";
import { Link } from "@heroui/react";
import { createInvoice } from "../actions";

const initialState = {
  error: "",
};

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button 
      type="submit" 
      color="primary" 
      size="lg"
      className="w-full sm:w-auto font-medium"
      isLoading={pending}
    >
      {pending ? "Menyimpan..." : "Simpan Invoice"}
    </Button>
  );
}

export default function CreateInvoicePage() {
  const [state, formAction] = useActionState(createInvoice, initialState);
  const [items, setItems] = useState([
    { description: "", quantity: 1, unit_price: 0 }
  ]);
  const [type, setType] = useState("BILLING");

  const addItem = () => {
    setItems([...items, { description: "", quantity: 1, unit_price: 0 }]);
  };

  const removeItem = (index: number) => {
    setItems(items.filter((_, i) => i !== index));
  };

  type ItemField = keyof typeof items[0];

  const updateItem = (index: number, field: ItemField, value: string | number) => {
    const newItems = [...items];
    newItems[index] = { ...newItems[index], [field]: value };
    setItems(newItems);
  };

  const totalAmount = items.reduce((acc, item) => acc + (item.quantity * item.unit_price), 0);

  return (
    <div className="space-y-4 md:space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Button as={Link} href="/dashboard/invoice" variant="light" isIconOnly size="sm">
          <ArrowLeft size={20} />
        </Button>
        <h1 className="text-xl md:text-2xl font-bold">Buat Invoice Baru</h1>
      </div>

      <form action={formAction}>
        <div className="space-y-4 md:space-y-6">
          {/* Main Info */}
          <Card className="border border-default-100 shadow-sm">
            <CardBody className="gap-4 p-4 md:p-6">
              <h3 className="text-base md:text-lg font-semibold">Informasi Dasar</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Select 
                  label="Tipe Invoice" 
                  name="type" 
                  defaultSelectedKeys={["BILLING"]}
                  size="lg"
                  isRequired
                  onChange={(e) => setType(e.target.value)}
                >
                  <SelectItem key="BILLING">Penagihan (Billing)</SelectItem>
                  <SelectItem key="PAYMENT_REQUEST">Permintaan Pembayaran</SelectItem>
                </Select>

                <Input 
                  type="date" 
                  label="Jatuh Tempo" 
                  name="due_date"
                  size="lg"
                />
              </div>

              <Textarea 
                label="Catatan / Deskripsi" 
                placeholder="Contoh: Pembayaran Jasa Desain UI/UX" 
                name="description"
                minRows={2}
              />
            </CardBody>
          </Card>

          {/* Recipient */}
          <Card className="border border-default-100 shadow-sm">
            <CardBody className="gap-4 p-4 md:p-6">
              <h3 className="text-base md:text-lg font-semibold">Penerima Tagihan</h3>
              <Input 
                label="Nama Penerima" 
                name="recipient_name" 
                placeholder="Nama Perusahaan / Individu"
                size="lg"
                isRequired 
              />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input 
                  label="Email Penerima" 
                  name="recipient_email" 
                  type="email" 
                  placeholder="email@contoh.com"
                  size="lg"
                />
                <Input 
                  label="No. WhatsApp" 
                  name="recipient_phone" 
                  type="tel" 
                  placeholder="08123456789"
                  size="lg"
                />
              </div>
              
              {type === "PAYMENT_REQUEST" && (
                 <>
                    <Divider className="my-2" />
                    <p className="text-sm font-semibold text-primary">Rekening Tujuan Pencairan</p>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <Input label="Nama Bank" name="recipient_bank_name" placeholder="BCA / Mandiri" size="lg" />
                        <Input label="No. Rekening" name="recipient_bank_account_number" size="lg" />
                        <Input label="Atas Nama" name="recipient_bank_account_name" size="lg" />
                    </div>
                 </>
              )}
            </CardBody>
          </Card>

          {/* Items */}
          <Card className="border border-default-100 shadow-sm">
            <CardBody className="gap-4 p-4 md:p-6">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                <h3 className="text-base md:text-lg font-semibold">Item Tagihan</h3>
                <Button size="sm" variant="flat" onPress={addItem} startContent={<Plus size={16} />}>
                  Tambah Item
                </Button>
              </div>

              <div className="space-y-4">
                {items.map((item, index) => (
                  <div key={index} className="p-4 bg-default-50 rounded-xl space-y-3">
                    <div className="flex justify-between items-start gap-2">
                      <Input 
                        placeholder="Deskripsi Item" 
                        value={item.description}
                        onChange={(e) => updateItem(index, "description", e.target.value)}
                        size="lg"
                        className="flex-1"
                        isRequired
                      />
                      {items.length > 1 && (
                        <Button 
                          isIconOnly 
                          size="sm" 
                          color="danger" 
                          variant="light" 
                          onPress={() => removeItem(index)}
                          className="shrink-0 mt-1"
                        >
                          <Trash size={18} />
                        </Button>
                      )}
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <Input 
                        type="number" 
                        label="Qty" 
                        value={item.quantity.toString()}
                        onChange={(e) => updateItem(index, "quantity", parseInt(e.target.value) || 0)}
                        size="lg"
                      />
                      <Input 
                        type="number" 
                        label="Harga (Rp)" 
                        value={item.unit_price.toString()}
                        onChange={(e) => updateItem(index, "unit_price", parseInt(e.target.value) || 0)}
                        size="lg"
                      />
                    </div>
                    <div className="text-right">
                      <span className="text-sm text-default-500">Subtotal: </span>
                      <span className="font-bold text-primary">
                        Rp {(item.quantity * item.unit_price).toLocaleString("id-ID")}
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              <Divider className="my-2" />
              
              <div className="flex justify-between items-center py-2">
                <span className="text-lg font-bold">Total Tagihan</span>
                <span className="text-2xl md:text-3xl font-bold text-primary">
                    Rp {totalAmount.toLocaleString("id-ID")}
                </span>
              </div>
              
              <input type="hidden" name="items" value={JSON.stringify(items)} />
              <input type="hidden" name="amount" value={totalAmount} />
            </CardBody>
          </Card>

          {/* Error Message */}
          {state?.error && (
            <div className="p-4 bg-danger-50 text-danger rounded-xl flex items-center gap-3">
              <AlertCircle size={20} className="shrink-0" />
              <span className="text-sm">{state.error}</span>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex flex-col-reverse sm:flex-row justify-end gap-3 pt-2">
            <Button as={Link} href="/dashboard/invoice" variant="bordered" className="w-full sm:w-auto">
              Batal
            </Button>
            <SubmitButton />
          </div>
        </div>
      </form>
    </div>
  );
}
