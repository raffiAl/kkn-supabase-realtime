import { useState } from "react";
import { Settings, Lock, Unlock, Copy, Trash2 } from "lucide-react";

const DEFAULT_GROUP_URL = "https://vbziomrdbsmsnqegkqwq.supabase.co";
const DEFAULT_GROUP_ANON_KEY = "sb_publishable_gaDYw_p-U56_ejevdObJvw_74n6scNF";

const divisions = {
  bph: { name: "Pimpinan Inti (BPH)", max: 3 },
  litbang: { name: "Divisi Litbang & Data", max: 3 },
  humas: { name: "Divisi Humas", max: 2 },
  medok: { name: "Divisi Medok", max: 2 },
};

export default function AdminPanel({
  members,
  supabaseUrl: initialUrl,
  supabaseAnonKey: initialKey,
  saveConfig,
  clearConfig,
  addMember,
  removeMember,
  isAdmin,
  setIsAdmin,
}) {
  const [passcode, setPasscode] = useState("");
  const [adminError, setAdminError] = useState("");
  const [copiedUrl, setCopiedUrl] = useState(false);
  const [copiedKey, setCopiedKey] = useState(false);
  const [newMember, setNewMember] = useState({
    name: "",
    nim: "",
    division: "bph",
    role: "",
  });

  const [localUrl, setLocalUrl] = useState(initialUrl);
  const [localKey, setLocalKey] = useState(initialKey);

  const handleCopyToClipboard = (textToCopy, target) => {
    navigator.clipboard
      .writeText(textToCopy)
      .then(() => {
        if (target === "url") {
          setCopiedUrl(true);
          setTimeout(() => setCopiedUrl(false), 2000);
        } else {
          setCopiedKey(true);
          setTimeout(() => setCopiedKey(false), 2000);
        }
      })
      .catch((err) => {
        console.error("Gagal menyalin teks ke clipboard: ", err);
      });
  };

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

  const handleAddMember = (e) => {
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
      id: Date.now(),
      name: newMember.name,
      nim: newMember.nim,
      division: newMember.division,
      role: newMember.role || "Anggota Tim",
    };

    addMember(memberData);
    setNewMember({ name: "", nim: "", division: "bph", role: "" });
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      <div className="border-b border-slate-800 pb-4">
        <h2 className="text-2xl font-bold text-white">
          Admin Panel & Konfigurasi
        </h2>
        <p className="text-sm text-slate-400">
          Amankan otorisasi admin untuk menambah struktur tim dan melakukan
          tracking data.
        </p>
      </div>

      {/* BOX 1: KREDENSIAL AKSES DATABASE BERSAMA */}
      <div className="bg-gradient-to-br from-indigo-950/50 to-slate-900 border border-indigo-500/30 rounded-2xl p-6 space-y-4">
        <div className="flex items-center gap-2">
          <span className="text-lg">🔑</span>
          <h3 className="font-bold text-white text-md">
            Kredensial Akses Database Bersama (Tinggal Salin)
          </h3>
        </div>
        <p className="text-xs text-slate-400 leading-relaxed">
          Pajang bagian ini di web agar teman satu tim KKN tinggal menyalin
          kredensial ini dan menempelkannya ke panel konfigurasi perangkat
          masing-masing tanpa harus login ulang ke Supabase.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
          <div className="bg-slate-950/80 border border-slate-800 p-4 rounded-xl flex items-center justify-between gap-4">
            <div className="space-y-1 overflow-hidden">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                Default Supabase URL
              </span>
              <code className="text-xs text-indigo-300 font-mono block truncate">
                {DEFAULT_GROUP_URL}
              </code>
            </div>
            <button
              onClick={() => handleCopyToClipboard(DEFAULT_GROUP_URL, "url")}
              className={`flex items-center gap-1.5 shrink-0 text-xs font-semibold px-3 py-1.5 rounded-lg border transition-all ${
                copiedUrl
                  ? "bg-emerald-500/20 text-emerald-400 border-emerald-500/30"
                  : "bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700"
              }`}
            >
              <Copy className="h-3.5 w-3.5" />
              {copiedUrl ? "Tersalin! ✓" : "Salin URL"}
            </button>
          </div>

          <div className="bg-slate-950/80 border border-slate-800 p-4 rounded-xl flex items-center justify-between gap-4">
            <div className="space-y-1 overflow-hidden">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                Default Supabase Anon Key
              </span>
              <code className="text-xs text-indigo-300 font-mono block truncate">
                {DEFAULT_GROUP_ANON_KEY}
              </code>
            </div>
            <button
              onClick={() =>
                handleCopyToClipboard(DEFAULT_GROUP_ANON_KEY, "key")
              }
              className={`flex items-center gap-1.5 shrink-0 text-xs font-semibold px-3 py-1.5 rounded-lg border transition-all ${
                copiedKey
                  ? "bg-emerald-500/20 text-emerald-400 border-emerald-500/30"
                  : "bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700"
              }`}
            >
              <Copy className="h-3.5 w-3.5" />
              {copiedKey ? "Tersalin! ✓" : "Salin Key"}
            </button>
          </div>
        </div>
      </div>

      {/* BOX 2: FORM SETUP DATABASE INDIVIDUAL */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
        <h3 className="font-bold text-white text-lg flex items-center gap-2">
          <Settings className="h-5 w-5 text-indigo-400" /> Hubungkan Perangkat
          ke Supabase Cloud
        </h3>
        <p className="text-xs text-slate-400">
          Tempel kredensial database yang sudah kamu salin dari box di atas ke
          kolom di bawah ini untuk menghubungkan aplikasi browser ini secara
          dinamis.
        </p>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            saveConfig(localUrl, localKey);
          }}
          className="space-y-4"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-300">
                SUPABASE_URL
              </label>
              <input
                type="text"
                placeholder="https://yourprojectid.supabase.co"
                value={localUrl}
                onChange={(e) => setLocalUrl(e.target.value)}
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
                value={localKey}
                onChange={(e) => setLocalKey(e.target.value)}
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
              onClick={clearConfig}
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
              Hanya Ketua Kelompok yang boleh memodifikasi penempatan struktur
              tim & tracking progress.
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
                      setNewMember({ ...newMember, division: e.target.value })
                    }
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-slate-100 focus:outline-none focus:border-indigo-500"
                  >
                    <option value="bph">Pimpinan Inti (BPH) - Maks 3</option>
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
                            onClick={() => removeMember(m.id)}
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
  );
}
