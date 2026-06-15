import { useState } from "react";
import { Lock, Unlock, Trash2 } from "lucide-react";

const divisions = {
  bph: { name: "Pimpinan Inti (BPH)", max: 3 },
  litbang: { name: "Divisi Litbang & Data", max: 3 },
  humas: { name: "Divisi Humas", max: 2 },
  medok: { name: "Divisi Medok", max: 2 },
};

export default function AdminPanel({
  members,
  addMember,
  removeMember,
  isAdmin,
  setIsAdmin,
}) {
  const [passcode, setPasscode] = useState("");
  const [adminError, setAdminError] = useState("");
  const [newMember, setNewMember] = useState({
    name: "",
    nim: "",
    division: "bph",
    role: "",
  });

  const handleLogin = (e) => {
    e.preventDefault();
    if (passcode === "kkn22hebat") {
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
                placeholder="Ketik passcode..."
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
