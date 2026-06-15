import { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';

// --- ARSITEKTUR SINGLETON SUPABASE CLIENT ---
let supabaseInstance = null;

const DEFAULT_SUPABASE_URL = "https://vbziomrdbsmsnqegkqwq.supabase.co";
const DEFAULT_SUPABASE_ANON_KEY = "sb_publishable_gaDYw_p-U56_ejevdObJvw_74n6scNF";

const getSupabaseClient = (url, key) => {
  if (!url || !key) {
    supabaseInstance = null;
    return null;
  }

  if (!supabaseInstance || supabaseInstance.supabaseUrl !== url || supabaseInstance.supabaseKey !== key) {
    try {
      supabaseInstance = createClient(url, key);
      supabaseInstance.supabaseUrl = url;
      supabaseInstance.supabaseKey = key;
    } catch (e) {
      console.error("Gagal menginisialisasi Supabase:", e);
      supabaseInstance = null;
    }
  }
  return supabaseInstance;
};

export function useKknData() {
  const [supabaseUrl, setSupabaseUrl] = useState(localStorage.getItem('SUPABASE_URL') || DEFAULT_SUPABASE_URL);
  const [supabaseAnonKey, setSupabaseAnonKey] = useState(localStorage.getItem('SUPABASE_ANON_KEY') || DEFAULT_SUPABASE_ANON_KEY);

  const [members, setMembers] = useState([
    { id: 1, name: 'Raffi', nim: '20240100101', division: 'bph', role: 'Ketua Kelompok & System Architect' },
    { id: 2, name: 'Siti Rahma', nim: '20240100102', division: 'bph', role: 'Sekretaris Kelompok & Admin Dokumen' },
    { id: 3, name: 'Fajar Nugraha', nim: '20240100103', division: 'bph', role: 'Bendahara Kelompok & Manajer Keuangan' }
  ]);

  const [problems, setProblems] = useState([
    { id: 4, title: 'Minimnya Peta Digital Potensi Desa', category: 'Litbang & Data', description: 'Belum adanya peta interaktif yang menunjukkan lokasi UMKM unggulan desa untuk menarik investor luar.', severity: 'Tinggi', status: 'Pending', reporter: 'Divisi Litbang' },
    { id: 5, title: 'Saluran Irigasi Tersumbat Sampah Plastik', category: 'Lingkungan', description: 'Irigasi persawahan di RT 03 tersumbat tumpukan sampah domestik, berisiko banjir saat musim hujan.', severity: 'Tinggi', status: 'Pending', reporter: 'Luki (Humas)' }
  ]);

  const [tasks, setTasks] = useState([
    { id: 6, title: 'Menyusun Surat Izin Survei Desa', assignee: 'Siti Rahma', deadline: '2026-06-15', status: 'Selesai' },
    { id: 7, title: 'Menyusun 15 Draf Pertanyaan Wawancara', assignee: 'Divisi Litbang', deadline: '2026-06-16', status: 'Sedang Berjalan' },
    { id: 8, title: 'Koordinasi Jadwal dengan Kepala Desa', assignee: 'Divisi Humas', deadline: '2026-06-16', status: 'Belum Mulai' },
    { id: 9, title: 'Membuat Brand Guidelines Akun IG Bersama', assignee: 'Divisi Medok', deadline: '2026-06-18', status: 'Belum Mulai' }
  ]);

  const [dbStatus, setDbStatus] = useState('Menginisialisasi...');
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    const client = getSupabaseClient(supabaseUrl, supabaseAnonKey);

    if (client) {
      const loadData = async () => {
        try {
          const { data: dbMembers, error: errMembers } = await client.from('members').select('*');
          if (!errMembers && dbMembers) setMembers(dbMembers);

          const { data: dbProblems, error: errProblems } = await client.from('village_problems').select('*');
          if (!errProblems && dbProblems) setProblems(dbProblems);

          const { data: dbTasks, error: errTasks } = await client.from('tasks').select('*');
          if (!errTasks && dbTasks) setTasks(dbTasks);

          setDbStatus('Koneksi Supabase Cloud Aktif 🟢');
        } catch (err) {
          console.error("Gagal memload data dari Supabase:", err);
          setErrorMessage(`Database Gagal Merespons: ${err.message || 'Periksa status RLS / skema tabel Anda.'}`);
          setDbStatus('Koneksi Supabase Gagal 🔴');
          localStorage.removeItem('SUPABASE_URL');
          localStorage.removeItem('SUPABASE_ANON_KEY');
          setSupabaseUrl('');
          setSupabaseAnonKey('');
        }
      };

      loadData();

      const membersChan = client.channel('members_realtime')
        .on('postgres_changes', { event: '*', schema: 'public', table: 'members' }, loadData)
        .subscribe();

      const problemsChan = client.channel('problems_realtime')
        .on('postgres_changes', { event: '*', schema: 'public', table: 'village_problems' }, loadData)
        .subscribe();

      const tasksChan = client.channel('tasks_realtime')
        .on('postgres_changes', { event: '*', schema: 'public', table: 'tasks' }, loadData)
        .subscribe();

      return () => {
        client.removeChannel(membersChan);
        client.removeChannel(problemsChan);
        client.removeChannel(tasksChan);
      };
    } else {
      // Schedule status update asynchronously to avoid cascading renders
      const timeoutId = setTimeout(() => {
        setDbStatus('Local Mode (Simulasi Memori) 🟡');
      }, 0);
      return () => clearTimeout(timeoutId);
    }
  }, [supabaseUrl, supabaseAnonKey]);

  // --- MEMBER HANDLERS ---
  const addMember = async (memberData) => {
    setErrorMessage('');
    const client = getSupabaseClient(supabaseUrl, supabaseAnonKey);
    if (client) {
      const { error } = await client.from('members').insert([memberData]);
      if (error) setErrorMessage(`Gagal menambah Anggota: ${error.message}`);
    } else {
      setMembers(prev => [...prev, memberData]);
    }
  };

  const removeMember = async (id) => {
    setErrorMessage('');
    const client = getSupabaseClient(supabaseUrl, supabaseAnonKey);
    if (client) {
      const { error } = await client.from('members').delete().eq('id', Number(id));
      if (error) setErrorMessage(`Gagal menghapus Anggota: ${error.message}`);
    } else {
      setMembers(prev => prev.filter(m => m.id !== id));
    }
  };

  // --- PROBLEM HANDLERS ---
  const addProblem = async (problemData) => {
    setErrorMessage('');
    const client = getSupabaseClient(supabaseUrl, supabaseAnonKey);
    if (client) {
      const { error } = await client.from('village_problems').insert([problemData]);
      if (error) setErrorMessage(`Gagal menyimpan masalah: ${error.message}. Pastikan tabel 'village_problems' dengan RLS aktif sudah dibuat.`);
    } else {
      setProblems(prev => [...prev, problemData]);
    }
  };

  const updateProblemStatus = async (id, newStatus) => {
    setErrorMessage('');
    const client = getSupabaseClient(supabaseUrl, supabaseAnonKey);
    if (client) {
      const { error } = await client.from('village_problems').update({ status: newStatus }).eq('id', Number(id));
      if (error) setErrorMessage(`Gagal memperbarui status masalah: ${error.message}`);
    } else {
      setProblems(prev => prev.map(p => p.id === id ? { ...p, status: newStatus } : p));
    }
  };

  const removeProblem = async (id) => {
    setErrorMessage('');
    const client = getSupabaseClient(supabaseUrl, supabaseAnonKey);
    if (client) {
      const { error } = await client.from('village_problems').delete().eq('id', Number(id));
      if (error) setErrorMessage(`Gagal menghapus masalah: ${error.message}`);
    } else {
      setProblems(prev => prev.filter(p => p.id !== id));
    }
  };

  // --- TASK HANDLERS ---
  const addTask = async (taskData) => {
    setErrorMessage('');
    const client = getSupabaseClient(supabaseUrl, supabaseAnonKey);
    if (client) {
      const { error } = await client.from('tasks').insert([taskData]);
      if (error) setErrorMessage(`Gagal menyimpan tugas baru: ${error.message}. Pastikan tabel 'tasks' dengan RLS aktif sudah dibuat.`);
    } else {
      setTasks(prev => [...prev, taskData]);
    }
  };

  const updateTaskStatus = async (id, newStatus) => {
    setErrorMessage('');
    const client = getSupabaseClient(supabaseUrl, supabaseAnonKey);
    if (client) {
      const { error } = await client.from('tasks').update({ status: newStatus }).eq('id', Number(id));
      if (error) setErrorMessage(`Gagal memperbarui status tugas: ${error.message}`);
    } else {
      setTasks(prev => prev.map(t => t.id === id ? { ...t, status: newStatus } : t));
    }
  };

  const removeTask = async (id) => {
    setErrorMessage('');
    const client = getSupabaseClient(supabaseUrl, supabaseAnonKey);
    if (client) {
      const { error } = await client.from('tasks').delete().eq('id', Number(id));
      if (error) setErrorMessage(`Gagal menghapus tugas: ${error.message}`);
    } else {
      setTasks(prev => prev.filter(t => t.id !== id));
    }
  };

  return {
    members, problems, tasks,
    dbStatus, errorMessage, setErrorMessage,
    addMember, removeMember,
    addProblem, updateProblemStatus, removeProblem,
    addTask, updateTaskStatus, removeTask,
  };
}