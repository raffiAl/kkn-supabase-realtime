import { useState } from "react";
import {
  Layers,
  Lock,
  Unlock,
  AlertTriangle,
  X,
  TrendingUp,
  Users,
  BookOpen,
  CheckSquare,
  ChevronRight,
} from "lucide-react";
import { useKknData } from "./hooks/useKknData";

import Dashboard from "./pages/Dashboard";
import Struktur from "./pages/Struktur";
import ProblemBank from "./pages/ProblemBank";
import TaskBoard from "./pages/TaskBoard";
import AlurKerja from "./pages/AlurKerja";
import AdminPanel from "./pages/AdminPanel";

export default function App() {
  const [currentTab, setCurrentTab] = useState("dashboard");
  const [isAdmin, setIsAdmin] = useState(false);

  // --- CUSTOM HOOK MENGAMBIL SEMUA LOGIKA DATA & SUPABASE ---
  const {
    members,
    problems,
    tasks,
    dbStatus,
    errorMessage,
    setErrorMessage,
    supabaseUrl,
    supabaseAnonKey,
    addMember,
    removeMember,
    addProblem,
    updateProblemStatus,
    removeProblem,
    addTask,
    updateTaskStatus,
    removeTask,
    saveConfig,
    clearConfig,
  } = useKknData();

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      {/* HEADER UTAMA */}
      <header className="border-b border-slate-800 bg-slate-900/80 backdrop-blur sticky top-0 z-50 px-4 py-4 md:px-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-indigo-600 rounded-xl text-white shadow-lg shadow-indigo-500/20">
            <Layers className="h-6 w-6" />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
              KKN Sinergi-Workspace
              <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                Gelombang 1
              </span>
            </h1>
            <p className="text-xs text-slate-400">
              Pusat Database Masalah Desa & Kolaborasi Kerja Tim
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <div className="text-xs px-3 py-1.5 rounded-lg bg-slate-800 border border-slate-700 font-mono text-slate-300">
            {dbStatus}
          </div>

          <button
            onClick={() => setCurrentTab("admin")}
            className={`flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg border transition-all ${
              isAdmin
                ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/30 hover:bg-emerald-500/20"
                : "bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700"
            }`}
          >
            {isAdmin ? (
              <Unlock className="h-3.5 w-3.5" />
            ) : (
              <Lock className="h-3.5 w-3.5" />
            )}
            {isAdmin ? "Admin Mode (Aktif)" : "Admin Login"}
          </button>
        </div>
      </header>

      {/* ERROR DIAGNOSTICS BANNER */}
      {errorMessage && (
        <div className="bg-rose-950/80 border-b border-rose-500/30 text-rose-200 px-4 py-3 md:px-8 flex items-center justify-between gap-4 animate-slideDown">
          <div className="flex items-center gap-2.5 text-sm">
            <AlertTriangle className="h-5 w-5 text-rose-400 shrink-0" />
            <span>
              <strong>Deteksi Error Supabase:</strong> {errorMessage}
            </span>
          </div>
          <button
            onClick={() => setErrorMessage("")}
            className="p-1 hover:bg-rose-900/40 rounded text-rose-400 transition-all"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      )}

      {/* NAVIGASI BAR */}
      <nav className="bg-slate-900 border-b border-slate-800 px-4 overflow-x-auto flex gap-1">
        {[
          { id: "dashboard", label: "Dashboard", Icon: TrendingUp },
          { id: "struktur", label: "Peta Struktur & Tupoksi", Icon: Users },
          {
            id: "problems",
            label: "Bank Masalah Desa",
            Icon: BookOpen,
            count: problems.length,
          },
          { id: "tasks", label: "Live Progress Tracker", Icon: CheckSquare },
          { id: "alur", label: "Alur Survei Gelombang 1", Icon: ChevronRight },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setCurrentTab(tab.id)}
            className={`px-4 py-3 text-sm font-semibold transition-all border-b-2 flex items-center gap-2 shrink-0 ${
              currentTab === tab.id
                ? "border-indigo-500 text-white bg-slate-800/50"
                : "border-transparent text-slate-400 hover:text-slate-200"
            }`}
          >
            <tab.Icon className="h-4 w-4" />
            {tab.label}
            {tab.count > 0 && (
              <span className="ml-1 bg-rose-500/20 text-rose-400 px-1.5 py-0.5 text-xs rounded-full border border-rose-500/30">
                {tab.count}
              </span>
            )}
          </button>
        ))}
      </nav>

      {/* CONTAINER CONTENT */}
      <main className="flex-1 p-4 md:p-8 max-w-7xl w-full mx-auto">
        {currentTab === "dashboard" && (
          <Dashboard
            members={members}
            problems={problems}
            tasks={tasks}
            setCurrentTab={setCurrentTab}
          />
        )}
        {currentTab === "struktur" && <Struktur members={members} />}
        {currentTab === "problems" && (
          <ProblemBank
            problems={problems}
            isAdmin={isAdmin}
            addProblem={addProblem}
            updateProblemStatus={updateProblemStatus}
            removeProblem={removeProblem}
          />
        )}
        {currentTab === "tasks" && (
          <TaskBoard
            tasks={tasks}
            members={members}
            isAdmin={isAdmin}
            addTask={addTask}
            updateTaskStatus={updateTaskStatus}
            removeTask={removeTask}
          />
        )}
        {currentTab === "alur" && <AlurKerja />}
        {currentTab === "admin" && (
          <AdminPanel
            members={members}
            supabaseUrl={supabaseUrl}
            supabaseAnonKey={supabaseAnonKey}
            saveConfig={saveConfig}
            clearConfig={clearConfig}
            addMember={addMember}
            removeMember={removeMember}
            isAdmin={isAdmin}
            setIsAdmin={setIsAdmin}
          />
        )}
      </main>

      {/* FOOTER */}
      <footer className="border-t border-slate-800 py-6 text-center text-xs text-slate-500 bg-slate-950 mt-12 space-y-2">
        <p>
          © 2026 KKN Sinergi-Workspace. Diarsiteki oleh Ketua Kelompok 10 KKN
          dengan React & Supabase.
        </p>
        <p className="text-[10px] text-slate-600">
          Dibuat menggunakan Font Times New Roman 12pt & Palet Sage Navy.
        </p>
      </footer>
    </div>
  );
}
