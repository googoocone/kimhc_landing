"use client";

import { useRouter } from "next/navigation";

export default function LogoutButton() {
  const router = useRouter();
  const logout = async () => {
    await fetch("/api/admin/login", { method: "DELETE" });
    router.refresh();
  };
  return (
    <button
      type="button"
      onClick={logout}
      className="rounded-lg border border-slate-300 px-3 py-1.5 text-xs font-medium text-slate-600 transition hover:bg-slate-100"
    >
      로그아웃
    </button>
  );
}
