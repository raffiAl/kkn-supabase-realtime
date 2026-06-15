import React, { useState } from 'react';
import { BookOpen, Plus, FolderPlus, AlertTriangle, Trash2 } from 'lucide-react';

export default function ProblemBank({ problems, isAdmin, addProblem, updateProblemStatus, removeProblem }) {
  const [newProblem, setNewProblem] = useState({ title: '', category: 'Ekonomi/UMKM', description: '', severity: 'Sedang', reporter: '' });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!newProblem.title || !newProblem.description) {
      alert("Harap isi semua kolom judul dan deskripsi masalah!");
      return;
    }
    const problemData = {
      id: Date.now(),
      title: newProblem.title,
      category: newProblem.category,
      description: newProblem.description,
      severity: newProblem.severity,
      status: 'Pending',
      reporter: newProblem.reporter || 'Anonim'
    };
    addProblem(problemData);
    setNewProblem({ title: '', category: 'Ekonomi/UMKM', description: '', severity: 'Sedang', reporter: '' });
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-slate-800 pb-4">
        <div>
          <h2 className="text-2xl font-bold text-white">Repository Bank Masalah Desa</h2>
          <p className="text-sm text-slate-400">Simpan temuan masalah lapangan secara instan agar tidak hilang.</p>
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
          <h3 className="font-bold text-white text-sm">Daftar Masalah Hasil Survei</h3>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-800 text-xs text-slate-400 uppercase bg-slate-950/40">
                <th className="p-4">Informasi Masalah</th>
                <th className="p-4">Kategori</th>
                <th className="p-4">Tingkat Keparahan</th>
                <th className="p-4">Status & Reporter</th>
                {isAdmin && <th className="p-4 text-right">Aksi Admin</th>}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800 text-sm">
              {problems.length === 0 ? (
                <tr>
                  <td colSpan={isAdmin ? 5 : 4} className="p-8 text-center text-slate-500">
                    Belum ada masalah desa yang dimasukkan ke bank data. Mulai survei lapangan!
                  </td>
                </tr>
              ) : (
                problems.map((p) => (
                  <tr key={p.id} className="hover:bg-slate-800/30 transition-all">
                    <td className="p-4 max-w-md">
                      <div className="font-bold text-slate-200">{p.title}</div>
                      <div className="text-xs text-slate-400 mt-1 line-clamp-2">{p.description}</div>
                    </td>
                    <td className="p-4">
                      <span className="text-xs font-semibold px-2 py-1 rounded-md bg-slate-800 border border-slate-700 text-slate-300">
                        {p.category}
                      </span>
                    </td>
                    <td className="p-4">
                      <span className={`text-xs font-semibold px-2.5 py-1 rounded-full border ${
                        p.severity === 'Tinggi' ? 'bg-rose-500/10 text-rose-400 border-rose-500/20' :
                        p.severity === 'Sedang' ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' :
                        'bg-sky-500/10 text-sky-400 border-sky-500/20'
                      }`}>
                        {p.severity}
                      </span>
                    </td>
                    <td className="p-4">
                      <div className="space-y-1">
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border uppercase ${
                          p.status === 'Disetujui' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' :
                          p.status === 'Ditolak' ? 'bg-slate-800 text-slate-500 border-slate-700' :
                          'bg-indigo-500/10 text-indigo-400 border-indigo-500/20'
                        }`}>
                          {p.status}
                        </span>
                        <div className="text-xs text-slate-500 mt-1">Oleh: {p.reporter}</div>
                      </div>
                    </td>
                    {isAdmin && (
                      <td className="p-4 text-right">
                        <div className="flex items-center justify-end gap-1">
                          {p.status === 'Pending' && (
                            <>
                              <button
                                onClick={() => updateProblemStatus(p.id, 'Disetujui')}
                                className="text-xs font-semibold px-2.5 py-1 rounded bg-emerald-600 hover:bg-emerald-500 text-white transition-all"
                              >
                                Terima
                              </button>
                              <button
                                onClick={() => updateProblemStatus(p.id, 'Ditolak')}
                                className="text-xs font-semibold px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition-all"
                              >
                                Tolak
                              </button>
                            </>
                          )}
                          <button
                            onClick={() => removeProblem(p.id)}
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
      <div id="form-masalah" className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4 max-w-2xl mx-auto">
        <h3 className="font-bold text-white text-lg flex items-center gap-2">
          <FolderPlus className="h-5 w-5 text-indigo-400" /> Form Input Masalah Desa (Saat Survei)
        </h3>
        <p className="text-xs text-slate-400">Tim Litbang atau siapa pun anggota tim yang sedang wawancara bisa menginputkan data ke sini.</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-300">Judul Masalah Singkat</label>
              <input
                type="text"
                placeholder="Contoh: Air Bersih RT 02 Keruh"
                value={newProblem.title}
                onChange={(e) => setNewProblem({ ...newProblem, title: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-slate-100 focus:outline-none focus:border-indigo-500"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-300">Kategori</label>
              <select
                value={newProblem.category}
                onChange={(e) => setNewProblem({ ...newProblem, category: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-slate-100 focus:outline-none focus:border-indigo-500"
              >
                <option value="Ekonomi/UMKM">Ekonomi/UMKM</option>
                <option value="Kesehatan/Sanitasi">Kesehatan/Sanitasi</option>
                <option value="Lingkungan Hidup">Lingkungan Hidup</option>
                <option value="Pendidikan/Pemuda">Pendidikan/Pemuda</option>
                <option value="Litbang & Data">Litbang & Data</option>
              </select>
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-300">Deskripsi Detail Masalah</label>
            <textarea
              placeholder="Tulis kronologi, dampak ke warga, atau perkiraan lokasi masalah..."
              rows={3}
              value={newProblem.description}
              onChange={(e) => setNewProblem({ ...newProblem, description: e.target.value })}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-slate-100 focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-300">Skala Urgensi / Keparahan</label>
              <select
                value={newProblem.severity}
                onChange={(e) => setNewProblem({ ...newProblem, severity: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-slate-100 focus:outline-none focus:border-indigo-500"
              >
                <option value="Rendah">Rendah (Dampak Kecil)</option>
                <option value="Sedang">Sedang (Dampak Sedang)</option>
                <option value="Tinggi">Tinggi (Sangat Mendesak)</option>
              </select>
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-300">Nama Pelapor (Kamu)</label>
              <input
                type="text"
                placeholder="Contoh: Luki / Humas"
                value={newProblem.reporter}
                onChange={(e) => setNewProblem({ ...newProblem, reporter: e.target.value })}
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
  );
}