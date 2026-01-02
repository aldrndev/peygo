"use client";

import { useState, useEffect, useCallback } from "react";
import { fetchAuditLogs, exportAuditLogsToCSV, type AuditLog, type AuditLogFilters } from "@/lib/api/admin";
import { Download, Search, Filter, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import Link from "next/link";

// Human-readable action labels
const actionLabels: Record<string, string> = {
  LOGIN: "Login",
  LOGIN_FAILED: "Login Gagal",
  LOGOUT: "Logout",
  PASSWORD_RESET_REQUEST: "Request Reset Password",
  PASSWORD_RESET_COMPLETE: "Reset Password Selesai",
  CHANGE_PASSWORD: "Ubah Password",
  CREATE_INVOICE: "Buat Invoice",
  SEND_INVOICE: "Kirim Invoice",
  ARCHIVE_INVOICE: "Arsipkan Invoice",
  CREATE_SUPPLIER: "Tambah Supplier",
  UPDATE_SUPPLIER: "Update Supplier",
  DELETE_SUPPLIER: "Hapus Supplier",
  UPDATE_PROFILE: "Update Profil",
  LOGO_UPLOAD: "Upload Logo",
  PAYMENT_SUCCESS: "Pembayaran Berhasil",
  PAYMENT_FAILED: "Pembayaran Gagal",
  DISBURSEMENT_COMPLETE: "Pencairan Selesai",
  WEBHOOK_UPDATE: "Webhook Update",
  ADMIN_VIEW_AUDIT_LOGS: "Lihat Audit Logs",
  ADMIN_EXPORT_AUDIT_LOGS: "Export Audit Logs",
  ADMIN_CHANGE_USER_ROLE: "Ubah Role User",
  ADMIN_DELETE_USER: "Hapus User",
  ADMIN_VIEW_USER_DETAIL: "Lihat Detail User",
  ADMIN_VIEW_REPORTS: "Lihat Reports",
  ADMIN_ACCESS_DASHBOARD: "Akses Admin Dashboard",
};

// Get entity link based on entity type
function getEntityLink(entity: string | null, entityId: string | null): string | null {
  if (!entity || !entityId) return null;
  
  switch (entity) {
    case "profiles":
      return `/dashboard/admin/users/${entityId}`;
    case "invoices":
      return `/dashboard/admin/invoices/${entityId}`;
    case "suppliers":
      return `/dashboard/supplier`;
    default:
      return null;
  }
}

export default function AuditLogsClient() {
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [exporting, setExporting] = useState(false);
  
  // Filters
  const [search, setSearch] = useState("");
  const [actionFilter, setActionFilter] = useState("all");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [page, setPage] = useState(1);
  const pageSize = 50;

  // Visibility-aware auto-refresh
  const [isVisible, setIsVisible] = useState(true);

  const loadLogs = useCallback(async () => {
    setLoading(true);
    const filters: AuditLogFilters = {
      search,
      action: actionFilter,
      startDate,
      endDate,
      page,
      pageSize,
    };
    
    const result = await fetchAuditLogs(filters);
    setLogs(result.logs);
    setTotal(result.total);
    setLoading(false);
  }, [search, actionFilter, startDate, endDate, page]);

  // Load logs on mount and filter changes
  useEffect(() => {
    loadLogs();
  }, [loadLogs]);

  // Visibility-aware auto-refresh (30s when visible)
  useEffect(() => {
    const handleVisibilityChange = () => {
      setIsVisible(!document.hidden);
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);

    const interval = setInterval(() => {
      if (isVisible) {
        loadLogs();
      }
    }, 30000); // 30s

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      clearInterval(interval);
    };
  }, [isVisible, loadLogs]);

  const handleExport = async () => {
    setExporting(true);
    try {
      // Fetch all logs matching filters (no pagination for export)
      const filters: AuditLogFilters = {
        search,
        action: actionFilter,
        startDate,
        endDate,
        pageSize: 10000, // Large limit for export
      };
      
      const result = await fetchAuditLogs(filters);
      const csv = exportAuditLogsToCSV(result.logs);
      
      // Download CSV
      const blob = new Blob([csv], { type: "text/csv" });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `audit-logs-${new Date().toISOString().split("T")[0]}.csv`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    } finally {
      setExporting(false);
    }
  };

  const totalPages = Math.ceil(total / pageSize);

  // All audit action types (hardcoded to avoid server-only import)
  const actionTypes = [
    "LOGIN", "LOGIN_FAILED", "LOGOUT",
    "PASSWORD_RESET_REQUEST", "PASSWORD_RESET_COMPLETE", "CHANGE_PASSWORD",
    "CREATE_INVOICE", "SEND_INVOICE", "ARCHIVE_INVOICE",
    "CREATE_SUPPLIER", "UPDATE_SUPPLIER", "DELETE_SUPPLIER",
    "UPDATE_PROFILE", "LOGO_UPLOAD",
    "PAYMENT_SUCCESS", "PAYMENT_FAILED", "DISBURSEMENT_COMPLETE", "WEBHOOK_UPDATE",
    "ADMIN_VIEW_AUDIT_LOGS", "ADMIN_EXPORT_AUDIT_LOGS", "ADMIN_CHANGE_USER_ROLE",
    "ADMIN_DELETE_USER", "ADMIN_VIEW_USER_DETAIL", "ADMIN_VIEW_REPORTS", "ADMIN_ACCESS_DASHBOARD"
  ];

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Audit Logs</h1>
          <p className="text-sm text-muted-foreground">
            Security and compliance audit trail ({total.toLocaleString()} total logs)
          </p>
        </div>
        <Button onClick={handleExport} disabled={exporting || logs.length === 0}>
          <Download className="w-4 h-4 mr-2" />
          {exporting ? "Exporting..." : "Export CSV"}
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Filter className="w-4 h-4" />
            Filters
          </CardTitle>
          <CardDescription>Search and filter audit logs (server-side)</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Search */}
            <div className="space-y-2">
              <Label htmlFor="search">Search</Label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  id="search"
                  placeholder="Action, entity, IP..."
                  value={search}
                  onChange={(e) => {
                    setSearch(e.target.value);
                    setPage(1);
                  }}
                  className="pl-10"
                />
              </div>
            </div>

            {/* Action Type */}
            <div className="space-y-2">
              <Label htmlFor="action">Action Type</Label>
              <Select
                value={actionFilter}
                onValueChange={(value) => {
                  setActionFilter(value);
                  setPage(1);
                }}
              >
                <SelectTrigger id="action">
                  <SelectValue placeholder="All actions" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Actions</SelectItem>
                  {actionTypes.map((action) => (
                    <SelectItem key={action} value={action}>
                      {action}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Start Date */}
            <div className="space-y-2">
              <Label htmlFor="startDate">Start Date</Label>
              <Input
                id="startDate"
                type="date"
                value={startDate}
                onChange={(e) => {
                  setStartDate(e.target.value);
                  setPage(1);
                }}
              />
            </div>

            {/* End Date */}
            <div className="space-y-2">
              <Label htmlFor="endDate">End Date</Label>
              <Input
                id="endDate"
                type="date"
                value={endDate}
                onChange={(e) => {
                  setEndDate(e.target.value);
                  setPage(1);
                }}
              />
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setSearch("");
                setActionFilter("all");
                setStartDate("");
                setEndDate("");
                setPage(1);
              }}
            >
              Clear Filters
            </Button>
            <Button variant="outline" size="sm" onClick={loadLogs}>
              <RefreshCw className="w-4 h-4 mr-2" />
              Refresh
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Table */}
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-muted/50 border-b">
                <tr>
                  <th className="text-left p-3 text-xs font-semibold text-muted-foreground uppercase">Timestamp</th>
                  <th className="text-left p-3 text-xs font-semibold text-muted-foreground uppercase">User</th>
                  <th className="text-left p-3 text-xs font-semibold text-muted-foreground uppercase">Action</th>
                  <th className="text-left p-3 text-xs font-semibold text-muted-foreground uppercase">Entity</th>
                  <th className="text-left p-3 text-xs font-semibold text-muted-foreground uppercase">IP Address</th>
                  <th className="text-left p-3 text-xs font-semibold text-muted-foreground uppercase">Metadata</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={6} className="p-8 text-center text-muted-foreground">
                      Loading audit logs...
                    </td>
                  </tr>
                ) : logs.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="p-8 text-center text-muted-foreground">
                      No audit logs found
                    </td>
                  </tr>
                ) : (
                  logs.map((log) => (
                    <tr key={log.id} className="border-b hover:bg-muted/30 transition-colors">
                      <td className="p-3 text-sm">
                        <div className="font-mono text-xs">
                          {new Date(log.created_at).toLocaleString()}
                        </div>
                      </td>
                      <td className="p-3 text-sm">
                        <div className="font-medium">{log.userName || "System"}</div>
                        {log.user_id && (
                          <div className="text-xs text-muted-foreground font-mono truncate max-w-[100px]">
                            {log.user_id.slice(0, 8)}...
                          </div>
                        )}
                      </td>
                      <td className="p-3">
                        <span className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium ${
                          log.action.startsWith("ADMIN_") 
                            ? "bg-red-500/10 text-red-600"
                            : log.action.includes("FAILED")
                            ? "bg-yellow-500/10 text-yellow-600"
                            : "bg-blue-500/10 text-blue-600"
                        }`}>
                          {actionLabels[log.action] || log.action}
                        </span>
                      </td>
                      <td className="p-3 text-sm text-muted-foreground">
                        {(() => {
                          const link = getEntityLink(log.entity, log.entity_id);
                          return (
                            <>
                              {link ? (
                                <Link href={link} className="text-blue-600 hover:underline">
                                  {log.entity}
                                </Link>
                              ) : (
                                log.entity || "-"
                              )}
                              {log.entity_id && (
                                <div className="text-xs font-mono truncate max-w-[100px]">
                                  {log.entity_id.slice(0, 8)}...
                                </div>
                              )}
                            </>
                          );
                        })()}
                      </td>
                      <td className="p-3 text-sm font-mono text-muted-foreground">
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <span className="cursor-help">
                                {log.ip_address || "-"}
                              </span>
                            </TooltipTrigger>
                            {log.user_agent && log.user_agent !== "unknown" && (
                              <TooltipContent side="top" className="max-w-xs">
                                <p className="text-xs break-all">{log.user_agent}</p>
                              </TooltipContent>
                            )}
                          </Tooltip>
                        </TooltipProvider>
                      </td>
                      <td className="p-3 text-sm">
                        {log.metadata && Object.keys(log.metadata).length > 0 ? (
                          <details className="cursor-pointer">
                            <summary className="text-xs text-blue-600 hover:underline">
                              View ({Object.keys(log.metadata).length})
                            </summary>
                            <pre className="text-xs bg-muted p-2 rounded mt-1 max-w-xs overflow-x-auto">
                              {JSON.stringify(log.metadata, null, 2)}
                            </pre>
                          </details>
                        ) : (
                          <span className="text-muted-foreground">-</span>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {!loading && logs.length > 0 && (
            <div className="flex items-center justify-between p-4 border-t">
              <div className="text-sm text-muted-foreground">
                Showing {(page - 1) * pageSize + 1} - {Math.min(page * pageSize, total)} of {total.toLocaleString()}
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPage(p => Math.max(1, p - 1))}
                  disabled={page === 1}
                >
                  Previous
                </Button>
                <span className="text-sm">
                  Page {page} of {totalPages}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                >
                  Next
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
