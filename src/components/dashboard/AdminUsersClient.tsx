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
    <div className="relative space-y-6 md:space-y-8 pb-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-semibold text-slate-900">
            Manajemen Pengguna
          </h1>
          <p className="text-slate-500 text-sm mt-1">Verifikasi dan kontrol akses pengguna.</p>
        </div>
        
        <Button 
          color="primary" 
          size="sm"
          startContent={<UserPlus size={16} />}
          className="font-medium text-xs h-9 rounded-lg"
        >
          Tambah Admin
        </Button>
      </div>

      {/* Control Hub */}
      <Card className="border border-slate-100 bg-white rounded-xl overflow-hidden">
        <CardBody className="p-4">
           <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                    <Input
                        placeholder="Cari nama atau nomor telepon..."
                        startContent={<Search className="text-slate-400" size={16} />}
                        value={searchQuery}
                        onValueChange={setQuery => { setSearchQuery(setQuery); setPage(1); }}
                        classNames={{
                            inputWrapper: "bg-white border-slate-100 border rounded-lg h-10",
                            input: "text-sm",
                        }}
                    />
                </div>
                <div className="flex items-center gap-2">
                    <div className="px-4 py-2 rounded-lg bg-slate-900 text-white flex items-center gap-2">
                         <span className="text-sm font-medium">{users.length} Users</span>
                    </div>
                </div>
           </div>
        </CardBody>
      </Card>

      {/* Users Table */}
      <Card className="border border-slate-100 bg-white rounded-xl overflow-hidden">
        <CardBody className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead>
                <tr className="text-slate-500 font-medium text-xs border-b border-slate-100">
                  <th className="py-3 px-4 md:px-5">Pengguna</th>
                  <th className="py-3 px-4 md:px-5 hidden md:table-cell">Kontak</th>
                  <th className="py-3 px-4 md:px-5 text-center hidden md:table-cell">Role</th>
                  <th className="py-3 px-4 md:px-5 text-center">Transaksi</th>
                  <th className="py-3 px-4 md:px-5 text-right">Aksi</th>
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
