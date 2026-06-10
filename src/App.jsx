import { useState, useEffect } from 'react';
// Menggunakan ESM CDN agar kompatibel dengan lingkungan sandbox preview tanpa install npm manual
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

// TODO: GANTI KEDUA NILAI INI DENGAN DATA DARI SETTINGS -> API DI DASHBOARD SUPABASE KAMU
const SUPABASE_URL = "https://vbziomrdbsmsnqegkqwq.supabase.co";
const SUPABASE_ANON_KEY = "sb_publishable_gaDYw_p-U56_ejevdObJvw_74n6scNF";

// Proteksi agar aplikasi tidak crash di pratinjau jika kunci Supabase belum diganti
const isPlaceholder = SUPABASE_URL.includes("GANTI_DENGAN_") || SUPABASE_ANON_KEY.includes("GANTI_DENGAN_");

// Inisialisasi Klien Supabase (jika kredensial valid)
let supabase = null;
if (!isPlaceholder) {
  try {
    supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
  } catch (initError) {
    console.error("Gagal menginisialisasi Supabase:", initError);
  }
}

// Koleksi Icon SVG Kustom (Ringan & Kompatibel)
const Icons = {
  Users: () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
    </svg>
  ),
  User: () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
    </svg>
  ),
  Database: () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4" />
    </svg>
  ),
  Volume: () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
    </svg>
  ),
  Camera: () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
  ),
  Trash: () => (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-4v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
    </svg>
  ),
  ArrowRight: () => (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
    </svg>
  ),
  Info: () => (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ),
  Lock: () => (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
    </svg>
  ),
  Logout: () => (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
    </svg>
  )
};

