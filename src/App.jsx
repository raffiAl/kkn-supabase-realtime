import { useState, useEffect } from "react";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import {
  Users,
  BookOpen,
  CheckSquare,
  Settings,
  Plus,
  Trash2,
  AlertTriangle,
  CheckCircle,
  Clock,
  FolderPlus,
  ChevronRight,
  Layers,
  FileText,
  UserCheck,
  TrendingUp,
  MapPin,
  ExternalLink,
  Lock,
  Unlock,
} from "lucide-react";

// --- INISIALISASI SUPABASE DENGAN METODE ESM ---
const getSupabaseClient = () => {
  const url = localStorage.getItem("SUPABASE_URL") || "";
  const key = localStorage.getItem("SUPABASE_ANON_KEY") || "";
  if (url && key) {
    try {
      // Menggunakan fungsi createClient hasil import ESM di atas
      return createClient(url, key);
    } catch (e) {
      console.error("Gagal menginisialisasi Supabase:", e);
    }
  }
  return null;
};

export default function App() {
  // --- STATE SYSTEM ---
  const [currentTab, setCurrentTab] = useState("dashboard");
  const [isAdmin, setIsAdmin] = useState(false);
  const [passcode, setPasscode] = useState("");
  const [adminError, setAdminError] = useState("");
  const [dbStatus, setDbStatus] = useState("Menginisialisasi...");

  // Supabase Configuration States
  const [supabaseUrl, setSupabaseUrl] = useState(
    localStorage.getItem("SUPABASE_URL") || "",
  );
  const [supabaseAnonKey, setSupabaseAnonKey] = useState(
    localStorage.getItem("SUPABASE_ANON_KEY") || "",
  );

  // --- STATE DATA ---
  const [members, setMembers] = useState([
    {
      id: "1",
      name: "Raffi",
      nim: "20240100101",
      division: "bph",
      role: "Ketua Kelompok & System Architect",
    },
    {
      id: "2",
      name: "Siti Rahma",
      nim: "20240100102",
      division: "bph",
      role: "Sekretaris Kelompok & Admin Dokumen",
    },
    {
      id: "3",
      name: "Fajar Nugraha",
      nim: "20240100103",
      division: "bph",
      role: "Bendahara Kelompok & Manajer Keuangan",
    },
  ]);

  const [problems, setProblems] = useState([
    {
      id: "1",
      title: "Minimnya Peta Digital Potensi Desa",
      category: "Litbang & Data",
      description:
        "Belum adanya peta interaktif yang menunjukkan lokasi UMKM unggulan desa untuk menarik investor luar.",
      severity: "Tinggi",
      status: "Pending",
      reporter: "Divisi Litbang",
    },
    {
      id: "2",
      title: "Saluran Irigasi Tersumbat Sampah Plastik",
      category: "Lingkungan",
      description:
        "Irigasi persawahan di RT 03 tersumbat tumpukan sampah domestik, berisiko banjir saat musim hujan.",
      severity: "Tinggi",
      status: "Pending",
      reporter: "Luki (Humas)",
    },
  ]);

  const [tasks, setTasks] = useState([
    {
      id: "1",
      title: "Menyusun Surat Izin Survei Desa",
      assignee: "Siti Rahma",
      deadline: "2026-06-15",
      status: "Selesai",
    },
    {
      id: "2",
      title: "Menyusun 15 Draf Pertanyaan Wawancara",
      assignee: "Divisi Litbang",
      deadline: "2026-06-16",
      status: "Sedang Berjalan",
    },
    {
      id: "3",
      title: "Koordinasi Jadwal dengan Kepala Desa",
      assignee: "Divisi Humas",
      deadline: "2026-06-16",
      status: "Belum Mulai",
    },
    {
      id: "4",
      title: "Membuat Brand Guidelines Akun IG Bersama",
      assignee: "Divisi Medok",
      deadline: "2026-06-18",
      status: "Belum Mulai",
    },
  ]);

  // --- FORMS STATES ---
  const [newMember, setNewMember] = useState({
    name: "",
    nim: "",
    division: "bph",
    role: "",
  });
  const [newProblem, setNewProblem] = useState({
    title: "",
    category: "Ekonomi/UMKM",
    description: "",
    severity: "Sedang",
    reporter: "",
  });
  const [newTask, setNewTask] = useState({
    title: "",
    assignee: "",
    deadline: "",
    status: "Belum Mulai",
  });

  // --- ALOKASI & STRUKTUR KUOTA ---
  const divisions = {
    bph: {
      name: "Pimpinan Inti (BPH)",
      max: 3,
      description:
        "Ketua, Sekretaris, dan Bendahara. Bertanggung jawab atas administrasi, manajemen uang, dan arah kebijakan kelompok.",
    },
    litbang: {
      name: "Divisi Litbang & Data",
      max: 3,
      description:
        "Fokus pada riset masalah desa, menyusun kuesioner wawancara, serta mengolah data monografi.",
    },
    humas: {
      name: "Divisi Humas & Hubungan Lembaga",
      max: 2,
      description:
        "Ujung tombak komunikasi, perizinan instansi, serta pengatur jadwal pertemuan tim di lapangan.",
    },
    medok: {
      name: "Divisi Media & Dokumentasi (Medok)",
      max: 2,
      description:
        "Mengelola Instagram kolaborasi bersama 5 kelompok, mengambil foto/video investigatif, dan menyusun infografis.",
    },
  };

  // --- SUPABASE ENGINE & REAL-TIME SYNC ---
  useEffect(() => {
    const client = getSupabaseClient();
    if (client) {
      setDbStatus("Koneksi Supabase Cloud Aktif (ESM) 🟢");

      // 1. Fetch Awal Data
      const loadData = async () => {
        const { data: dbMembers } = await client.from("members").select("*");
        if (dbMembers && dbMembers.length > 0) setMembers(dbMembers);

        const { data: dbProblems } = await client
          .from("village_problems")
          .select("*");
        if (dbProblems && dbProblems.length > 0) setProblems(dbProblems);

        const { data: dbTasks } = await client.from("tasks").select("*");
        if (dbTasks && dbTasks.length > 0) setTasks(dbTasks);
      };
      loadData();

      // 2. Real-time Subscription (Broadcast)
      const membersChan = client
        .channel("members_realtime")
        .on(
          "postgres_changes",
          { event: "*", schema: "public", table: "members" },
          () => {
            loadData();
          },
        )
        .subscribe();

      const problemsChan = client
        .channel("problems_realtime")
        .on(
          "postgres_changes",
          { event: "*", schema: "public", table: "village_problems" },
          () => {
            loadData();
          },
        )
        .subscribe();

      const tasksChan = client
        .channel("tasks_realtime")
        .on(
          "postgres_changes",
          { event: "*", schema: "public", table: "tasks" },
          () => {
            loadData();
          },
        )
        .subscribe();

      return () => {
        client.removeChannel(membersChan);
        client.removeChannel(problemsChan);
        client.removeChannel(tasksChan);
      };
    } else {
      setDbStatus("Local Mode (Simulasi Memori) 🟡");
    }
  }, [supabaseUrl, supabaseAnonKey]);

  // --- CONTROLLERS ---

  // Konfigurasi Database Supabase
  const handleSaveConfig = (e) => {
    e.preventDefault();
    localStorage.setItem("SUPABASE_URL", supabaseUrl);
    localStorage.setItem("SUPABASE_ANON_KEY", supabaseAnonKey);
    window.location.reload();
  };

  const handleClearConfig = () => {
    localStorage.removeItem("SUPABASE_URL");
    localStorage.removeItem("SUPABASE_ANON_KEY");
    setSupabaseUrl("");
    setSupabaseAnonKey("");
    window.location.reload();
  };

  // Autentikasi Admin Panel
  const handleLogin = (e) => {
    e.preventDefault();
    if (passcode === "kkn10hebat") {
      setIsAdmin(true);
      setAdminError("");
    } else {
      setAdminError("Passcode Salah! Coba cek instruksi ketua.");
    }
  };

  const handleLogout = () => {
    setIsAdmin(false);
    setPasscode("");
  };

  // Tambah Anggota (Admin)
  const handleAddMember = async (e) => {
    e.preventDefault();
    const currentCount = members.filter(
      (m) => m.division === newMember.division,
    ).length;
    if (currentCount >= divisions[newMember.division].max) {
      alert(
        `Kuota ${divisions[newMember.division].name} sudah penuh! (Maksimal ${divisions[newMember.division].max} orang)`,
      );
      return;
    }

    const memberData = {
      id: Date.now().toString(),
      name: newMember.name,
      nim: newMember.nim,
      division: newMember.division,
      role: newMember.role || "Anggota Tim",
    };

    const client = getSupabaseClient();
    if (client) {
      const { error } = await client.from("members").insert([memberData]);
      if (error) console.error(error);
    } else {
      setMembers([...members, memberData]);
    }

    setNewMember({ name: "", nim: "", division: "bph", role: "" });
  };

  // Hapus Anggota (Admin)
  const handleRemoveMember = async (id) => {
    const client = getSupabaseClient();
    if (client) {
      await client.from("members").delete().eq("id", id);
    } else {
      setMembers(members.filter((m) => m.id !== id));
    }
  };

  // Tambah Masalah Desa (Publik/Semua Divisi Bisa Input Saat Survei)
  const handleAddProblem = async (e) => {
    e.preventDefault();
    if (!newProblem.title || !newProblem.description) {
      alert("Harap isi semua kolom judul dan deskripsi masalah!");
      return;
    }

    const problemData = {
      id: Date.now().toString(),
      title: newProblem.title,
      category: newProblem.category,
      description: newProblem.description,
      severity: newProblem.severity,
      status: "Pending",
      reporter: newProblem.reporter || "Anonim",
    };

    const client = getSupabaseClient();
    if (client) {
      const { error } = await client
        .from("village_problems")
        .insert([problemData]);
      if (error) console.error(error);
    } else {
      setProblems([...problems, problemData]);
    }

    setNewProblem({
      title: "",
      category: "Ekonomi/UMKM",
      description: "",
      severity: "Sedang",
      reporter: "",
    });
    setCurrentTab("problems");
  };

  // Update Status Masalah (Admin)
  const handleUpdateProblemStatus = async (id, newStatus) => {
    const client = getSupabaseClient();
    if (client) {
      await client
        .from("village_problems")
        .update({ status: newStatus })
        .eq("id", id);
    } else {
      setProblems(
        problems.map((p) => (p.id === id ? { ...p, status: newStatus } : p)),
      );
    }
  };

  // Hapus Masalah (Admin)
  const handleRemoveProblem = async (id) => {
    const client = getSupabaseClient();
    if (client) {
      await client.from("village_problems").delete().eq("id", id);
    } else {
      setProblems(problems.filter((p) => p.id !== id));
    }
  };

  // Tambah Tugas (Admin)
  const handleAddTask = async (e) => {
    e.preventDefault();
    if (!newTask.title || !newTask.assignee) {
      alert("Mohon isi judul tugas dan penanggung jawab!");
      return;
    }

    const taskData = {
      id: Date.now().toString(),
      title: newTask.title,
      assignee: newTask.assignee,
      deadline: newTask.deadline || "-",
      status: "Belum Mulai",
    };

    const client = getSupabaseClient();
    if (client) {
      const { error } = await client.from("tasks").insert([taskData]);
      if (error) console.error(error);
    } else {
      setTasks([...tasks, taskData]);
    }

    setNewTask({
      title: "",
      assignee: "",
      deadline: "",
      status: "Belum Mulai",
    });
  };

  // Update Status Tugas (Admin/Kanban Drag)
  const handleUpdateTaskStatus = async (id, newStatus) => {
    const client = getSupabaseClient();
    if (client) {
      await client.from("tasks").update({ status: newStatus }).eq("id", id);
    } else {
      setTasks(
        tasks.map((t) => (t.id === id ? { ...t, status: newStatus } : t)),
      );
    }
  };

  // Hapus Tugas (Admin)
  const handleRemoveTask = async (id) => {
    const client = getSupabaseClient();
    if (client) {
      await client.from("tasks").delete().eq("id", id);
    } else {
      setTasks(tasks.filter((t) => t.id !== id));
    }
  };

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
              Pusat Database Masalah Desa & Kolaborasi Kerja Tim (ESM Mode)
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Database Status Indicator */}
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

      {/* NAVIGASI BAR */}
      <nav className="bg-slate-900 border-b border-slate-800 px-4 overflow-x-auto flex gap-1">
        <button
          onClick={() => setCurrentTab("dashboard")}
          className={`px-4 py-3 text-sm font-semibold transition-all border-b-2 flex items-center gap-2 shrink-0 ${
            currentTab === "dashboard"
              ? "border-indigo-500 text-white bg-slate-800/50"
              : "border-transparent text-slate-400 hover:text-slate-200"
          }`}
        >
          <TrendingUp className="h-4 w-4" /> Dashboard
        </button>
        <button
          onClick={() => setCurrentTab("struktur")}
          className={`px-4 py-3 text-sm font-semibold transition-all border-b-2 flex items-center gap-2 shrink-0 ${
            currentTab === "struktur"
              ? "border-indigo-500 text-white bg-slate-800/50"
              : "border-transparent text-slate-400 hover:text-slate-200"
          }`}
        >
          <Users className="h-4 w-4" /> Peta Struktur & Tupoksi
        </button>
        <button
          onClick={() => setCurrentTab("problems")}
          className={`px-4 py-3 text-sm font-semibold transition-all border-b-2 flex items-center gap-2 shrink-0 ${
            currentTab === "problems"
              ? "border-indigo-500 text-white bg-slate-800/50"
              : "border-transparent text-slate-400 hover:text-slate-200"
          }`}
        >
          <BookOpen className="h-4 w-4" /> Bank Masalah Desa
          {problems.length > 0 && (
            <span className="ml-1 bg-rose-500/20 text-rose-400 px-1.5 py-0.5 text-xs rounded-full border border-rose-500/30">
              {problems.length}
            </span>
          )}
        </button>
        <button
          onClick={() => setCurrentTab("tasks")}
          className={`px-4 py-3 text-sm font-semibold transition-all border-b-2 flex items-center gap-2 shrink-0 ${
            currentTab === "tasks"
              ? "border-indigo-500 text-white bg-slate-800/50"
              : "border-transparent text-slate-400 hover:text-slate-200"
          }`}
        >
          <CheckSquare className="h-4 w-4" /> Live Progress Tracker
        </button>
        <button
          onClick={() => setCurrentTab("alur")}
          className={`px-4 py-3 text-sm font-semibold transition-all border-b-2 flex items-center gap-2 shrink-0 ${
            currentTab === "alur"
              ? "border-indigo-500 text-white bg-slate-800/50"
              : "border-transparent text-slate-400 hover:text-slate-200"
          }`}
        >
          <ChevronRight className="h-4 w-4" /> Alur Kolaborasi Estafet
        </button>
      </nav>

      {/* CONTAINER CONTENT */}
      <main className="flex-1 p-4 md:p-8 max-w-7xl w-full mx-auto">
        {/* ======================================= */}
        {/* TAB 1: DASHBOARD OVERVIEW               */}
        {/* ======================================= */}
        {currentTab === "dashboard" && (
          <div className="space-y-8 animate-fadeIn">
            {/* CARD BANNER INFORMASI */}
            <div className="bg-gradient-to-r from-indigo-900/40 to-slate-900 border border-indigo-500/20 rounded-2xl p-6 md:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="space-y-2">
                <h2 className="text-2xl font-bold text-white">
                  Selamat Datang di KKN Sinergi Hub!
                </h2>
                <p className="text-sm text-slate-300 max-w-2xl leading-relaxed">
                  Platform ini diarsiteki khusus untuk memudahkan koordinasi 10
                  anggota tim kelompok kita di lapangan. Sebagai kelompok{" "}
                  <strong>Gelombang 1</strong>, misi utama kita adalah
                  mengumpulkan data lapangan, memetakan masalah sespesifik
                  mungkin, lalu menyerahkannya ke Kelompok Riset secara
                  terstruktur.
                </p>
                <div className="flex gap-4 pt-2">
                  <div className="text-xs text-indigo-300 flex items-center gap-1.5">
                    <UserCheck className="h-4 w-4" /> 10 Slot Anggota
                    Terstruktur
                  </div>
                  <div className="text-xs text-rose-300 flex items-center gap-1.5">
                    <AlertTriangle className="h-4 w-4" /> Bank Masalah Terpusat
                  </div>
                </div>
              </div>
              <div className="flex flex-col gap-2 shrink-0">
                <button
                  onClick={() => setCurrentTab("problems")}
                  className="bg-indigo-600 hover:bg-indigo-500 text-white px-5 py-2.5 rounded-xl text-sm font-semibold transition-all shadow-lg shadow-indigo-500/20 flex items-center gap-2 justify-center"
                >
                  <Plus className="h-4 w-4" /> Input Temuan Masalah
                </button>
                <a
                  href="https://instagram.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 px-5 py-2.5 rounded-xl text-xs font-semibold transition-all flex items-center gap-2 justify-center"
                >
                  <ExternalLink className="h-3.5 w-3.5" /> IG Kolaborasi 5
                  Kelompok
                </a>
              </div>
            </div>

            {/* BARIS UTAMA WIDGETS */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 flex items-center gap-4">
                <div className="p-3.5 bg-indigo-500/10 text-indigo-400 rounded-lg border border-indigo-500/20">
                  <Users className="h-6 w-6" />
                </div>
                <div>
                  <div className="text-2xl font-extrabold text-white">
                    {members.length}/10
                  </div>
                  <div className="text-xs text-slate-400">
                    Kekuatan Tim Terdaftar
                  </div>
                </div>
              </div>

              <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 flex items-center gap-4">
                <div className="p-3.5 bg-rose-500/10 text-rose-400 rounded-lg border border-rose-500/20">
                  <BookOpen className="h-6 w-6" />
                </div>
                <div>
                  <div className="text-2xl font-extrabold text-white">
                    {problems.length}
                  </div>
                  <div className="text-xs text-slate-400">
                    Total Masalah Terpetakan
                  </div>
                </div>
              </div>

              <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 flex items-center gap-4">
                <div className="p-3.5 bg-amber-500/10 text-amber-400 rounded-lg border border-amber-500/20">
                  <Clock className="h-6 w-6" />
                </div>
                <div>
                  <div className="text-2xl font-extrabold text-white">
                    {tasks.filter((t) => t.status === "Sedang Berjalan").length}
                  </div>
                  <div className="text-xs text-slate-400">
                    Tugas Sedang Diproses
                  </div>
                </div>
              </div>

              <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 flex items-center gap-4">
                <div className="p-3.5 bg-emerald-500/10 text-emerald-400 rounded-lg border border-emerald-500/20">
                  <CheckCircle className="h-6 w-6" />
                </div>
                <div>
                  <div className="text-2xl font-extrabold text-white">
                    {tasks.filter((t) => t.status === "Selesai").length}
                  </div>
                  <div className="text-xs text-slate-400">Tugas Rampung</div>
                </div>
              </div>
            </div>

            {/* SEKSI QUICK OVERVIEW MASALAH & TUGAS */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Box Masalah Terbaru */}
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <h3 className="font-bold text-white flex items-center gap-2">
                    <AlertTriangle className="h-5 w-5 text-rose-500" /> Temuan
                    Masalah Terakhir
                  </h3>
                  <button
                    onClick={() => setCurrentTab("problems")}
                    className="text-xs text-indigo-400 hover:underline"
                  >
                    Lihat Semua
                  </button>
                </div>

                <div className="space-y-3">
                  {problems.length === 0 ? (
                    <p className="text-sm text-slate-500 text-center py-6">
                      Belum ada temuan masalah yang dimasukkan.
                    </p>
                  ) : (
                    problems
                      .slice(-3)
                      .reverse()
                      .map((p) => (
                        <div
                          key={p.id}
                          className="p-3.5 bg-slate-950/60 border border-slate-800 rounded-xl space-y-1.5"
                        >
                          <div className="flex items-start justify-between gap-2">
                            <h4 className="text-sm font-semibold text-slate-200 line-clamp-1">
                              {p.title}
                            </h4>
                            <span
                              className={`text-[10px] px-2 py-0.5 rounded-full font-semibold border ${
                                p.severity === "Tinggi"
                                  ? "bg-rose-500/10 text-rose-400 border-rose-500/20"
                                  : p.severity === "Sedang"
                                    ? "bg-amber-500/10 text-amber-400 border-amber-500/20"
                                    : "bg-sky-500/10 text-sky-400 border-sky-500/20"
                              }`}
                            >
                              {p.severity}
                            </span>
                          </div>
                          <p className="text-xs text-slate-400 line-clamp-2">
                            {p.description}
                          </p>
                          <div className="text-[10px] text-slate-500 flex justify-between pt-1">
                            <span>Kategori: {p.category}</span>
                            <span>Dilaporkan oleh: {p.reporter}</span>
                          </div>
                        </div>
                      ))
                  )}
                </div>
              </div>

              {/* Box Tugas Berjalan */}
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <h3 className="font-bold text-white flex items-center gap-2">
                    <CheckSquare className="h-5 w-5 text-amber-500" />{" "}
                    Monitoring Tugas Aktif
                  </h3>
                  <button
                    onClick={() => setCurrentTab("tasks")}
                    className="text-xs text-indigo-400 hover:underline"
                  >
                    Buka Papan Kerja
                  </button>
                </div>

                <div className="space-y-3">
                  {tasks.filter((t) => t.status !== "Selesai").length === 0 ? (
                    <p className="text-sm text-slate-500 text-center py-6">
                      Semua tugas saat ini sedang bersih/rampung!
                    </p>
                  ) : (
                    tasks
                      .filter((t) => t.status !== "Selesai")
                      .slice(0, 3)
                      .map((t) => (
                        <div
                          key={t.id}
                          className="p-3.5 bg-slate-950/60 border border-slate-800 rounded-xl flex items-center justify-between gap-4"
                        >
                          <div className="space-y-1">
                            <h4 className="text-sm font-semibold text-slate-200">
                              {t.title}
                            </h4>
                            <div className="flex gap-3 text-[10px] text-slate-500">
                              <span>
                                PJ:{" "}
                                <strong className="text-slate-300">
                                  {t.assignee}
                                </strong>
                              </span>
                              <span>Deadline: {t.deadline}</span>
                            </div>
                          </div>
                          <span
                            className={`text-[10px] px-2.5 py-1 rounded-full font-semibold shrink-0 border ${
                              t.status === "Sedang Berjalan"
                                ? "bg-indigo-500/10 text-indigo-400 border-indigo-500/20"
                                : "bg-slate-800 text-slate-400 border-slate-700"
                            }`}
                          >
                            {t.status}
                          </span>
                        </div>
                      ))
                  )}
                </div>
              </div>
            </div>

            {/* SEKSI SHORTCUT LINKS / THE HUB */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
              <h3 className="font-bold text-white flex items-center gap-2">
                <MapPin className="h-5 w-5 text-indigo-400" /> Ekosistem &
                Tautan Pintar Kelompok
              </h3>
              <p className="text-xs text-slate-400">
                Gak usah nyari-nyari link di pin chat WhatsApp lagi. Semua
                tersentralisasi di sini:
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl hover:border-slate-700 transition-all space-y-2">
                  <span className="text-2xl">📂</span>
                  <h4 className="text-sm font-bold text-slate-200">
                    Google Drive Laporan
                  </h4>
                  <p className="text-xs text-slate-400">
                    Tempat Sekretaris menaruh draf laporan resmi format{" "}
                    <strong>Times New Roman 12pt, Spasi 1.5</strong>.
                  </p>
                  <a
                    href="#"
                    className="text-xs text-indigo-400 flex items-center gap-1 hover:underline pt-2"
                  >
                    Buka Drive <ExternalLink className="h-3 w-3" />
                  </a>
                </div>
                <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl hover:border-slate-700 transition-all space-y-2">
                  <span className="text-2xl">🎨</span>
                  <h4 className="text-sm font-bold text-slate-200">
                    Canva / Figma Bersama
                  </h4>
                  <p className="text-xs text-slate-400">
                    Tempat tim Medok kolaborasi menyusun template postingan
                    Instagram ber-palet <strong>Sage Green / Navy</strong>.
                  </p>
                  <a
                    href="#"
                    className="text-xs text-indigo-400 flex items-center gap-1 hover:underline pt-2"
                  >
                    Mulai Desain <ExternalLink className="h-3 w-3" />
                  </a>
                </div>
                <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl hover:border-slate-700 transition-all space-y-2">
                  <span className="text-2xl">📍</span>
                  <h4 className="text-sm font-bold text-slate-200">
                    Google Maps Desa KKN
                  </h4>
                  <p className="text-xs text-slate-400">
                    Peta koordinat pusat kantor balai desa agar rute tim Humas
                    dan tim lapangan tidak tersasar.
                  </p>
                  <a
                    href="#"
                    className="text-xs text-indigo-400 flex items-center gap-1 hover:underline pt-2"
                  >
                    Buka Gmaps <ExternalLink className="h-3 w-3" />
                  </a>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ======================================= */}
        {/* TAB 2: PETA STRUKTUR & TUPOKSI          */}
        {/* ======================================= */}
        {currentTab === "struktur" && (
          <div className="space-y-6 animate-fadeIn">
            <div className="border-b border-slate-800 pb-4">
              <h2 className="text-2xl font-bold text-white">
                Peta Struktur & Tupoksi Divisi
              </h2>
              <p className="text-sm text-slate-400">
                Sistem pembagian 10 anggota secara taktis untuk efektivitas
                kerja tingkat tinggi.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {Object.entries(divisions).map(([key, info]) => {
                const registered = members.filter((m) => m.division === key);
                return (
                  <div
                    key={key}
                    className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4"
                  >
                    <div className="flex items-start justify-between border-b border-slate-800 pb-3">
                      <div>
                        <h3 className="font-bold text-white text-lg flex items-center gap-2">
                          {key === "bph" ? (
                            <UserCheck className="h-5 w-5 text-indigo-400" />
                          ) : key === "litbang" ? (
                            <BookOpen className="h-5 w-5 text-rose-400" />
                          ) : key === "humas" ? (
                            <Users className="h-5 w-5 text-sky-400" />
                          ) : (
                            <Layers className="h-5 w-5 text-amber-400" />
                          )}
                          {info.name}
                        </h3>
                        <p className="text-xs text-slate-400 mt-1">
                          {info.description}
                        </p>
                      </div>
                      <span
                        className={`text-xs font-semibold px-2.5 py-1 rounded-full border ${
                          registered.length === info.max
                            ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                            : "bg-indigo-500/10 text-indigo-400 border-indigo-500/20"
                        }`}
                      >
                        {registered.length} / {info.max} Orang
                      </span>
                    </div>

                    <div className="space-y-3">
                      <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                        Anggota Terdaftar:
                      </h4>
                      {registered.length === 0 ? (
                        <p className="text-xs text-slate-500 italic py-2">
                          Belum ada anggota yang diplot ke divisi ini.
                        </p>
                      ) : (
                        <div className="grid grid-cols-1 gap-2.5">
                          {registered.map((m) => (
                            <div
                              key={m.id}
                              className="p-3 bg-slate-950 border border-slate-800 rounded-xl flex items-center justify-between"
                            >
                              <div className="space-y-1">
                                <div className="text-sm font-bold text-white">
                                  {m.name}
                                </div>
                                <div className="text-xs text-indigo-400 font-semibold">
                                  {m.role}
                                </div>
                              </div>
                              <div className="text-right">
                                <div className="text-xs text-slate-500">
                                  NIM: {m.nim}
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ======================================= */}
        {/* TAB 3: BANK MASALAH DESA                */}
        {/* ======================================= */}
        {currentTab === "problems" && (
          <div className="space-y-6 animate-fadeIn">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-slate-800 pb-4">
              <div>
                <h2 className="text-2xl font-bold text-white">
                  Repository Bank Masalah Desa
                </h2>
                <p className="text-sm text-slate-400">
                  Simpan temuan masalah lapangan secara instan agar tidak
                  hilang.
                </p>
              </div>
              <a
                href="#form-masalah"
                className="bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-all flex items-center gap-2"
              >
                <Plus className="h-4 w-4" /> Tambah Temuan Baru
              </a>
            </div>

            {/* TABEL LIST MASALAH */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
              <div className="p-4 border-b border-slate-800 bg-slate-900/50">
                <h3 className="font-bold text-white text-sm">
                  Daftar Masalah Hasil Survei
                </h3>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-slate-800 text-xs text-slate-400 uppercase bg-slate-950/40">
                      <th className="p-4">Informasi Masalah</th>
                      <th className="p-4">Kategori</th>
                      <th className="p-4">Tingkat Keparahan</th>
                      <th className="p-4">Status & Reporter</th>
                      {isAdmin && (
                        <th className="p-4 text-right">Aksi Admin</th>
                      )}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800 text-sm">
                    {problems.length === 0 ? (
                      <tr>
                        <td
                          colSpan={isAdmin ? 5 : 4}
                          className="p-8 text-center text-slate-500"
                        >
                          Belum ada masalah desa yang dimasukkan ke bank data.
                          Mulai survei lapangan!
                        </td>
                      </tr>
                    ) : (
                      problems.map((p) => (
                        <tr
                          key={p.id}
                          className="hover:bg-slate-800/30 transition-all"
                        >
                          <td className="p-4 max-w-md">
                            <div className="font-bold text-slate-200">
                              {p.title}
                            </div>
                            <div className="text-xs text-slate-400 mt-1 line-clamp-2">
                              {p.description}
                            </div>
                          </td>
                          <td className="p-4">
                            <span className="text-xs font-semibold px-2 py-1 rounded-md bg-slate-800 border border-slate-700 text-slate-300">
                              {p.category}
                            </span>
                          </td>
                          <td className="p-4">
                            <span
                              className={`text-xs font-semibold px-2.5 py-1 rounded-full border ${
                                p.severity === "Tinggi"
                                  ? "bg-rose-500/10 text-rose-400 border-rose-500/20"
                                  : p.severity === "Sedang"
                                    ? "bg-amber-500/10 text-amber-400 border-amber-500/20"
                                    : "bg-sky-500/10 text-sky-400 border-sky-500/20"
                              }`}
                            >
                              {p.severity}
                            </span>
                          </td>
                          <td className="p-4">
                            <div className="space-y-1">
                              <span
                                className={`text-[10px] font-bold px-2 py-0.5 rounded-full border uppercase ${
                                  p.status === "Disetujui"
                                    ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                                    : p.status === "Ditolak"
                                      ? "bg-slate-800 text-slate-500 border-slate-700"
                                      : "bg-indigo-500/10 text-indigo-400 border-indigo-500/20"
                                }`}
                              >
                                {p.status}
                              </span>
                              <div className="text-xs text-slate-500 mt-1">
                                Oleh: {p.reporter}
                              </div>
                            </div>
                          </td>
                          {isAdmin && (
                            <td className="p-4 text-right">
                              <div className="flex items-center justify-end gap-1">
                                {p.status === "Pending" && (
                                  <>
                                    <button
                                      onClick={() =>
                                        handleUpdateProblemStatus(
                                          p.id,
                                          "Disetujui",
                                        )
                                      }
                                      className="text-xs font-semibold px-2.5 py-1 rounded bg-emerald-600 hover:bg-emerald-500 text-white transition-all"
                                    >
                                      Terima
                                    </button>
                                    <button
                                      onClick={() =>
                                        handleUpdateProblemStatus(
                                          p.id,
                                          "Ditolak",
                                        )
                                      }
                                      className="text-xs font-semibold px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition-all"
                                    >
                                      Tolak
                                    </button>
                                  </>
                                )}
                                <button
                                  onClick={() => handleRemoveProblem(p.id)}
                                  className="p-1.5 text-rose-400 hover:bg-rose-500/10 rounded-lg transition-all"
                                  title="Hapus Permanen"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </button>
                              </div>
                            </td>
                          )}
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* FORM INPUT BARU */}
            <div
              id="form-masalah"
              className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4 max-w-2xl mx-auto"
            >
              <h3 className="font-bold text-white text-lg flex items-center gap-2">
                <FolderPlus className="h-5 w-5 text-indigo-400" /> Form Input
                Masalah Desa (Saat Survei)
              </h3>
              <p className="text-xs text-slate-400">
                Tim Litbang atau siapa pun anggota tim yang sedang wawancara
                bisa menginputkan data ke sini.
              </p>

              <form onSubmit={handleAddProblem} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-300">
                      Judul Masalah Singkat
                    </label>
                    <input
                      type="text"
                      placeholder="Contoh: Air Bersih RT 02 Keruh"
                      value={newProblem.title}
                      onChange={(e) =>
                        setNewProblem({ ...newProblem, title: e.target.value })
                      }
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-slate-100 focus:outline-none focus:border-indigo-500"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-300">
                      Kategori
                    </label>
                    <select
                      value={newProblem.category}
                      onChange={(e) =>
                        setNewProblem({
                          ...newProblem,
                          category: e.target.value,
                        })
                      }
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-slate-100 focus:outline-none focus:border-indigo-500"
                    >
                      <option value="Ekonomi/UMKM">Ekonomi/UMKM</option>
                      <option value="Kesehatan/Sanitasi">
                        Kesehatan/Sanitasi
                      </option>
                      <option value="Lingkungan Hidup">Lingkungan Hidup</option>
                      <option value="Pendidikan/Pemuda">
                        Pendidikan/Pemuda
                      </option>
                      <option value="Litbang & Data">Litbang & Data</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-300">
                    Deskripsi Detail Masalah
                  </label>
                  <textarea
                    placeholder="Tulis kronologi, dampak ke warga, atau perkiraan lokasi masalah..."
                    rows={3}
                    value={newProblem.description}
                    onChange={(e) =>
                      setNewProblem({
                        ...newProblem,
                        description: e.target.value,
                      })
                    }
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-slate-100 focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-300">
                      Skala Urgensi / Keparahan
                    </label>
                    <select
                      value={newProblem.severity}
                      onChange={(e) =>
                        setNewProblem({
                          ...newProblem,
                          severity: e.target.value,
                        })
                      }
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-slate-100 focus:outline-none focus:border-indigo-500"
                    >
                      <option value="Rendah">Rendah (Dampak Kecil)</option>
                      <option value="Sedang">Sedang (Dampak Sedang)</option>
                      <option value="Tinggi">Tinggi (Sangat Mendesak)</option>
                    </select>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-300">
                      Nama Pelapor (Kamu)
                    </label>
                    <input
                      type="text"
                      placeholder="Contoh: Luki / Humas"
                      value={newProblem.reporter}
                      onChange={(e) =>
                        setNewProblem({
                          ...newProblem,
                          reporter: e.target.value,
                        })
                      }
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-slate-100 focus:outline-none focus:border-indigo-500"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full bg-indigo-600 hover:bg-indigo-500 text-white py-2.5 rounded-lg text-sm font-semibold transition-all shadow-lg shadow-indigo-500/20"
                >
                  Kirim ke Bank Masalah Desa
                </button>
              </form>
            </div>
          </div>
        )}

        {/* ======================================= */}
        {/* TAB 4: LIVE TO-DO LIST & PROGRESS       */}
        {/* ======================================= */}
        {currentTab === "tasks" && (
          <div className="space-y-6 animate-fadeIn">
            <div className="border-b border-slate-800 pb-4">
              <h2 className="text-2xl font-bold text-white">
                Live Progress Tracker
              </h2>
              <p className="text-sm text-slate-400">
                Papan tugas taktis untuk memantau siapa mengerjakan apa, kapan
                deadline, dan progres harian.
              </p>
            </div>

            {/* FORM INPUT TUGAS BARU (HANYA ADMIN) */}
            {isAdmin && (
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
                <h3 className="font-bold text-white text-sm">
                  Panel Tambah Tugas Baru
                </h3>
                <form
                  onSubmit={handleAddTask}
                  className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end"
                >
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-300">
                      Nama Tugas / Jobdesk
                    </label>
                    <input
                      type="text"
                      placeholder="Contoh: Cetak Brosur Sosialisasi"
                      value={newTask.title}
                      onChange={(e) =>
                        setNewTask({ ...newTask, title: e.target.value })
                      }
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-slate-100 focus:outline-none focus:border-indigo-500"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-300">
                      Penanggung Jawab (PJ)
                    </label>
                    <select
                      value={newTask.assignee}
                      onChange={(e) =>
                        setNewTask({ ...newTask, assignee: e.target.value })
                      }
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-slate-100 focus:outline-none focus:border-indigo-500"
                    >
                      <option value="">Pilih Anggota/Divisi</option>
                      <option value="BPH (Pimpinan)">BPH (Pimpinan)</option>
                      <option value="Divisi Litbang">Divisi Litbang</option>
                      <option value="Divisi Humas">Divisi Humas</option>
                      <option value="Divisi Medok">Divisi Medok</option>
                      {members.map((m) => (
                        <option key={m.id} value={m.name}>
                          {m.name} ({m.role})
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-300">
                      Tenggat Waktu (Deadline)
                    </label>
                    <input
                      type="date"
                      value={newTask.deadline}
                      onChange={(e) =>
                        setNewTask({ ...newTask, deadline: e.target.value })
                      }
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-slate-100 focus:outline-none focus:border-indigo-500"
                    />
                  </div>
                  <button
                    type="submit"
                    className="bg-indigo-600 hover:bg-indigo-500 text-white py-2 px-4 rounded-lg text-sm font-semibold transition-all h-[38px] flex items-center justify-center gap-1"
                  >
                    <Plus className="h-4 w-4" /> Tambah Tugas
                  </button>
                </form>
              </div>
            )}

            {/* VISUALISASI KANBAN INTERAKTIF */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Kolom 1: Belum Mulai */}
              <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-5 space-y-4">
                <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                  <h3 className="font-bold text-slate-300 flex items-center gap-2">
                    <Clock className="h-4 w-4 text-slate-400" /> Belum Mulai
                  </h3>
                  <span className="text-xs font-mono px-2 py-0.5 rounded-full bg-slate-800 text-slate-400">
                    {tasks.filter((t) => t.status === "Belum Mulai").length}
                  </span>
                </div>

                <div className="space-y-3 min-h-[300px]">
                  {tasks.filter((t) => t.status === "Belum Mulai").length ===
                  0 ? (
                    <p className="text-xs text-slate-500 text-center py-12">
                      Tidak ada tugas di fase ini.
                    </p>
                  ) : (
                    tasks
                      .filter((t) => t.status === "Belum Mulai")
                      .map((t) => (
                        <div
                          key={t.id}
                          className="bg-slate-900 border border-slate-800 p-4 rounded-xl space-y-3 shadow-md"
                        >
                          <div className="space-y-1">
                            <h4 className="text-sm font-bold text-slate-200">
                              {t.title}
                            </h4>
                            <div className="text-xs text-slate-400">
                              PJ:{" "}
                              <strong className="text-slate-300">
                                {t.assignee}
                              </strong>
                            </div>
                          </div>
                          <div className="flex items-center justify-between pt-2 border-t border-slate-800 text-[10px]">
                            <span className="text-rose-400">
                              Deadline: {t.deadline}
                            </span>
                            <div className="flex gap-1">
                              {isAdmin ? (
                                <>
                                  <button
                                    onClick={() =>
                                      handleUpdateTaskStatus(
                                        t.id,
                                        "Sedang Berjalan",
                                      )
                                    }
                                    className="text-indigo-400 hover:bg-indigo-500/10 px-2 py-1 rounded border border-indigo-500/20 font-semibold"
                                  >
                                    Mulai
                                  </button>
                                  <button
                                    onClick={() => handleRemoveTask(t.id)}
                                    className="text-rose-400 hover:bg-rose-500/10 p-1 rounded"
                                  >
                                    <Trash2 className="h-3.5 w-3.5" />
                                  </button>
                                </>
                              ) : (
                                <span className="text-slate-500">
                                  View Only
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      ))
                  )}
                </div>
              </div>

              {/* Kolom 2: Sedang Berjalan */}
              <div className="bg-slate-900/50 border border-slate-850 rounded-2xl p-5 space-y-4">
                <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                  <h3 className="font-bold text-indigo-400 flex items-center gap-2">
                    <Clock className="h-4 w-4 text-indigo-400 animate-pulse" />{" "}
                    Sedang Berjalan
                  </h3>
                  <span className="text-xs font-mono px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-400">
                    {tasks.filter((t) => t.status === "Sedang Berjalan").length}
                  </span>
                </div>

                <div className="space-y-3 min-h-[300px]">
                  {tasks.filter((t) => t.status === "Sedang Berjalan")
                    .length === 0 ? (
                    <p className="text-xs text-slate-500 text-center py-12">
                      Tidak ada tugas yang berjalan.
                    </p>
                  ) : (
                    tasks
                      .filter((t) => t.status === "Sedang Berjalan")
                      .map((t) => (
                        <div
                          key={t.id}
                          className="bg-slate-900 border border-slate-800 p-4 rounded-xl space-y-3 shadow-md"
                        >
                          <div className="space-y-1">
                            <h4 className="text-sm font-bold text-slate-200">
                              {t.title}
                            </h4>
                            <div className="text-xs text-slate-400">
                              PJ:{" "}
                              <strong className="text-slate-300">
                                {t.assignee}
                              </strong>
                            </div>
                          </div>
                          <div className="flex items-center justify-between pt-2 border-t border-slate-800 text-[10px]">
                            <span className="text-amber-400">
                              Deadline: {t.deadline}
                            </span>
                            <div className="flex gap-1">
                              {isAdmin ? (
                                <>
                                  <button
                                    onClick={() =>
                                      handleUpdateTaskStatus(t.id, "Selesai")
                                    }
                                    className="text-emerald-400 hover:bg-emerald-500/10 px-2 py-1 rounded border border-emerald-500/20 font-semibold"
                                  >
                                    Selesai
                                  </button>
                                  <button
                                    onClick={() => handleRemoveTask(t.id)}
                                    className="text-rose-400 hover:bg-rose-500/10 p-1 rounded"
                                  >
                                    <Trash2 className="h-3.5 w-3.5" />
                                  </button>
                                </>
                              ) : (
                                <span className="text-slate-500">
                                  View Only
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      ))
                  )}
                </div>
              </div>

              {/* Kolom 3: Selesai */}
              <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-5 space-y-4">
                <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                  <h3 className="font-bold text-emerald-400 flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-emerald-400" /> Selesai
                  </h3>
                  <span className="text-xs font-mono px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400">
                    {tasks.filter((t) => t.status === "Selesai").length}
                  </span>
                </div>

                <div className="space-y-3 min-h-[300px]">
                  {tasks.filter((t) => t.status === "Selesai").length === 0 ? (
                    <p className="text-xs text-slate-500 text-center py-12">
                      Belum ada tugas selesai.
                    </p>
                  ) : (
                    tasks
                      .filter((t) => t.status === "Selesai")
                      .map((t) => (
                        <div
                          key={t.id}
                          className="bg-slate-900 border border-slate-850 p-4 rounded-xl space-y-3 opacity-70"
                        >
                          <div className="space-y-1">
                            <h4 className="text-sm font-bold text-slate-300 line-through">
                              {t.title}
                            </h4>
                            <div className="text-xs text-slate-500">
                              PJ: {t.assignee}
                            </div>
                          </div>
                          <div className="flex items-center justify-between pt-2 border-t border-slate-800 text-[10px]">
                            <span className="text-slate-500">Rampung</span>
                            <div className="flex gap-1">
                              {isAdmin ? (
                                <>
                                  <button
                                    onClick={() =>
                                      handleUpdateTaskStatus(
                                        t.id,
                                        "Sedang Berjalan",
                                      )
                                    }
                                    className="text-slate-400 hover:bg-slate-700 px-2 py-1 rounded border border-slate-700 font-semibold"
                                  >
                                    Kembalikan
                                  </button>
                                  <button
                                    onClick={() => handleRemoveTask(t.id)}
                                    className="text-rose-400 hover:bg-rose-500/10 p-1 rounded"
                                  >
                                    <Trash2 className="h-3.5 w-3.5" />
                                  </button>
                                </>
                              ) : (
                                <span className="text-emerald-500 flex items-center gap-0.5">
                                  Verified ✓
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      ))
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ======================================= */}
        {/* TAB 5: ALUR KOLABORASI ESTAFET         */}
        {/* ======================================= */}
        {currentTab === "alur" && (
          <div className="space-y-6 animate-fadeIn">
            <div className="border-b border-slate-800 pb-4">
              <h2 className="text-2xl font-bold text-white">
                Alur Kolaborasi Estafet 5 Kelompok
              </h2>
              <p className="text-sm text-slate-400">
                Sistem koordinasi antar kelompok agar proker utama berjalan
                mulus.
              </p>
            </div>

            <div className="space-y-8 relative before:absolute before:inset-0 before:left-4 md:before:left-1/2 before:w-0.5 before:bg-slate-800">
              {/* Langkah 1 */}
              <div className="relative flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <div className="absolute left-4 md:left-1/2 transform -translate-x-1/2 w-8 h-8 rounded-full bg-indigo-600 border-4 border-slate-950 flex items-center justify-center font-bold text-sm text-white z-10">
                  1
                </div>
                <div className="w-full md:w-[45%] pl-10 md:pl-0 md:text-right space-y-2">
                  <h3 className="font-bold text-white text-lg">
                    Tahap Analisis Masalah (Gelombang 1)
                  </h3>
                  <p className="text-xs text-slate-400">
                    Kelompok kita bersama kelompok mitra Gelombang 1 mendatangi
                    desa untuk memetakan monografi, mewawancarai kades/warga,
                    dan menginputkan semua masalah secara live di{" "}
                    <strong>Bank Masalah Desa</strong> di web ini.
                  </p>
                  <span className="inline-block text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                    Selesai H+7 Survei
                  </span>
                </div>
                <div className="hidden md:block w-[45%]"></div>
              </div>

              {/* Langkah 2 */}
              <div className="relative flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <div className="absolute left-4 md:left-1/2 transform -translate-x-1/2 w-8 h-8 rounded-full bg-rose-600 border-4 border-slate-950 flex items-center justify-center font-bold text-sm text-white z-10">
                  2
                </div>
                <div className="hidden md:block w-[45%]"></div>
                <div className="w-full md:w-[45%] pl-10 md:pl-0 space-y-2">
                  {/* PENGGUNAAN IKON FILETEXT DI SINI */}
                  <h3 className="font-bold text-white text-lg flex items-center gap-2">
                    <FileText className="h-5 w-5 text-rose-400" />
                    Serah Terima & Rumusan Solusi (Kelompok Riset)
                  </h3>
                  <p className="text-xs text-slate-400">
                    Semua data Bank Masalah dari web kita diserahkan secara
                    administratif oleh Sekretaris ke{" "}
                    <strong>Kelompok Riset</strong>. Kelompok Riset merancang
                    produk/sistem solusi nyata yang fungsional.
                  </p>
                  <span className="inline-block text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-rose-500/10 text-rose-400 border border-rose-500/20">
                    Fase Pengerjaan Produk
                  </span>
                </div>
              </div>

              {/* Langkah 3 */}
              <div className="relative flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <div className="absolute left-4 md:left-1/2 transform -translate-x-1/2 w-8 h-8 rounded-full bg-amber-600 border-4 border-slate-950 flex items-center justify-center font-bold text-sm text-white z-10">
                  3
                </div>
                <div className="w-full md:w-[45%] pl-10 md:pl-0 md:text-right space-y-2">
                  <h3 className="font-bold text-white text-lg">
                    Implementasi & Pelatihan (Gelombang 2)
                  </h3>
                  <p className="text-xs text-slate-400">
                    Setelah produk dari Kelompok Riset jadi, produk tersebut
                    diserahkan ke <strong>Kelompok Gelombang 2</strong> untuk
                    proses pemasangan, sosialisasi, dan pelatihan penggunaan
                    produk kepada seluruh warga desa.
                  </p>
                  <span className="inline-block text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20">
                    Output Terakhir KKN
                  </span>
                </div>
                <div className="hidden md:block w-[45%]"></div>
              </div>
            </div>
          </div>
        )}

        {/* ======================================= */}
        {/* TAB 6: ADMIN PANEL (MANAGEMENT)        */}
        {/* ======================================= */}
        {currentTab === "admin" && (
          <div className="space-y-6 animate-fadeIn">
            <div className="border-b border-slate-800 pb-4">
              <h2 className="text-2xl font-bold text-white">
                Admin Panel & Konfigurasi
              </h2>
              <p className="text-sm text-slate-400">
                Amankan otorisasi admin untuk menambah struktur tim dan
                melakukan tracking data.
              </p>
            </div>

            {/* BOX KREDENSIAL DATABASE */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
              <h3 className="font-bold text-white text-lg flex items-center gap-2">
                <Settings className="h-5 w-5 text-indigo-400" /> Pengaturan
                Koneksi Database Supabase Cloud
              </h3>
              <p className="text-xs text-slate-400">
                Hubungkan dashboard ini ke cloud milikmu secara dinamis tanpa
                perlu edit manual kodingan di Vercel. Kredensial akan disimpan
                aman di LocalStorage browser ini.
              </p>

              <form onSubmit={handleSaveConfig} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-300">
                      SUPABASE_URL
                    </label>
                    <input
                      type="text"
                      placeholder="https://yourprojectid.supabase.co"
                      value={supabaseUrl}
                      onChange={(e) => setSupabaseUrl(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-slate-100 focus:outline-none focus:border-indigo-500"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-300">
                      SUPABASE_ANON_KEY
                    </label>
                    <input
                      type="password"
                      placeholder="your-anon-key-here"
                      value={supabaseAnonKey}
                      onChange={(e) => setSupabaseAnonKey(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-slate-100 focus:outline-none focus:border-indigo-500"
                    />
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    type="submit"
                    className="bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded-lg text-xs font-semibold transition-all"
                  >
                    Simpan & Hubungkan Database Cloud
                  </button>
                  <button
                    type="button"
                    onClick={handleClearConfig}
                    className="bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 px-4 py-2 rounded-lg text-xs font-semibold transition-all"
                  >
                    Reset & Gunakan Mode Simulasi (Local)
                  </button>
                </div>
              </form>
            </div>

            {/* SEKSI LOGIN ADMIN */}
            {!isAdmin ? (
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4 max-w-md mx-auto">
                <div className="text-center space-y-2">
                  <Lock className="h-10 w-10 text-indigo-500 mx-auto" />
                  <h3 className="font-bold text-white text-lg">
                    Masuk Sebagai Admin
                  </h3>
                  <p className="text-xs text-slate-400">
                    Hanya Ketua Kelompok yang boleh memodifikasi penempatan
                    struktur tim & tracking progress.
                  </p>
                </div>

                <form onSubmit={handleLogin} className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-300">
                      Passcode Admin
                    </label>
                    <input
                      type="password"
                      placeholder="Ketik passcode kkn10hebat..."
                      value={passcode}
                      onChange={(e) => setPasscode(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-slate-100 focus:outline-none focus:border-indigo-500 text-center font-mono"
                    />
                  </div>
                  {adminError && (
                    <div className="text-xs text-rose-400 text-center">
                      {adminError}
                    </div>
                  )}
                  <button
                    type="submit"
                    className="w-full bg-indigo-600 hover:bg-indigo-500 text-white py-2 rounded-lg text-sm font-semibold transition-all"
                  >
                    Otorisasi Admin
                  </button>
                </form>
              </div>
            ) : (
              <div className="space-y-6">
                {/* STATUS BAR LOGOUT */}
                <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-4 flex items-center justify-between">
                  <div className="text-xs text-emerald-400 font-semibold flex items-center gap-1.5">
                    <Unlock className="h-4 w-4" /> Otorisasi Admin Aktif. Kamu
                    sekarang bebas melakukan manajemen tim.
                  </div>
                  <button
                    onClick={handleLogout}
                    className="text-xs font-bold text-rose-400 hover:underline"
                  >
                    Keluar Admin Mode
                  </button>
                </div>

                {/* FORM MANAJEMEN ANGGOTA BARU */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* Form Tambah Anggota */}
                  <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4 lg:col-span-1">
                    <h3 className="font-bold text-white text-sm">
                      Plot Anggota ke Divisi
                    </h3>
                    <form onSubmit={handleAddMember} className="space-y-4">
                      <div className="space-y-1.5">
                        <label className="text-xs font-bold text-slate-300">
                          Nama Lengkap Anggota
                        </label>
                        <input
                          type="text"
                          placeholder="Nama lengkap anggota..."
                          value={newMember.name}
                          onChange={(e) =>
                            setNewMember({ ...newMember, name: e.target.value })
                          }
                          className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-slate-100 focus:outline-none focus:border-indigo-500"
                          required
                        />
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-xs font-bold text-slate-300">
                          NIM (Nomor Induk Mahasiswa)
                        </label>
                        <input
                          type="text"
                          placeholder="Nomor NIM resmi..."
                          value={newMember.nim}
                          onChange={(e) =>
                            setNewMember({ ...newMember, nim: e.target.value })
                          }
                          className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-slate-100 focus:outline-none focus:border-indigo-500"
                          required
                        />
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-xs font-bold text-slate-300">
                          Divisi Penempatan
                        </label>
                        <select
                          value={newMember.division}
                          onChange={(e) =>
                            setNewMember({
                              ...newMember,
                              division: e.target.value,
                            })
                          }
                          className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-slate-100 focus:outline-none focus:border-indigo-500"
                        >
                          <option value="bph">
                            Pimpinan Inti (BPH) - Maks 3
                          </option>
                          <option value="litbang">
                            Divisi Litbang & Data - Maks 3
                          </option>
                          <option value="humas">Divisi Humas - Maks 2</option>
                          <option value="medok">Divisi Medok - Maks 2</option>
                        </select>
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-xs font-bold text-slate-300">
                          Peran Spesifik / Jobdesk
                        </label>
                        <input
                          type="text"
                          placeholder="Contoh: Koordinator Riset / Sekretaris"
                          value={newMember.role}
                          onChange={(e) =>
                            setNewMember({ ...newMember, role: e.target.value })
                          }
                          className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-slate-100 focus:outline-none focus:border-indigo-500"
                        />
                      </div>

                      <button
                        type="submit"
                        className="w-full bg-indigo-600 hover:bg-indigo-500 text-white py-2 rounded-lg text-sm font-semibold transition-all shadow-lg"
                      >
                        Daftarkan Anggota Baru
                      </button>
                    </form>
                  </div>

                  {/* Tabel Pemantauan Anggota Aktif */}
                  <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4 lg:col-span-2">
                    <h3 className="font-bold text-white text-sm">
                      Review & Pengelolaan Anggota
                    </h3>
                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-xs border-collapse">
                        <thead>
                          <tr className="border-b border-slate-800 text-slate-400 bg-slate-950/40">
                            <th className="p-3">Nama & NIM</th>
                            <th className="p-3">Divisi</th>
                            <th className="p-3">Jabatan Spesifik</th>
                            <th className="p-3 text-right">Opsi</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-800">
                          {members.map((m) => (
                            <tr key={m.id} className="hover:bg-slate-800/20">
                              <td className="p-3">
                                <div className="font-bold text-slate-200">
                                  {m.name}
                                </div>
                                <div className="text-[10px] text-slate-500">
                                  NIM: {m.nim}
                                </div>
                              </td>
                              <td className="p-3 font-semibold text-indigo-400">
                                {divisions[m.division]?.name}
                              </td>
                              <td className="p-3 text-slate-300">{m.role}</td>
                              <td className="p-3 text-right">
                                <button
                                  onClick={() => handleRemoveMember(m.id)}
                                  className="text-rose-400 hover:bg-rose-500/10 p-1 rounded"
                                  title="Keluarkan dari Struktur"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </main>

      {/* FOOTER */}
      <footer className="border-t border-slate-800 py-6 text-center text-xs text-slate-500 bg-slate-950 mt-12 space-y-2">
        <p>
          © 2026 KKN Sinergi-Workspace. Diarsiteki oleh Ketua Kelompok 10 KKN
          dengan React & Supabase.
        </p>
        <p className="text-[10px] text-slate-600">
          Dibuat menggunakan Font Times New Roman 12pt (Standar Laporan
          Akademik) & Palet Sage Navy.
        </p>
      </footer>
    </div>
  );
}
