import { useState } from 'react';
import { Plus, Clock, CheckCircle, Trash2 } from 'lucide-react';

export default function TaskBoard({ tasks, members, isAdmin, addTask, updateTaskStatus, removeTask }) {
  const [newTask, setNewTask] = useState({ title: '', assignee: '', deadline: '', status: 'Belum Mulai' });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!newTask.title || !newTask.assignee) {
      alert("Mohon isi judul tugas dan penanggung jawab!");
      return;
    }
    const taskData = {
      id: Date.now(),
      title: newTask.title,
      assignee: newTask.assignee,
      deadline: newTask.deadline || '-',
      status: 'Belum Mulai'
    };
    addTask(taskData);
    setNewTask({ title: '', assignee: '', deadline: '', status: 'Belum Mulai' });
  };

  const TaskCard = ({ t }) => (
    <div className={`bg-slate-900 border border-slate-800 p-4 rounded-xl space-y-3 shadow-md ${t.status === 'Selesai' ? 'opacity-70' : ''}`}>
      <div className="space-y-1">
        <h4 className={`text-sm font-bold text-slate-200 ${t.status === 'Selesai' ? 'line-through text-slate-300' : ''}`}>{t.title}</h4>
        <div className={`text-xs ${t.status === 'Selesai' ? 'text-slate-500' : 'text-slate-400'}`}>
          PJ: <strong className="text-slate-300">{t.assignee}</strong>
        </div>
      </div>
      <div className="flex items-center justify-between pt-2 border-t border-slate-800 text-[10px]">
        <span className={t.status === 'Selesai' ? 'text-slate-500' : (t.status === 'Sedang Berjalan' ? 'text-amber-400' : 'text-rose-400')}>
          {t.status === 'Selesai' ? 'Rampung' : `Deadline: ${t.deadline}`}
        </span>
        <div className="flex gap-1">
          {isAdmin ? (
            <>
              {t.status === 'Belum Mulai' && (
                <button
                  onClick={() => updateTaskStatus(t.id, 'Sedang Berjalan')}
                  className="text-indigo-400 hover:bg-indigo-500/10 px-2 py-1 rounded border border-indigo-500/20 font-semibold"
                >
                  Mulai
                </button>
              )}
              {t.status === 'Sedang Berjalan' && (
                <button
                  onClick={() => updateTaskStatus(t.id, 'Selesai')}
                  className="text-emerald-400 hover:bg-emerald-500/10 px-2 py-1 rounded border border-emerald-500/20 font-semibold"
                >
                  Selesai
                </button>
              )}
              {t.status === 'Selesai' && (
                <button
                  onClick={() => updateTaskStatus(t.id, 'Sedang Berjalan')}
                  className="text-slate-400 hover:bg-slate-700 px-2 py-1 rounded border border-slate-700 font-semibold"
                >
                  Kembalikan
                </button>
              )}
              <button
                onClick={() => removeTask(t.id)}
                className="text-rose-400 hover:bg-rose-500/10 p-1 rounded"
              >
                <Trash2 className="h-3.5 w-3.5" />
              </button>
            </>
          ) : (
            <span className={t.status === 'Selesai' ? 'text-emerald-500 flex items-center gap-0.5' : 'text-slate-500'}>
              {t.status === 'Selesai' ? 'Verified ✓' : 'View Only'}
            </span>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-6 animate-fadeIn">
      <div className="border-b border-slate-800 pb-4">
        <h2 className="text-2xl font-bold text-white">Live Progress Tracker</h2>
        <p className="text-sm text-slate-400">Papan tugas taktis untuk memantau siapa mengerjakan apa, kapan deadline, dan progres harian.</p>
      </div>

      {/* FORM INPUT TUGAS BARU (HANYA ADMIN) */}
      {isAdmin && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
          <h3 className="font-bold text-white text-sm">Panel Tambah Tugas Baru</h3>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-300">Nama Tugas / Jobdesk</label>
              <input
                type="text"
                placeholder="Contoh: Cetak Brosur Sosialisasi"
                value={newTask.title}
                onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-slate-100 focus:outline-none focus:border-indigo-500"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-300">Penanggung Jawab (PJ)</label>
              <select
                value={newTask.assignee}
                onChange={(e) => setNewTask({ ...newTask, assignee: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-slate-100 focus:outline-none focus:border-indigo-500"
              >
                <option value="">Pilih Anggota/Divisi</option>
                <option value="BPH (Pimpinan)">BPH (Pimpinan)</option>
                <option value="Divisi Litbang">Divisi Litbang</option>
                <option value="Divisi Humas">Divisi Humas</option>
                <option value="Divisi Medok">Divisi Medok</option>
                {members.map(m => (
                  <option key={m.id} value={m.name}>{m.name}</option>
                ))}
              </select>
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-300">Tenggat Waktu (Deadline)</label>
              <input
                type="date"
                value={newTask.deadline}
                onChange={(e) => setNewTask({ ...newTask, deadline: e.target.value })}
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
              {tasks.filter(t => t.status === 'Belum Mulai').length}
            </span>
          </div>
          <div className="space-y-3 min-h-[300px]">
            {tasks.filter(t => t.status === 'Belum Mulai').length === 0 ? (
              <p className="text-xs text-slate-500 text-center py-12">Tidak ada tugas di fase ini.</p>
            ) : (
              tasks.filter(t => t.status === 'Belum Mulai').map((t) => <TaskCard key={t.id} t={t} />)
            )}
          </div>
        </div>

        {/* Kolom 2: Sedang Berjalan */}
        <div className="bg-slate-900/50 border border-slate-850 rounded-2xl p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2">
            <h3 className="font-bold text-indigo-400 flex items-center gap-2">
              <Clock className="h-4 w-4 text-indigo-400 animate-pulse" /> Sedang Berjalan
            </h3>
            <span className="text-xs font-mono px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-400">
              {tasks.filter(t => t.status === 'Sedang Berjalan').length}
            </span>
          </div>
          <div className="space-y-3 min-h-[300px]">
            {tasks.filter(t => t.status === 'Sedang Berjalan').length === 0 ? (
              <p className="text-xs text-slate-500 text-center py-12">Tidak ada tugas yang berjalan.</p>
            ) : (
              tasks.filter(t => t.status === 'Sedang Berjalan').map((t) => <TaskCard key={t.id} t={t} />)
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
              {tasks.filter(t => t.status === 'Selesai').length}
            </span>
          </div>
          <div className="space-y-3 min-h-[300px]">
            {tasks.filter(t => t.status === 'Selesai').length === 0 ? (
              <p className="text-xs text-slate-500 text-center py-12">Belum ada tugas selesai.</p>
            ) : (
              tasks.filter(t => t.status === 'Selesai').map((t) => <TaskCard key={t.id} t={t} />)
            )}
          </div>
        </div>
      </div>
    </div>
  );
}