export default function App() {
  const [activeTab, setActiveTab] = useState('structure'); // Navigasi Tab Utama
  const [selectedDiv, setSelectedDiv] = useState('all'); // Filter Divisi Terpilih
  const [alertMsg, setAlertMsg] = useState({ type: '', text: '' }); // Pesan Notifikasi

  // State Keamanan (Auth)
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [passwordInput, setPasswordInput] = useState('');
  const [authError, setAuthError] = useState('');
  const ADMIN_PASSWORD = "kkn10hebat"; // Password default akses admin

  // State Form Input Admin
  const [inputNama, setInputNama] = useState('');
  const [inputNim, setInputNim] = useState('');
  const [inputDivisi, setInputDivisi] = useState('pimpinan');
  const [inputPeran, setInputPeran] = useState('');

  // Database Anggota (Dinamis terhubung ke Supabase Cloud / Fallback Lokal)
  const [members, setMembers] = useState([]);
  // Best practice: Mulai state loading dengan nilai `true` untuk menghindari render berulang (cascading renders)
  const [isLoading, setIsLoading] = useState(true);

  // Master Data Konfigurasi Visual, Kuota, Tupoksi, dan Deliverables tiap Divisi
  const divMeta = {
    pimpinan: {
      title: "Pimpinan Inti (BPH)",
      max: 2,
      bg: "bg-indigo-950/40 border-indigo-900/60 text-indigo-300",
      icon: <Icons.User />,
      roles: [
        { name: "Ketua (1 Orang)", desc: "Penanggung jawab arah pergerakan tim, penentu kebijakan, & komunikator utama eksternal (Kades, DPL)." },
        { name: "Sekretaris-Bendahara (1 Orang)", desc: "Administrasi kelompok (proposal, surat izin) & pengatur anggaran biaya pra-KKN s/d pasca-KKN." }
      ],
      tupoksi: [
        "Mengoordinasi 3 divisi taktis agar berjalan sesuai rencana (timeline).",
        "Menjaga kesolidan internal tim dan menengahi jika ada konflik.",
        "Menyusun rincian anggaran biaya (RAB) KKN secara transparan serta laporan administratif kampus."
      ],
      deliverables: ["Surat Izin Survei Resmi", "Rencana Anggaran Biaya (RAB) KKN", "Draf Proposal Kegiatan"]
    },
    litbang: {
      title: "Divisi Litbang & Data",
      max: 3,
      bg: "bg-emerald-950/40 border-emerald-900/60 text-emerald-300",
      icon: <Icons.Database />,
      roles: [
        { name: "Peneliti Lapangan (3 Orang)", desc: "Penyusun metode pencarian data lapangan, perancang lembar wawancara, dan pengolah data identifikasi masalah." }
      ],
      tupoksi: [
        "Melakukan studi literatur/desk-research tentang profil desa sebelum terjun ke lokasi.",
        "Menyusun kuesioner & pedoman wawancara terfokus untuk warga desa setempat.",
        "Mengolah, mengelompokkan, dan merumuskan hasil temuan survei menjadi data masalah prioritas desa."
      ],
      deliverables: ["Instrumen/Panduan Wawancara", "Monografi Data Profil Desa", "Peta Analisis Masalah Warga"]
    },
    humas: {
      title: "Divisi Humas & Hubungan Lembaga",
      max: 3,
      bg: "bg-amber-950/40 border-amber-900/60 text-amber-300",
      icon: <Icons.Volume />,
      roles: [
        { name: "Liaison Officer (3 Orang)", desc: "Penghubung komunikasi kelompok dengan perangkat desa dan instansi lokal, serta penjaga etika relasi warga." }
      ],
      tupoksi: [
        "Membangun komunikasi dan meminta izin survei ke Kepala Desa, RT/RW, PKK, & Karang Taruna.",
        "Mengatur jadwal audiensi formal kelompok dan memetakan plot lokasi survei anggota.",
        "Mengingatkan seluruh anggota tim terkait norma kesopanan dan budaya lokal desa setempat."
      ],
      deliverables: ["Daftar Kontak Kunci (Stakeholder) Desa", "Izin Akses Lokasi Wawancara", "Jadwal Logistik Pertemuan"]
    },
    medok: {
      title: "Divisi Media & Dokumentasi",
      max: 2,
      bg: "bg-rose-950/40 border-rose-900/60 text-rose-300",
      icon: <Icons.Camera />,
      roles: [
        { name: "Content Specialist (2 Orang)", desc: "Kreator konten digital kelompok, fotografer lapangan, serta penanggung jawab penuh Instagram resmi." }
      ],
      tupoksi: [
        "Membuat, mendesain tampilan, dan mengaktifkan akun Instagram resmi kelompok sejak pra-KKN.",
        "Mengambil foto/video dokumentasi bernilai estetis tinggi selama survei dan masa KKN.",
        "Mendesain infografis peta masalah atau poster edukatif kelompok untuk keperluan pelaporan."
      ],
      deliverables: ["Feed & Reels Instagram Aktif", "Penyimpanan (Drive) Dokumentasi KKN", "Aset Desain Laporan Akhir"]
    }
  };

  // Matriks Relasi Kerja Sama Antar-Divisi
  const relationshipMatrix = [
    {
      from: "Pimpinan Inti (BPH)",
      color: "border-l-indigo-500",
      relations: [
        { to: "Litbang", desc: "Menerima hasil analisis masalah desa untuk diputuskan program kerja yang paling cocok." },
        { to: "Humas", desc: "Memberi instruksi lobi eksternal dan menerima laporan hasil perizinan dari aparat desa." },
        { to: "Medok", desc: "Memberikan rilis informasi resmi kelompok dan mengontrol konsistensi publikasi Instagram." }
      ]
    },
    {
      from: "Litbang & Data",
      color: "border-l-emerald-500",
      relations: [
        { to: "Pimpinan Inti (BPH)", desc: "Melaporkan peta masalah terverifikasi sebagai bahan pertimbangan rapat penentuan program." },
        { to: "Humas", desc: "Berkoordinasi untuk menentukan siapa tokoh desa yang paling relevan diwawancarai sesuai kebutuhan data." },
        { to: "Medok", desc: "Menyalurkan data statistik/fakta desa untuk diolah menjadi desain infografis edukasi di Instagram." }
      ]
    },
    {
      from: "Humas & Lembaga",
      color: "border-l-amber-500",
      relations: [
        { to: "Pimpinan Inti (BPH)", desc: "Melaporkan progres perizinan desa dan mendampingi pimpinan saat audiensi formal." },
        { to: "Litbang", desc: "Membuka akses ke tokoh kunci (Kades, PKK, Pemuda) agar proses pengambilan data wawancara berjalan lancar." },
        { to: "Medok", desc: "Mengoordinasikan etika dokumentasi lapangan (meminta izin warga sebelum diambil gambarnya oleh Medok)." }
      ]
    },
    {
      from: "Media & Dokumentasi (Medok)",
      color: "border-l-rose-500",
      relations: [
        { to: "Pimpinan Inti (BPH)", desc: "Mendapatkan persetujuan (approval) konten publikasi sebelum diunggah di Instagram resmi." },
        { to: "Litbang", desc: "Mendapatkan narasi, rincian data masalah, dan statistik desa untuk diolah menjadi postingan visual bermanfaat." },
        { to: "Humas", desc: "Berkoordinasi saat mengambil dokumentasi warga agar tetap menjaga privasi warga lokal." }
      ]
    }
  ];

  // Simulasi Alur Pergerakan Tim Saat Survei
  const timelineSteps = [
    {
      stage: "Tahap 1: Persiapan Internal (Pra-Survei)",
      desc: "Sebelum menginjakkan kaki di desa, tim mempersiapkan landasan teoritis & administratif.",
      acts: [
        { div: "Pimpinan", act: "Menyusun draf surat perizinan kampus dan menghitung dana operasional bensin & konsumsi survei." },
        { div: "Litbang", act: "Mencari profil desa di internet (desk research) dan menyusun 15 daftar pertanyaan inti masalah." },
        { div: "Humas", act: "Melakukan kontak awal via telepon dengan pihak kecamatan/desa untuk membuat janji temu perdana." },
        { div: "Medok", act: "Membuat akun IG, mendesain logo kelompok, dan mengunggah poster 'Coming Soon / Perkenalan Tim'." }
      ]
    },
    {
      stage: "Tahap 2: Eksekusi Lapangan (Hari-H Survei)",
      desc: "Semua 10 anggota bergerak ke desa dengan tugas lapangan yang sangat terarah.",
      acts: [
        { div: "Pimpinan & Humas", act: "Masuk ke kantor balai desa untuk sowan resmi, menyerahkan surat izin, dan audiensi dengan Pak Kades." },
        { div: "Litbang & Anggota", act: "Menyebar berpasangan (misal 5 tim @2 orang) untuk mewawancarai sasaran berbeda: Ketua RT, Karang Taruna, Ibu PKK, Warung Warga." },
        { div: "Medok", act: "Mengambil footage estetik, mendokumentasikan kegiatan wawancara, dan membuat story update 'Real-time Kegiatan KKN'." }
      ]
    },
    {
      stage: "Tahap 3: Pasca-Survei (Evaluasi & Perumusan)",
      desc: "Mengolah temuan di lapangan menjadi rencana aksi nyata.",
      acts: [
        { div: "Litbang", act: "Memimpin rapat internal untuk memaparkan seluruh rekaman wawancara dan menyortir masalah prioritas desa." },
        { div: "Pimpinan", act: "Menetapkan 1 atau 2 program kerja KKN berdasarkan masalah teratas yang dilaporkan oleh Litbang." },
        { div: "Medok", act: "Mendesain infografis 'Mengenal Lebih Dekat Desa X' dan merilis ringkasan visual hasil survei ke Instagram." },
        { div: "Humas", act: "Mengonfirmasi ulang ke pihak desa bahwa kita siap kembali di hari H pengabdian dengan program yang disetujui." }
      ]
    }
  ];

  // Helper: Hitung Jumlah Anggota per Divisi
  const getCount = (divKey) => members.filter(m => m.division === divKey).length;

  // 1. Ambil Data Awal dari Supabase (atau fallback ke memori jika kunci masih placeholder)
  const fetchMembers = async () => {
    if (isPlaceholder || !supabase) {
      // Fallback data lokal agar pratinjau tetap fungsional & interaktif
      setTimeout(() => {
        const localData = JSON.parse(localStorage.getItem('kkn_members_fallback')) || [
          { id: 1, name: "Moh. Raffi Alfatih", nim: "20240040066", division: "pimpinan", role: "Ketua Kelompok" }
        ];
        setMembers(localData);
        setIsLoading(false);
      }, 500);
      return;
    }

    try {
      const { data, error } = await supabase
        .from('members')
        .select('*')
        .order('id', { ascending: true });

      if (error) {
        setAlertMsg({ type: 'error', text: 'Gagal memuat data dari Supabase: ' + error.message });
      } else {
        setMembers(data || []);
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Terjadi kesalahan koneksi ke Supabase.';
      setAlertMsg({ type: 'error', text: errorMessage });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchMembers();

    if (isPlaceholder || !supabase) return;

    // 2. AKTIFKAN FITUR REAL-TIME (LISTEN) JIKA KUNCI SUDAH TERPASANG
    const channel = supabase
      .channel('realtime_members_changes')
      .on(
        'postgres_changes',
        { event: '*', scheme: 'public', table: 'members' },
        () => {
          fetchMembers();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  // Handler: Proses Login Admin
  const handleLogin = (e) => {
    e.preventDefault();
    if (passwordInput === ADMIN_PASSWORD) {
      setIsLoggedIn(true);
      setAuthError('');
      setPasswordInput('');
      setAlertMsg({ type: 'success', text: 'Login berhasil! Akses Admin Panel dibuka.' });
    } else {
      setAuthError('Password salah! Cek kembali password admin kelompok.');
    }
  };

  // Handler: Proses Logout Admin
  const handleLogout = () => {
    setIsLoggedIn(false);
    setAlertMsg({ type: 'success', text: 'Sesi admin ditutup. Panel terkunci kembali.' });
  };

  // Handler: Menambah Anggota Baru (Insert)
  const handleAddMember = async (e) => {
    e.preventDefault();
    if (!inputNama.trim() || !inputNim.trim() || !inputPeran.trim()) {
      setAlertMsg({ type: 'error', text: 'Gagal! Semua kolom input wajib diisi secara lengkap.' });
      return;
    }

    if (getCount(inputDivisi) >= divMeta[inputDivisi].max) {
      setAlertMsg({
        type: 'error',
        text: `Gagal! Kuota maksimal ${divMeta[inputDivisi].title} adalah ${divMeta[inputDivisi].max} orang dan sudah penuh.`
      });
      return;
    }

    // Jika masih mode pratinjau/placeholder, gunakan penyimpanan lokal
    if (isPlaceholder || !supabase) {
      const newMember = {
        id: Date.now(),
        name: inputNama,
        nim: inputNim,
        division: inputDivisi,
        role: inputPeran
      };
      const updated = [...members, newMember];
      setMembers(updated);
      localStorage.setItem('kkn_members_fallback', JSON.stringify(updated));
      setInputNama('');
      setInputNim('');
      setInputPeran('');
      setAlertMsg({ type: 'success', text: `Berhasil! ${inputNama} ditambahkan (Mode Demo/Lokal).` });
      return;
    }

    // Jika sudah dihubungkan ke Supabase asli
    const { error } = await supabase
      .from('members')
      .insert([
        { 
          name: inputNama, 
          nim: inputNim, 
          division: inputDivisi, 
          role: inputPeran 
        }
      ]);

    if (error) {
      setAlertMsg({ type: 'error', text: 'Gagal menyimpan ke database: ' + error.message });
    } else {
      setInputNama('');
      setInputNim('');
      setInputPeran('');
      setAlertMsg({ type: 'success', text: `Berhasil! Data anggota terkirim ke Cloud Database.` });
    }
  };

  // Handler: Menghapus Anggota (Delete)
  const handleRemoveMember = async (id) => {
    if (isPlaceholder || !supabase) {
      const updated = members.filter(m => m.id !== id);
      setMembers(updated);
      localStorage.setItem('kkn_members_fallback', JSON.stringify(updated));
      setAlertMsg({ type: 'success', text: 'Anggota berhasil dihapus (Mode Demo/Lokal).' });
      return;
    }

    const { error } = await supabase
      .from('members')
      .delete()
      .eq('id', id);

    if (error) {
      setAlertMsg({ type: 'error', text: 'Gagal menghapus data di database: ' + error.message });
    } else {
      setAlertMsg({ type: 'success', text: 'Anggota berhasil dihapus dari Cloud Database.' });
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 font-sans p-4 md:p-8">
      {/* Banner Informasi Kunci Supabase */}
      {isPlaceholder && (
        <div className="max-w-6xl mx-auto mb-4 p-3 bg-amber-950/30 border border-amber-900/60 rounded-lg text-xs text-amber-300 flex items-center gap-2.5 animate-pulse">
          <span className="flex-shrink-0 bg-amber-900/50 p-1 rounded"><Icons.Info /></span>
          <span>
            <strong>Mode Demo Aktif:</strong> Anda dapat mencoba fitur tambah/hapus anggota di pratinjau ini. Untuk menghubungkannya secara permanen ke tim, masukkan <code>SUPABASE_URL</code> dan <code>SUPABASE_ANON_KEY</code> Anda di baris 5-6 berkas <code>App.jsx</code>.
          </span>
        </div>
      )}

      {/* Header Utama */}
      <div className="max-w-6xl mx-auto mb-8 text-center md:text-left md:flex justify-between items-center border-b border-slate-800 pb-6">
        <div>
          <span className="bg-indigo-500/10 text-indigo-400 text-xs font-semibold px-3 py-1 rounded-full uppercase tracking-wider">
            Sistem KKN Real-time ({members.length}/10 Anggota)
          </span>
          <h1 className="text-3xl font-extrabold text-white mt-2">Misi KKN: Identifikasi Masalah Desa</h1>
          <p className="text-slate-400 mt-1">Sistem pembagian tugas taktis, hubungan relasi, dan alur pergerakan tim berbasis Supabase</p>
        </div>
        
        {/* Navigasi Tab */}
        <div className="mt-4 md:mt-0 flex flex-wrap justify-center bg-slate-800 rounded-lg p-1 gap-1 self-center">
          <button
            onClick={() => { setActiveTab('structure'); setSelectedDiv('all'); }}
            className={`px-3.5 py-2 text-xs md:text-sm font-medium rounded-md transition-all ${activeTab === 'structure' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-slate-200'}`}
          >
            Peta Struktur & Tupoksi
          </button>
          <button
            onClick={() => setActiveTab('matrix')}
            className={`px-3.5 py-2 text-xs md:text-sm font-medium rounded-md transition-all ${activeTab === 'matrix' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-slate-200'}`}
          >
            Matriks Kerja Sama
          </button>
          <button
            onClick={() => setActiveTab('timeline')}
            className={`px-3.5 py-2 text-xs md:text-sm font-medium rounded-md transition-all ${activeTab === 'timeline' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-slate-200'}`}
          >
            Alur Survei
          </button>
          <button
            onClick={() => setActiveTab('admin')}
            className={`px-3.5 py-2 text-xs md:text-sm font-medium rounded-md transition-all ${activeTab === 'admin' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-slate-200'}`}
          >
            ⚙️ Admin Panel {isLoggedIn && '🔓'}
          </button>
        </div>
      </div>

      <div className="max-w-6xl mx-auto">
        {/* Notifikasi Alert */}
        {alertMsg.text && (
          <div className={`mb-6 p-4 rounded-lg text-sm flex justify-between items-center ${alertMsg.type === 'error' ? 'bg-rose-950/50 border border-rose-900 text-rose-300' : 'bg-emerald-950/50 border border-emerald-900 text-emerald-300'}`}>
            <span>{alertMsg.text}</span>
            <button onClick={() => setAlertMsg({ type: '', text: '' })} className="font-bold hover:opacity-70 text-lg leading-none">×</button>
          </div>
        )}

        {/* LOADING SCREEN JIKA DATA SEDANG DIAMBIL */}
        {isLoading && (
          <div className="text-center py-16 animate-pulse">
            <div className="w-10 h-10 border-4 border-indigo-500 border-t-transparent rounded-full mx-auto animate-spin mb-4"></div>
            <p className="text-xs text-slate-400">Sinkronisasi data ke Supabase Cloud...</p>
          </div>
        )}

        {/* TAB 1: PETA STRUKTUR & DETAIL TUPOKSI */}
        {!isLoading && activeTab === 'structure' && (
          <div className="space-y-6">
            <div className="bg-slate-800/40 p-4 rounded-xl border border-slate-800 flex items-start gap-3">
              <div className="text-indigo-400 mt-0.5"><Icons.Info /></div>
              <p className="text-xs text-slate-300 leading-relaxed">
                <strong>Panduan Pengguna:</strong> Klik salah satu kartu divisi di bawah ini untuk melihat daftar personil aktif secara live, detail <strong>Tupoksi Utama</strong>, serta target <strong>Output Nyata (Deliverables)</strong> di panel detail bagian bawah.
              </p>
            </div>

            {/* Grid Kartu Divisi */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
              {Object.entries(divMeta).map(([key, meta]) => {
                const isSelected = selectedDiv === key || selectedDiv === 'all';
                const currentCount = getCount(key);
                return (
                  <div
                    key={key}
                    onClick={() => setSelectedDiv(selectedDiv === key ? 'all' : key)}
                    className={`cursor-pointer rounded-xl border p-5 transition-all duration-300 transform hover:-translate-y-1 ${meta.bg} ${isSelected ? 'opacity-100 scale-100 ring-2 ring-indigo-500 shadow-lg' : 'opacity-30 scale-95'}`}
                  >
                    <div className="flex justify-between items-center mb-4">
                      <div className="p-2.5 rounded-lg bg-slate-900 text-white">{meta.icon}</div>
                      <span className={`text-xs font-semibold px-2.5 py-1 rounded-md ${currentCount === meta.max ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-slate-900'}`}>
                        {currentCount} / {meta.max} Orang
                      </span>
                    </div>
                    <h3 className="text-lg font-bold text-white mb-2">{meta.title}</h3>
                    <p className="text-[11px] text-slate-400">Klik untuk membedah tugas & luaran.</p>
                  </div>
                );
              })}
            </div>

            {/* Panel Detail Terintegrasi (Dinamis + Statis) */}
            <div className="bg-slate-800/70 rounded-xl border border-slate-700/80 p-6 shadow-2xl">
              {selectedDiv === 'all' ? (
                <div className="text-center py-12">
                  <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-slate-800 flex items-center justify-center text-slate-400">
                    <Icons.Users />
                  </div>
                  <h3 className="text-lg font-bold text-white mb-1">Silakan Pilih Divisi Di Atas</h3>
                  <p className="text-slate-400 max-w-md mx-auto text-xs">
                    Klik salah satu kartu divisi untuk melihat daftar personil aktif yang mengisi slot divisi tersebut secara real-time, rincian tupoksi kerja, serta deliverables dokumennya.
                  </p>
                </div>
              ) : (
                <div>
                  {/* Judul Detail */}
                  <div className="flex items-center justify-between border-b border-slate-700/70 pb-4 mb-6">
                    <div className="flex items-center gap-3">
                      <span className="p-2 rounded-lg bg-indigo-600/20 text-indigo-400">
                        {divMeta[selectedDiv].icon}
                      </span>
                      <div>
                        <h2 className="text-xl font-bold text-white">{divMeta[selectedDiv].title}</h2>
                        <p className="text-xs text-slate-400">Alokasi Anggota Aktif: {getCount(selectedDiv)} / {divMeta[selectedDiv].max} Slot Terisi</p>
                      </div>
                    </div>
                    <button
                      onClick={() => setSelectedDiv('all')}
                      className="text-xs text-indigo-400 hover:text-indigo-300 font-semibold"
                    >
                      Tampilkan Semua Divisi
                    </button>
                  </div>

                  {/* 3 Kolom Utama Detail */}
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Kolom 1: Personil Aktif (Dinamis dari Supabase) */}
                    <div className="bg-slate-900/60 p-4 rounded-lg border border-slate-800">
                      <h4 className="text-xs font-bold text-indigo-400 uppercase tracking-wider mb-3 flex items-center gap-2">
                        <span>👥 Personil Aktif</span>
                        <span className={`w-2 h-2 rounded-full ${isPlaceholder ? 'bg-amber-500 animate-pulse' : 'bg-emerald-500 animate-pulse'}`} title={isPlaceholder ? "Mode Demo/Lokal" : "Koneksi Cloud Aktif"}></span>
                      </h4>
                      <div className="space-y-3">
                        {members.filter(m => m.division === selectedDiv).length === 0 ? (
                          <div className="text-center py-6 text-slate-500 italic text-xs">
                            Belum ada nama yang didaftarkan. Masuk ke Admin Panel di kanan atas untuk mengisi anggota.
                          </div>
                        ) : (
                          members.filter(m => m.division === selectedDiv).map(m => (
                            <div key={m.id} className="bg-slate-800/80 p-3 rounded-lg border border-slate-700/60">
                              <p className="text-sm font-bold text-white">{m.name}</p>
                              <div className="flex justify-between items-center text-xs text-slate-400 mt-1">
                                <span>NIM: {m.nim}</span>
                                <span className="bg-indigo-950 text-indigo-300 px-2 py-0.5 rounded text-[10px] font-semibold border border-indigo-900/40">
                                  {m.role}
                                </span>
                              </div>
                            </div>
                          ))
                        )}
                      </div>
                    </div>

                    {/* Kolom 2: Tupoksi Utama (Statis) */}
                    <div className="bg-slate-900/60 p-4 rounded-lg border border-slate-800">
                      <h4 className="text-xs font-bold text-emerald-400 uppercase tracking-wider mb-3">📋 Tugas Pokok (Tupoksi)</h4>
                      <ul className="space-y-3 text-xs text-slate-300 leading-relaxed">
                        {divMeta[selectedDiv].tupoksi.map((task, idx) => (
                          <li key={idx} className="flex gap-2.5">
                            <span className="text-emerald-400 font-bold">•</span>
                            <span>{task}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Kolom 3: Output Nyata / Deliverables (Statis) */}
                    <div className="bg-slate-900/60 p-4 rounded-lg border border-slate-800">
                      <h4 className="text-xs font-bold text-rose-400 uppercase tracking-wider mb-3">📦 Output Nyata (Deliverables)</h4>
                      <div className="space-y-2">
                        {divMeta[selectedDiv].deliverables.map((deliv, idx) => (
                          <div key={idx} className="flex items-center gap-2.5 bg-slate-800/50 p-3 rounded-lg border border-slate-800 text-xs">
                            <span className="w-2 h-2 rounded-full bg-rose-500"></span>
                            <span className="text-slate-200 font-semibold">{deliv}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 2: MATRIKS KERJA SAMA */}
        {activeTab === 'matrix' && (
          <div className="space-y-6">
            <div className="bg-slate-800/40 p-4 rounded-xl border border-slate-800">
              <h2 className="text-lg font-bold text-white mb-1">Hubungan Relasional Antar-Divisi</h2>
              <p className="text-xs text-slate-400 leading-relaxed">
                Di lapangan, 10 anggota tidak boleh bekerja terisolasi. Berikut adalah panduan kolaborasi timbal-balik agar tidak terjadi tumpang tindih (overlap) tugas.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {relationshipMatrix.map((item, idx) => (
                <div key={idx} className={`bg-slate-800/60 rounded-xl p-5 border border-slate-700/50 border-l-4 ${item.color}`}>
                  <h3 className="text-md font-bold text-white mb-4 flex items-center gap-2">
                    <span className="bg-slate-700 p-1 rounded text-slate-200"><Icons.Users /></span>
                    Hubungan Timbal-Balik <span className="text-indigo-400 font-extrabold">{item.from}</span> :
                  </h3>
                  <div className="space-y-4">
                    {item.relations.map((rel, rIdx) => (
                      <div key={rIdx} className="bg-slate-900/40 p-3 rounded-lg border border-slate-850 text-xs">
                        <div className="flex items-center gap-1.5 mb-2">
                          <span className="font-bold text-slate-300">{item.from}</span>
                          <span className="text-indigo-400"><Icons.ArrowRight /></span>
                          <span className="font-bold text-indigo-300">Divisi {rel.to}</span>
                        </div>
                        <p className="text-slate-400 leading-relaxed">{rel.desc}</p>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 3: SIMULASI ALUR SURVEI */}
        {activeTab === 'timeline' && (
          <div className="space-y-6">
            <div className="bg-slate-800/40 p-4 rounded-xl border border-slate-800">
              <h2 className="text-lg font-bold text-white mb-1">Simulasi Pergerakan Anggota Saat Survei</h2>
              <p className="text-xs text-slate-400">
                Alur logis bagaimana seluruh divisi bahu-membahu dari tahap persiapan hingga penyortiran data masalah selesai.
              </p>
            </div>

            <div className="space-y-8 relative before:absolute before:inset-0 before:left-4 md:before:left-1/2 before:w-0.5 before:bg-slate-800">
              {timelineSteps.map((step, idx) => (
                <div key={idx} className="relative flex flex-col md:flex-row md:justify-between items-start md:items-center">
                  {/* Pointer Timeline */}
                  <div className="absolute left-4 md:left-1/2 transform -translate-x-1/2 w-8 h-8 rounded-full bg-indigo-600 border-4 border-slate-900 flex items-center justify-center text-xs font-bold text-white z-10">
                    {idx + 1}
                  </div>

                  <div className={`w-full md:w-[45%] pl-10 md:pl-0 ${idx % 2 === 0 ? 'md:text-right' : 'md:order-2'}`}>
                    <h3 className="text-lg font-bold text-indigo-400 mb-1">{step.stage}</h3>
                    <p className="text-xs text-slate-400 leading-relaxed">{step.desc}</p>
                  </div>

                  <div className={`w-full md:w-[45%] mt-4 md:mt-0 pl-10 md:pl-0 ${idx % 2 === 0 ? 'md:order-2' : ''}`}>
                    <div className="bg-slate-800/80 p-4 rounded-xl border border-slate-700/80 space-y-3">
                      {step.acts.map((act, aIdx) => (
                        <div key={aIdx} className="text-xs border-b border-slate-700/40 pb-2.5 last:border-0 last:pb-0">
                          <span className="font-bold text-slate-200 block mb-1">🎬 Peran {act.div}</span>
                          <p className="text-slate-400 leading-relaxed">{act.act}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 4: ADMIN PANEL DENGAN CO-AUTH & SINKRONISASI DATABASE */}
        {!isLoading && activeTab === 'admin' && (
          <div>
            {!isLoggedIn ? (
              /* SCREEN 1: FORM LOGIN ADMIN (TERKUNCI) */
              <div className="max-w-md mx-auto bg-slate-800 rounded-2xl border border-slate-700 p-8 shadow-2xl mt-12 text-center">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-indigo-500/10 text-indigo-400 flex items-center justify-center">
                  <Icons.Lock />
                </div>
                <h2 className="text-xl font-bold text-white mb-2">Admin Authentication</h2>
                <p className="text-xs text-slate-400 mb-6">Masukkan kata sandi kelompok untuk mengedit database anggota KKN secara live.</p>
                
                <form onSubmit={handleLogin} className="space-y-4">
                  <div>
                    <input
                      type="password"
                      value={passwordInput}
                      onChange={(e) => setPasswordInput(e.target.value)}
                      placeholder="Masukkan Password Kelompok"
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-3 text-sm text-white text-center focus:outline-none focus:border-indigo-500 placeholder-slate-500 font-sans tracking-wide"
                      autoFocus
                    />
                    {authError && <p className="text-xs text-rose-400 mt-2 text-left font-medium">⚠️ {authError}</p>}
                  </div>
                  <button
                    type="submit"
                    className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-semibold py-2.5 rounded-lg text-sm transition-all shadow-md cursor-pointer"
                  >
                    Buka Akses Panel
                  </button>
                </form>

                <div className="mt-6 border-t border-slate-700/60 pt-4 text-left">
                  <p className="text-[10px] text-slate-500 italic text-center">
                    💡 Petunjuk Testing: Password-nya adalah <strong className="text-slate-400 font-semibold">kkn10hebat</strong>
                  </p>
                </div>
              </div>
            ) : (
              /* SCREEN 2: ADMIN PANEL YANG SUDAH TERBUKA */
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Kolom Kiri: Form Input */}
                <div className="bg-slate-800/80 p-6 rounded-xl border border-slate-700 shadow-xl h-fit">
                  <div className="flex justify-between items-center mb-4 border-b border-slate-700/60 pb-3">
                    <h2 className="text-lg font-bold text-white">📝 Tambah Anggota KKN</h2>
                    <button
                      onClick={handleLogout}
                      className="flex items-center gap-1.5 text-xs text-rose-400 hover:text-rose-300 font-semibold bg-rose-950/30 hover:bg-rose-950/60 border border-rose-900/40 px-2.5 py-1 rounded cursor-pointer transition-all"
                      title="Kunci Kembali Admin Panel"
                    >
                      <Icons.Logout />
                      <span>Lock</span>
                    </button>
                  </div>

                  <form onSubmit={handleAddMember} className="space-y-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-400 mb-1">Nama Lengkap</label>
                      <input
                        type="text"
                        value={inputNama}
                        onChange={(e) => setInputNama(e.target.value)}
                        placeholder="Contoh: Luki Artur"
                        className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2.5 text-sm text-white focus:outline-none focus:border-indigo-500"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-400 mb-1">NIM (Nomor Induk Mahasiswa)</label>
                      <input
                        type="text"
                        value={inputNim}
                        onChange={(e) => setInputNim(e.target.value)}
                        placeholder="Contoh: 20240040XXX"
                        className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2.5 text-sm text-white focus:outline-none focus:border-indigo-500"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-400 mb-1">Pilih Penempatan Divisi</label>
                      <select
                        value={inputDivisi}
                        onChange={(e) => setInputDivisi(e.target.value)}
                        className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2.5 text-sm text-white focus:outline-none focus:border-indigo-500 cursor-pointer"
                      >
                        <option value="pimpinan">Pimpinan Inti (Maks 2)</option>
                        <option value="litbang">Divisi Litbang & Data (Maks 3)</option>
                        <option value="humas">Divisi Humas & Lembaga (Maks 3)</option>
                        <option value="medok">Divisi Media & Dokumentasi (Maks 2)</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-400 mb-1">Peran Spesifik / Jobdesk</label>
                      <input
                        type="text"
                        value={inputPeran}
                        onChange={(e) => setInputPeran(e.target.value)}
                        placeholder="Contoh: Peneliti Sektor UMKM / Bendahara"
                        className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2.5 text-sm text-white focus:outline-none focus:border-indigo-500"
                      />
                    </div>

                    <button
                      type="submit"
                      className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-semibold py-2.5 px-4 rounded-lg text-sm transition-all shadow-md cursor-pointer"
                    >
                      {isPlaceholder ? "➕ Masukkan ke Struktur (Lokal)" : "➕ Kirim ke Cloud Supabase"}
                    </button>
                  </form>
                </div>

                {/* Kolom Kanan: Daftar Anggota Terdaftar */}
                <div className="lg:col-span-2 bg-slate-800/40 p-6 rounded-xl border border-slate-800">
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="text-lg font-bold text-white">Daftar Anggota ({isPlaceholder ? "Mode Demo" : "Database Cloud"}) ({members.length} / 10)</h2>
                    <span className="text-xs text-emerald-400 font-semibold flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping"></span>
                      {isPlaceholder ? "Demo Standalone Active" : "Real-time Database Active"}
                    </span>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs text-slate-300">
                      <thead className="bg-slate-900 text-slate-400 uppercase text-[10px] tracking-wider border-b border-slate-800">
                        <tr>
                          <th className="p-3">Nama & NIM</th>
                          <th className="p-3">Divisi KKN</th>
                          <th className="p-3">Jobdesk</th>
                          <th className="p-3 text-center">Aksi</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-800">
                        {members.map((m) => (
                          <tr key={m.id} className="hover:bg-slate-800/50 transition-colors">
                            <td className="p-3">
                              <p className="font-bold text-white">{m.name}</p>
                              <p className="text-[10px] text-slate-500">NIM. {m.nim}</p>
                            </td>
                            <td className="p-3">
                              <span className="px-2 py-0.5 bg-slate-900 rounded text-[10px] font-semibold text-indigo-400 border border-slate-800">
                                {divMeta[m.division].title}
                              </span>
                            </td>
                            <td className="p-3 text-slate-400 font-medium">{m.role}</td>
                            <td className="p-3 text-center">
                              <button
                                onClick={() => handleRemoveMember(m.id)}
                                className="p-1.5 bg-rose-950/40 hover:bg-rose-900/60 border border-rose-900/50 text-rose-400 rounded transition-all cursor-pointer"
                                title="Hapus anggota"
                              >
                                <Icons.Trash />
                              </button>
                            </td>
                          </tr>
                        ))}
                        {members.length === 0 && (
                          <tr>
                            <td colSpan="4" className="text-center py-8 text-slate-500 italic">
                              Struktur kosong, silakan input anggota baru.
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}