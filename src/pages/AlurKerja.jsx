export default function AlurKerja() {
  return (
    <div className="space-y-6 animate-fadeIn">
      <div className="border-b border-slate-800 pb-4">
        <h2 className="text-2xl font-bold text-white">
          Alur Pelaksanaan Survei Kelompok (Gelombang 1)
        </h2>
        <p className="text-sm text-slate-400">
          Langkah-langkah strategis tim dari fase persiapan administratif hingga
          perumusan masalah pasca survei desa.
        </p>
      </div>

      <div className="space-y-8 relative before:absolute before:inset-0 before:left-4 md:before:left-1/2 before:w-0.5 before:bg-slate-850">
        {/* TAHAP 1: PRE-SURVEI */}
        <div className="relative flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="absolute left-4 md:left-1/2 transform -translate-x-1/2 w-8 h-8 rounded-full bg-indigo-600 border-4 border-slate-950 flex items-center justify-center font-bold text-sm text-white z-10">
            1
          </div>
          <div className="w-full md:w-[45%] pl-10 md:pl-0 md:text-right space-y-2">
            <span className="inline-block text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
              Fase 1: Pre-Survei
            </span>
            <h3 className="font-bold text-white text-lg">
              Persiapan Administrasi & Draf Internal
            </h3>
            <p className="text-xs text-slate-400">
              Sebelum terjun ke lapangan, Sekretaris mengurus surat izin survei
              resmi dari kampus. Divisi Litbang menyusun kuesioner investigatif
              dan daftar 15 draf pertanyaan wawancara untuk aparat desa dan
              perwakilan warga.
            </p>
            <div className="bg-slate-900/60 p-3 rounded-xl border border-slate-800 inline-block text-left max-w-sm mt-2 md:ml-auto">
              <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-wider block mb-1">
                Checklist Persiapan:
              </span>
              <ul className="text-[11px] text-slate-300 space-y-1">
                <li className="flex items-center gap-1.5">
                  ✓ Surat pengantar izin survei kampus
                </li>
                <li className="flex items-center gap-1.5">
                  ✓ Draf instrumen wawancara Litbang
                </li>
                <li className="flex items-center gap-1.5">
                  ✓ Rapat koordinasi BPH & penentuan PJ Logistik
                </li>
              </ul>
            </div>
          </div>
          <div className="hidden md:block w-[45%]"></div>
        </div>

        {/* TAHAP 2: PRA-SURVEI */}
        <div className="relative flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="absolute left-4 md:left-1/2 transform -translate-x-1/2 w-8 h-8 rounded-full bg-rose-600 border-4 border-slate-950 flex items-center justify-center font-bold text-sm text-white z-10">
            2
          </div>
          <div className="hidden md:block w-[45%]"></div>
          <div className="w-full md:w-[45%] pl-10 md:pl-0 space-y-2">
            <span className="inline-block text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-rose-500/10 text-rose-400 border border-rose-500/20">
              Fase 2: Pra-Survei
            </span>
            <h3 className="font-bold text-white text-lg">
              Kontak Awal & Orientasi Wilayah
            </h3>
            <p className="text-xs text-slate-400">
              Divisi Humas menghubungi perangkat Desa KKN untuk menyelaraskan
              jadwal kunjungan awal kelompok. Tim melakukan orientasi rute
              jalan, memetakan koordinat balai desa di peta bersama, serta
              menentukan titik transit logistik yang aman di dekat lokasi desa.
            </p>
            <div className="bg-slate-900/60 p-3 rounded-xl border border-slate-800 inline-block text-left max-w-sm mt-2">
              <span className="text-[10px] font-bold text-rose-400 uppercase tracking-wider block mb-1">
                Checklist Persiapan:
              </span>
              <ul className="text-[11px] text-slate-300 space-y-1">
                <li className="flex items-center gap-1.5">
                  ✓ Konfirmasi waktu luang dari Kepala Desa
                </li>
                <li className="flex items-center gap-1.5">
                  ✓ Pemetaan rute tempuh & peta koordinat Google Maps
                </li>
                <li className="flex items-center gap-1.5">
                  ✓ Anggaran transportasi internal Bendahara
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* TAHAP 3: PELAKSANAAN SURVEI */}
        <div className="relative flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="absolute left-4 md:left-1/2 transform -translate-x-1/2 w-8 h-8 rounded-full bg-amber-600 border-4 border-slate-950 flex items-center justify-center font-bold text-sm text-white z-10">
            3
          </div>
          <div className="w-full md:w-[45%] pl-10 md:pl-0 md:text-right space-y-2">
            <span className="inline-block text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20">
              Fase 3: Pelaksanaan Survei
            </span>
            <h3 className="font-bold text-white text-lg">
              Investigasi & Pengumpulan Data Lapangan
            </h3>
            <p className="text-xs text-slate-400">
              Seluruh 10 anggota bergerak ke desa. Litbang memimpin wawancara
              mendalam dengan Kades serta menyebarkan kuesioner ke RT/RW. Divisi
              Medok mengambil dokumentasi visual foto/video mengenai kerusakan
              infrastruktur, sampah, atau potensi UMKM yang terbengkalai.
            </p>
            <div className="bg-slate-900/60 p-3 rounded-xl border border-slate-800 inline-block text-left max-w-sm mt-2 md:ml-auto">
              <span className="text-[10px] font-bold text-amber-400 uppercase tracking-wider block mb-1">
                Checklist Persiapan:
              </span>
              <ul className="text-[11px] text-slate-300 space-y-1">
                <li className="flex items-center gap-1.5">
                  ✓ Perlengkapan kuesioner cetak (hardcopy)
                </li>
                <li className="flex items-center gap-1.5">
                  ✓ Kamera/HP dengan baterai penuh (Medok)
                </li>
                <li className="flex items-center gap-1.5">
                  ✓ Atribut KKN (Almamater / ID Card kelompok)
                </li>
              </ul>
            </div>
          </div>
          <div className="hidden md:block w-[45%]"></div>
        </div>

        {/* TAHAP 4: PASCA SURVEI */}
        <div className="relative flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="absolute left-4 md:left-1/2 transform -translate-x-1/2 w-8 h-8 rounded-full bg-emerald-600 border-4 border-slate-950 flex items-center justify-center font-bold text-sm text-white z-10">
            4
          </div>
          <div className="hidden md:block w-[45%]"></div>
          <div className="w-full md:w-[45%] pl-10 md:pl-0 space-y-2">
            <span className="inline-block text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              Fase 4: Pasca-Survei
            </span>
            <h3 className="font-bold text-white text-lg">
              Input Repository & Perumusan Masalah
            </h3>
            <p className="text-xs text-slate-400">
              Tim berkumpul di sekretariat sementara untuk mengolah rekaman
              wawancara dan catatan lapangan. Setiap temuan masalah dirapikan
              dan langsung **diinputkan secara digital ke dalam Bank Masalah
              Desa** di web ini agar aman tersimpan dan bisa langsung dibaca
              secara teratur oleh Kelompok Riset.
            </p>
            <div className="bg-slate-900/60 p-3 rounded-xl border border-slate-800 inline-block text-left max-w-sm mt-2">
              <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider block mb-1">
                Checklist Persiapan:
              </span>
              <ul className="text-[11px] text-slate-300 space-y-1">
                <li className="flex items-center gap-1.5">
                  ✓ Rapat pleno pembacaan hasil temuan data
                </li>
                <li className="flex items-center gap-1.5">
                  ✓ Penginputan masalah di halaman "Bank Masalah"
                </li>
                <li className="flex items-center gap-1.5">
                  ✓ Penyerahan berkas draf laporan awal ke Google Drive
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
