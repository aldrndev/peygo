"use client";

import { useState } from "react";
import { 
  Search, 
  UserPlus, 
  Phone, 
  ChevronRight,
  Activity,
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { SimplePagination } from "@/components/ui/pagination";

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
          <h1 className="text-2xl md:text-3xl font-semibold text-foreground">
            Manajemen Pengguna
          </h1>
          <p className="text-muted-foreground text-sm mt-1">Verifikasi dan kontrol akses pengguna.</p>
        </div>
        
        <Button size="sm">
          <UserPlus size={16} className="mr-2" />
          Tambah Admin
        </Button>
      </div>

      {/* Control Hub */}
      <Card>
        <CardContent className="p-4">
           <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1 relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
                    <Input
                        placeholder="Cari nama atau nomor telepon..."
                        value={searchQuery}
                        onChange={(e) => { setSearchQuery(e.target.value); setPage(1); }}
                        className="pl-10"
                    />
                </div>
                <div className="flex items-center gap-2">
                    <div className="px-4 py-2 rounded-lg bg-foreground text-background flex items-center gap-2">
                         <span className="text-sm font-medium">{users.length} Users</span>
                    </div>
                </div>
           </div>
        </CardContent>
      </Card>

      {/* Users Table */}
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead>
                <tr className="text-muted-foreground font-medium text-xs border-b border-border">
                  <th className="py-3 px-4 md:px-5">Pengguna</th>
                  <th className="py-3 px-4 md:px-5 hidden md:table-cell">Kontak</th>
                  <th className="py-3 px-4 md:px-5 text-center hidden md:table-cell">Role</th>
                  <th className="py-3 px-4 md:px-5 text-center">Transaksi</th>
                  <th className="py-3 px-4 md:px-5 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border font-medium">
                {items.map((user) => {
                  const initials = (user.name || "U").split(" ").map(n => n[0]).join("").slice(0, 2).toUpperCase();
                  return (
                    <tr key={user.id} className="hover:bg-accent/50 transition-colors group">
                      <td className="py-6 px-4 md:px-5">
                        <div className="flex items-center gap-4">
                          <Avatar className="w-12 h-12">
                            <AvatarFallback className="bg-foreground text-background font-bold">
                              {initials}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-semibold text-foreground group-hover:text-primary transition-colors tracking-tight text-base">
                                {user.name || "Unnamed User"}
                            </p>
                            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mt-1">
                                Join {new Date(user.created_at).toLocaleDateString("id-ID", { month: 'short', year: 'numeric' })}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="py-6 px-4 md:px-5 hidden md:table-cell">
                        <div className="space-y-1.5">
                            <div className="flex items-center gap-2 text-muted-foreground group-hover:text-foreground transition-colors">
                                <Phone size={12} />
                                <span className="text-sm font-semibold tracking-tight">{user.phone || "-"}</span>
                            </div>
                        </div>
                      </td>
                      <td className="py-6 px-4 md:px-5 text-center hidden md:table-cell">
                        <Badge variant={user.role === "admin" ? "default" : "secondary"}>
                          {user.role}
                        </Badge>
                      </td>
                      <td className="py-6 px-4 md:px-5 text-center">
                        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-muted border border-border group-hover:bg-card group-hover:shadow-sm transition-all">
                             <Activity size={14} className="text-primary" />
                             <span className="font-bold text-foreground tabular-nums">{userInvoiceCounts[user.id] || 0}</span>
                        </div>
                      </td>
                      <td className="py-6 px-4 md:px-5 text-right">
                        <Button 
                            variant="ghost" 
                            size="icon"
                            className="hover:bg-foreground hover:text-background"
                            asChild
                        >
                          <Link href={`/dashboard/admin/users/${user.id}`}>
                              <ChevronRight size={18} />
                          </Link>
                        </Button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <div className="p-6 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
              Menampilkan {items.length} dari {filteredUsers.length} pengguna
            </p>
            <SimplePagination 
              currentPage={page}
              totalPages={pages}
              onPageChange={setPage}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
