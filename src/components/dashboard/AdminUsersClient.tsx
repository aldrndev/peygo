"use client";

import { useState } from "react";
import { 
  Card, 
  CardBody, 
  Input, 
  Button, 
  Chip,
  Avatar,
  Pagination
} from "@heroui/react";
import { 
  Search, 
  UserPlus, 
  Phone, 
  ChevronRight,
  Shield,
  Activity,
  Filter
} from "lucide-react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

interface UserProfile {
  id: string;
  name: string | null;
  phone: string | null;
  role: string;
  created_at: string;
}

interface AdminUsersClientProps {
  users: UserProfile[];
  userInvoiceCounts: Record<string, number>;
}

export default function AdminUsersClient({ users, userInvoiceCounts }: AdminUsersClientProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(1);
  const rowsPerPage = 10;

  const filteredUsers = users.filter(user => 
    (user.name?.toLowerCase().includes(searchQuery.toLowerCase()) || 
     user.phone?.includes(searchQuery))
  );

  const pages = Math.ceil(filteredUsers.length / rowsPerPage);
  const items = filteredUsers.slice((page - 1) * rowsPerPage, page * rowsPerPage);

  return (
    <div className="relative space-y-8 pb-10">
      {/* Decorative Blurs */}
      <div className="absolute top-0 left-0 w-[400px] h-[400px] bg-orange-400/5 blur-[120px] -z-10 pointer-events-none" />

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 px-1">
        <div>
           <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900 text-white text-xs font-bold uppercase tracking-widest mb-4">
             <Shield size={12} />
             <span>User Security & Identity</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-semibold text-slate-900 tracking-tight">
            Manajemen Pengguna
          </h1>
          <p className="text-slate-500 mt-2 font-medium">Verifikasi, kontrol akses, dan audit aktivitas pengguna platform.</p>
        </div>
        
        <div className="flex items-center gap-3">
            <Button 
                color="primary" 
                startContent={<UserPlus size={18} />}
                className="font-bold text-sm h-12 rounded-2xl shadow-lg"
            >
                Tambah Admin
            </Button>
        </div>
      </div>

      {/* Control Hub */}
      <Card className="shadow-lg shadow-slate-200/20 border border-white/50 bg-white/60 backdrop-blur-xl rounded-[32px] overflow-hidden">
        <CardBody className="p-8">
           <div className="flex flex-col md:flex-row gap-6">
                <div className="flex-1">
                    <Input
                        label="Cari Database"
                        placeholder="Nama lengkap atau nomor telepon..."
                        labelPlacement="outside"
                        startContent={<Search className="text-slate-400" size={18} />}
                        value={searchQuery}
                        onValueChange={setQuery => { setSearchQuery(setQuery); setPage(1); }}
                        variant="bordered"
                        classNames={{
                            label: "text-slate-700 font-bold text-xs uppercase tracking-widest mb-3",
                            inputWrapper: "bg-white/80 border-slate-200 shadow-sm rounded-2xl h-12 hover:border-blue-400 transition-colors",
                        }}
                    />
                </div>
                <div className="flex items-end gap-3">
                    <Button variant="flat" startContent={<Filter size={16} />} className="h-12 rounded-2xl bg-white/60 backdrop-blur-xl border border-white/50 font-semibold px-6">
                        Sortir
                    </Button>
                    <div className="px-6 py-3 rounded-2xl bg-slate-900 text-white flex items-center gap-4">
                        <div className="text-right">
                             <p className="text-xs font-bold text-white/50 uppercase tracking-widest">Database</p>
                             <p className="text-sm font-bold">{users.length} Users</p>
                        </div>
                        <Shield className="text-blue-500" size={20} />
                    </div>
                </div>
           </div>
        </CardBody>
      </Card>

      {/* Users Grid/List */}
      <Card className="shadow-lg shadow-slate-200/20 border border-white/50 bg-white/60 backdrop-blur-xl rounded-[40px] overflow-hidden">
        <CardBody className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead>
                <tr className="text-slate-400 font-bold uppercase text-xs tracking-widest border-b border-slate-100/50">
                  <th className="py-6 px-10">Identitas Pengguna</th>
                  <th className="py-6 px-10">Kontak</th>
                  <th className="py-6 px-10 text-center">Status Role</th>
                  <th className="py-6 px-10 text-center">Transaksi</th>
                  <th className="py-6 px-10 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50/50 font-medium">
                <AnimatePresence mode="popLayout">
                  {items.map((user) => (
                    <motion.tr 
                        layout
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        key={user.id} 
                        className="hover:bg-slate-50/40 transition-colors group"
                    >
                      <td className="py-8 px-10">
                        <div className="flex items-center gap-4">
                          <Avatar 
                             name={user.name || "U"} 
                             className="w-12 h-12 rounded-2xl font-bold bg-slate-900 text-white shadow-md" 
                          />
                          <div>
                            <p className="font-semibold text-slate-900 group-hover:text-blue-600 transition-colors tracking-tight text-base">
                                {user.name || "Unnamed User"}
                            </p>
                            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">
                                Join {new Date(user.created_at).toLocaleDateString("id-ID", { month: 'short', year: 'numeric' })}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="py-8 px-10">
                        <div className="space-y-1.5">
                            <div className="flex items-center gap-2 text-slate-500 group-hover:text-slate-900 transition-colors">
                                <Phone size={12} className="text-slate-300" />
                                <span className="text-sm font-semibold tracking-tight">{user.phone || "-"}</span>
                            </div>
                        </div>
                      </td>
                      <td className="py-8 px-10 text-center">
                        <Chip 
                            size="sm" 
                            variant="flat" 
                            color={user.role === "admin" ? "primary" : "default"}
                            className={`font-bold text-xs uppercase tracking-widest h-8 px-3 border border-white/50 backdrop-blur-md ${user.role === "admin" ? "bg-blue-500/10" : "bg-slate-500/10"}`}
                        >
                            {user.role}
                        </Chip>
                      </td>
                      <td className="py-8 px-10 text-center">
                        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-50/50 border border-slate-100 group-hover:bg-white group-hover:shadow-sm transition-all">
                             <Activity size={14} className="text-orange-500" />
                             <span className="font-bold text-slate-900">{userInvoiceCounts[user.id] || 0}</span>
                        </div>
                      </td>
                      <td className="py-8 px-10 text-right">
                        <Link href={`/dashboard/admin/users/${user.id}`}>
                            <Button 
                                variant="light" 
                                isIconOnly 
                                className="bg-white/60 hover:bg-slate-900 hover:text-white border border-white/50 backdrop-blur-md rounded-2xl transition-all shadow-sm"
                            >
                                <ChevronRight size={18} />
                            </Button>
                        </Link>
                      </td>
                    </motion.tr>
                  ))}
                </AnimatePresence>
              </tbody>
            </table>
          </div>

          <div className="p-8 border-t border-slate-100/50 flex flex-col sm:flex-row items-center justify-between gap-6">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-[0.2em]">
              Menampilkan {items.length} dari {filteredUsers.length} pengguna
            </p>
            <Pagination
              total={pages}
              page={page}
              onChange={setPage}
              variant="flat"
              classNames={{
                wrapper: "gap-2",
                item: "bg-white/60 backdrop-blur-md border border-white/50 rounded-xl font-bold text-xs hover:bg-slate-900 hover:text-white transition-all",
                cursor: "bg-slate-900 text-white shadow-lg shadow-slate-200",
              }}
            />
          </div>
        </CardBody>
      </Card>
    </div>
  );
}
