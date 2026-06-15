
import { Users, BookOpen, CheckCircle, Clock, Plus, AlertTriangle, UserCheck, ExternalLink, MapPin } from 'lucide-react';

export default function Dashboard({ members, problems, tasks, setCurrentTab }) {
  return (
    <div className="space-y-8 animate-fadeIn">
      {/* CARD BANNER INFORMASI */}
      <div className="bg-gradient-to-r from-indigo-900/40 to-slate-900 border border-indigo-500/20 rounded-2xl p-6 md:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2">
          <h2 className="text-2xl font-bold text-white">Selamat Datang di KKN Sinergi Hub!</h2>
          <p className="text-sm text-slate-300 max-w-2xl leading-relaxed">
            Platform ini diarsiteki khusus untuk memudahkan koordinasi 10 anggota tim kelompok kita di lapangan.
            Sebagai kelompok <strong>Gelombang 1</strong>, misi utama kita adalah mengumpulkan data lapangan, memetakan masalah sespesifik mungkin, lalu menyerahkannya ke Kelompok Riset secara terstruktur.
          </p>
          <div className="flex gap-4 pt-2">
            <div className="text-xs text-indigo-300 flex items-center gap-1.5">
              <UserCheck className="h-4 w-4" /> 10 Slot Anggota Terstruktur
            </div>
            <div className="text-xs text-rose-300 flex items-center gap-1.5">
              <AlertTriangle className="h-4 w-4" /> Bank Masalah Terpusat
            </div>
          </div>
        </div>
        <div className="flex flex-col gap-2 shrink-0">
          <button
            onClick={() => setCurrentTab('problems')}
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
            <ExternalLink className="h-3.5 w-3.5" /> IG Kolaborasi 5 Kelompok
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
            <div className="text-2xl font-extrabold text-white">{members.length}/10</div>
            <div className="text-xs text-slate-400">Kekuatan Tim Terdaftar</div>
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 flex items-center gap-4">
          <div className="p-3.5 bg-rose-500/10 text-rose-400 rounded-lg border border-rose-500/20">
            <BookOpen className="h-6 w-6" />
          </div>
          <div>
            <div className="text-2xl font-extrabold text-white">{problems.length}</div>
            <div className="text-xs text-slate-400">Total Masalah Terpetakan</div>
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 flex items-center gap-4">
          <div className="p-3.5 bg-amber-500/10 text-amber-400 rounded-lg border border-amber-500/20">
            <Clock className="h-6 w-6" />
          </div>
          <div>
            <div className="text-2xl font-extrabold text-white">
              {tasks.filter(t => t.status === 'Sedang Berjalan').length}
            </div>
            <div className="text-xs text-slate-400">Tugas Sedang Diproses</div>
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 flex items-center gap-4">
          <div className="p-3.5 bg-emerald-500/10 text-emerald-400 rounded-lg border border-emerald-500/20">
            <CheckCircle className="h-6 w-6" />
          </div>
          <div>
            <div className="text-2xl font-extrabold text-white">
              {tasks.filter(t => t.status === 'Selesai').length}
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
              <AlertTriangle className="h-5 w-5 text-rose-500" /> Temuan Masalah Terakhir
            </h3>
            <button onClick={() => setCurrentTab('problems')} className="text-xs text-indigo-400 hover:underline">
              Lihat Semua
            </button>
          </div>

          <div className="space-y-3">
            {problems.length === 0 ? (
              <p className="text-sm text-slate-500 text-center py-6">Belum ada temuan masalah yang dimasukkan.</p>
            ) : (
              problems.slice(-3).reverse().map((p) => (
                <div key={p.id} className="p-3.5 bg-slate-950/60 border border-slate-800 rounded-xl space-y-1.5">
                  <div className="flex items-start justify-between gap-2">
                    <h4 className="text-sm font-semibold text-slate-200 line-clamp-1">{p.title}</h4>
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-semibold border ${
                      p.severity === 'Tinggi' ? 'bg-rose-500/10 text-rose-400 border-rose-500/20' :
                      p.severity === 'Sedang' ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' :
                      'bg-sky-500/10 text-sky-400 border-sky-500/20'
                    }`}>
                      {p.severity}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 line-clamp-2">{p.description}</p>
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
              <CheckSquareIcon className="h-5 w-5 text-amber-500" /> Monitoring Tugas Aktif
            </h3>
            <button onClick={() => setCurrentTab('tasks')} className="text-xs text-indigo-400 hover:underline">
              Buka Papan Kerja
            </button>
          </div>

          <div className="space-y-3">
            {tasks.filter(t => t.status !== 'Selesai').length === 0 ? (
              <p className="text-sm text-slate-500 text-center py-6">Semua tugas saat ini sedang bersih/rampung!</p>
            ) : (
              tasks.filter(t => t.status !== 'Selesai').slice(0, 3).map((t) => (
                <div key={t.id} className="p-3.5 bg-slate-950/60 border border-slate-800 rounded-xl flex items-center justify-between gap-4">
                  <div className="space-y-1">
                    <h4 className="text-sm font-semibold text-slate-200">{t.title}</h4>
                    <div className="flex gap-3 text-[10px] text-slate-500">
                      <span>PJ: <strong className="text-slate-300">{t.assignee}</strong></span>
                      <span>Deadline: {t.deadline}</span>
                    </div>
                  </div>
                  <span className={`text-[10px] px-2.5 py-1 rounded-full font-semibold shrink-0 border ${
                    t.status === 'Sedang Berjalan' ? 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20' : 'bg-slate-800 text-slate-400 border-slate-700'
                  }`}>
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
          <MapPin className="h-5 w-5 text-indigo-400" /> Ekosistem & Tautan Pintar Kelompok
        </h3>
        <p className="text-xs text-slate-400">Gak usah nyari-nyari link di pin chat WhatsApp lagi. Semua tersentralisasi di sini:</p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl hover:border-slate-700 transition-all space-y-2">
            <span className="text-2xl">📂</span>
            <h4 className="text-sm font-bold text-slate-200">Google Drive Laporan</h4>
            <p className="text-xs text-slate-400">Tempat Sekretaris menaruh draf laporan resmi format <strong>Times New Roman 12pt, Spasi 1.5</strong>.</p>
            <a href="#" className="text-xs text-indigo-400 flex items-center gap-1 hover:underline pt-2">Buka Drive <ExternalLink className="h-3 w-3" /></a>
          </div>
          <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl hover:border-slate-700 transition-all space-y-2">
            <span className="text-2xl">🎨</span>
            <h4 className="text-sm font-bold text-slate-200">Canva / Figma Bersama</h4>
            <p className="text-xs text-slate-400">Tempat tim Medok kolaborasi menyusun template postingan Instagram ber-palet <strong>Sage Green / Navy</strong>.</p>
            <a href="#" className="text-xs text-indigo-400 flex items-center gap-1 hover:underline pt-2">Mulai Desain <ExternalLink className="h-3 w-3" /></a>
          </div>
          <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl hover:border-slate-700 transition-all space-y-2">
            <span className="text-2xl">📍</span>
            <h4 className="text-sm font-bold text-slate-200">Google Maps Desa KKN</h4>
            <p className="text-xs text-slate-400">Peta koordinat pusat kantor balai desa agar rute tim Humas dan tim lapangan tidak tersasar.</p>
            <a href="#" className="text-xs text-indigo-400 flex items-center gap-1 hover:underline pt-2">Buka Gmaps <ExternalLink className="h-3 w-3" /></a>
          </div>
        </div>
      </div>
    </div>
  );
}

// Helper icon since CheckSquare wasn't imported in this specific snippet but used
function CheckSquareIcon(props) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><polyline points="9 11 12 14 22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/></svg>
  );
}