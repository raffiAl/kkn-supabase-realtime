
import { Users, BookOpen, UserCheck, Layers } from 'lucide-react';

const divisions = {
  bph: { name: 'Pimpinan Inti (BPH)', max: 3, description: 'Ketua, Sekretaris, dan Bendahara. Bertanggung jawab atas administrasi, manajemen uang, dan arah kebijakan kelompok.' },
  litbang: { name: 'Divisi Litbang & Data', max: 3, description: 'Fokus pada riset masalah desa, menyusun kuesioner wawancara, serta mengolah data monografi.' },
  humas: { name: 'Divisi Humas & Hubungan Lembaga', max: 2, description: 'Ujung tombak komunikasi, perizinan instansi, serta pengatur jadwal pertemuan tim di lapangan.' },
  medok: { name: 'Divisi Media & Dokumentasi (Medok)', max: 2, description: 'Mengelola Instagram kolaborasi bersama 5 kelompok, mengambil foto/video investigatif, dan menyusun infografis.' }
};

export default function Struktur({ members }) {
  return (
    <div className="space-y-6 animate-fadeIn">
      <div className="border-b border-slate-800 pb-4">
        <h2 className="text-2xl font-bold text-white">Peta Struktur & Tupoksi Divisi</h2>
        <p className="text-sm text-slate-400">Sistem pembagian 10 anggota secara taktis untuk efektivitas kerja tingkat tinggi.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {Object.entries(divisions).map(([key, info]) => {
          const registered = members.filter(m => m.division === key);
          return (
            <div key={key} className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
              <div className="flex items-start justify-between border-b border-slate-800 pb-3">
                <div>
                  <h3 className="font-bold text-white text-lg flex items-center gap-2">
                    {key === 'bph' ? <UserCheck className="h-5 w-5 text-indigo-400" /> :
                     key === 'litbang' ? <BookOpen className="h-5 w-5 text-rose-400" /> :
                     key === 'humas' ? <Users className="h-5 w-5 text-sky-400" /> :
                     <Layers className="h-5 w-5 text-amber-400" />}
                    {info.name}
                  </h3>
                  <p className="text-xs text-slate-400 mt-1">{info.description}</p>
                </div>
                <span className={`text-xs font-semibold px-2.5 py-1 rounded-full border ${
                  registered.length === info.max
                    ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                    : 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20'
                }`}>
                  {registered.length} / {info.max} Orang
                </span>
              </div>

              <div className="space-y-3">
                <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider">Anggota Terdaftar:</h4>
                {registered.length === 0 ? (
                  <p className="text-xs text-slate-500 italic py-2">Belum ada anggota yang diplot ke divisi ini.</p>
                ) : (
                  <div className="grid grid-cols-1 gap-2.5">
                    {registered.map((m) => (
                      <div key={m.id} className="p-3 bg-slate-950 border border-slate-800 rounded-xl flex items-center justify-between">
                        <div className="space-y-1">
                          <div className="text-sm font-bold text-white">{m.name}</div>
                          <div className="text-xs text-indigo-400 font-semibold">{m.role}</div>
                        </div>
                        <div className="text-right">
                          <div className="text-xs text-slate-500">NIM: {m.nim}</div>
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
  );
}