import React, { useState } from "react";
import {
  Users,
  BookOpen,
  Layers,
  UserCheck,
  ChevronRight,
  Calendar,
  Compass,
} from "lucide-react";

const divisions = {
  bph: {
    name: "Pimpinan Inti (BPH)",
    max: 3,
    description:
      "Bertanggung jawab atas administrasi keseluruhan kelompok, koordinasi eksternal, kontrol anggaran keuangan taktis, dan keputusan strategis tim.",
    jobdeskPra: [
      {
        role: "Ketua / System Architect",
        task: "Memimpin koordinasi internal, membagi porsi kerja seluruh divisi, menetapkan timeline, dan memantau kesiapan web database.",
      },
      {
        role: "Sekretaris / Pusat Data",
        task: "Mempersiapkan Surat Izin LPPM resmi, lembaran kuesioner fisik warga, serta mengonfigurasi struktur folder Google Drive.",
      },
      {
        role: "Bendahara / Manajer Anggaran",
        task: "Menyusun Rencana Anggaran Biaya (RAB) taktis operasional survei (dana print, bensin, konsumsi, dan kas kecil cash).",
      },
    ],
    jobdeskHariH: [
      {
        role: "Ketua / System Architect",
        task: "Memimpin delegasi masuk ke Balai Desa, menyapa formal, memaparkan maksud kedatangan, dan memimpin wawancara kualitatif.",
      },
      {
        role: "Sekretaris / Pusat Data",
        task: "Mencatat notulensi lengkap wawancara, merekam suara (dengan izin), memindahkan profil Monografi Desa, dan merekap kontak penting.",
      },
      {
        role: "Bendahara / Manajer Anggaran",
        task: "Mengelola pengeluaran taktis operasional lapangan secara langsung dan mengarsipkan seluruh bukti nota pembayaran.",
      },
    ],
  },
  litbang: {
    name: "Divisi Litbang & Data",
    max: 3,
    description:
      "Fokus riset masalah struktural desa, merancang instrumen pertanyaan, validasi survei lapangan, dan pemetaan koordinat fisik masalah.",
    jobdeskPra: [
      {
        role: "Koordinator Riset",
        task: "Menyusun draf final 15 pertanyaan wawancara tokoh kunci desa dan menyortir draf kuesioner warga.",
      },
      {
        role: "Pj Kuesioner Warga",
        task: "Memastikan lembaran kuesioner tercetak rapi dan mempersiapkan papan klip (clipboard) beserta pulpen untuk tim lapangan.",
      },
      {
        role: "Analis Spasial",
        task: "Melakukan studi literatur (desk research) awal profil wilayah desa via internet sebelum keberangkatan.",
      },
    ],
    jobdeskHariH: [
      {
        role: "Pj Kuesioner Warga",
        task: "Menyebar door-to-door ke rumah warga untuk menyebar instrumen kuesioner (target sampling minimal 20-30 KK).",
      },
      {
        role: "Analis Spasial",
        task: "Melakukan observasi kelayakan jalan, irigasi, dan sanitasi sampah desa, lalu drop pin titik koordinat masalah di Maps.",
      },
      {
        role: "Pj Bank Masalah",
        task: 'Menginputkan temuan masalah infrastruktur fisik langsung ke sistem web database "Bank Masalah Desa" lewat HP.',
      },
    ],
  },
  humas: {
    name: "Divisi Humas & Hubungan Lembaga",
    max: 2,
    description:
      "Penghubung komunikasi eksternal instansi desa, penanggung jawab perizinan birokrasi, pemandu rute logistik, dan pengawal etika tim.",
    jobdeskPra: [
      {
        role: "Hubungan Lembaga",
        task: "Menghubungi aparat desa (Sekdes/Kaur Umum) via telepon untuk konfirmasi kecocokan hari dan jam kunjungan formal.",
      },
      {
        role: "Humas Lapangan",
        task: "Memetakan rute jalan menuju desa target, memperkirakan waktu tempuh, dan membagikan titik transit aman ke grup tim.",
      },
    ],
    jobdeskHariH: [
      {
        role: "Hubungan Lembaga",
        task: "Mendampingi BPH masuk ke Balai Desa, memandu pengisian buku tamu, dan memastikan dokumen LPPM berstempel terima.",
      },
      {
        role: "Humas Lapangan",
        task: "Menghubungi ketua RT/RW setempat terlebih dahulu untuk meminta izin sopan sebelum Tim Kuesioner door-to-door.",
      },
    ],
  },
  medok: {
    name: "Divisi Media & Dokumentasi (Medok)",
    max: 2,
    description:
      "Pengambil dokumentasi administratif formal laporan, dokumentor investigatif objek masalah desa, dan pengelola konten digital Instagram.",
    jobdeskPra: [
      {
        role: "Desainer Grafis",
        task: "Menentukan palet warna tema (Sage Green & Navy) dan merancang template layout feed/story Instagram kelompok.",
      },
      {
        role: "Fotografer Lapangan",
        task: "Menyiapkan kamera, lensa, memori cadangan kosong, serta memastikan daya powerbank terisi penuh.",
      },
    ],
    jobdeskHariH: [
      {
        role: "Fotografer Lapangan",
        task: "Mengambil foto formal berkualitas tinggi saat penyerahan dokumen perizinan di Balai Desa untuk lampiran laporan.",
      },
      {
        role: "Dokumentor Investigasi",
        task: "Memotret bukti kerusakan fisik (jalan berlubang, sampah) untuk lampiran data valid di sistem database.",
      },
      {
        role: "Videografer Kreatif",
        task: "Merekam video interaksi humanis (format vertikal 9:16) tim dengan warga sebagai materi reels Instagram.",
      },
    ],
  },
};

export default function Struktur({ members }) {
  const [divisionSubTabs, setDivisionSubTabs] = useState({
    bph: "members",
    litbang: "members",
    humas: "members",
    medok: "members",
  });

  const handleSetSubTab = (divisionKey, tabName) => {
    setDivisionSubTabs((prev) => ({
      ...prev,
      [divisionKey]: tabName,
    }));
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      <div className="border-b border-slate-800 pb-4">
        <h2 className="text-2xl font-bold text-white">
          Peta Struktur & Tupoksi Tim
        </h2>
        <p className="text-sm text-slate-400">
          Peta interaktif pembagian peran 10 anggota berdasarkan fase kerja
          (Pra-Survei & Hari-H Lapangan).
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {Object.entries(divisions).map(([key, info]) => {
          const registered = members.filter((m) => m.division === key);
          const currentSubTab = divisionSubTabs[key] || "members";

          return (
            <div
              key={key}
              className="bg-slate-900 border border-slate-800 rounded-2xl p-6 flex flex-col justify-between space-y-4 shadow-xl"
            >
              {/* Header Kartu Divisi */}
              <div className="space-y-2">
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
                    className={`text-xs font-semibold px-2.5 py-1 rounded-full border shrink-0 ${
                      registered.length === info.max
                        ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                        : "bg-indigo-500/10 text-indigo-400 border-indigo-500/20"
                    }`}
                  >
                    {registered.length} / {info.max} Orang
                  </span>
                </div>
              </div>

              {/* Sub-Navigasi Dalam Kartu Divisi */}
              <div className="flex bg-slate-950 p-1 rounded-lg border border-slate-850 w-full">
                <button
                  onClick={() => handleSetSubTab(key, "members")}
                  className={`flex-1 py-1.5 text-[11px] font-semibold rounded-md transition-all flex items-center justify-center gap-1 ${
                    currentSubTab === "members"
                      ? "bg-indigo-600 text-white shadow-md"
                      : "text-slate-400 hover:text-slate-200"
                  }`}
                >
                  <Users className="h-3.5 w-3.5" /> Personil (
                  {registered.length})
                </button>
                <button
                  onClick={() => handleSetSubTab(key, "pra")}
                  className={`flex-1 py-1.5 text-[11px] font-semibold rounded-md transition-all flex items-center justify-center gap-1 ${
                    currentSubTab === "pra"
                      ? "bg-indigo-600 text-white shadow-md"
                      : "text-slate-400 hover:text-slate-200"
                  }`}
                >
                  <Calendar className="h-3.5 w-3.5" /> Pra-Survei (Tugas)
                </button>
                <button
                  onClick={() => handleSetSubTab(key, "hariH")}
                  className={`flex-1 py-1.5 text-[11px] font-semibold rounded-md transition-all flex items-center justify-center gap-1 ${
                    currentSubTab === "hariH"
                      ? "bg-indigo-600 text-white shadow-md"
                      : "text-slate-400 hover:text-slate-200"
                  }`}
                >
                  <Compass className="h-3.5 w-3.5" /> Hari-H (Aksi)
                </button>
              </div>

              {/* Konten Sub-Tab Aktif */}
              <div className="flex-1 pt-2">
                {/* 1. VIEW PERSONIL AKTIF */}
                {currentSubTab === "members" && (
                  <div className="space-y-3 min-h-[140px]">
                    <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                      Anggota Terdaftar di Sistem:
                    </h4>
                    {registered.length === 0 ? (
                      <div className="text-center py-6 text-xs text-slate-500 italic border border-dashed border-slate-800 rounded-xl">
                        Belum ada anggota diplot di divisi ini. Tambahkan via
                        Admin Panel.
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 gap-2">
                        {registered.map((m) => (
                          <div
                            key={m.id}
                            className="p-3 bg-slate-950 border border-slate-800 rounded-xl flex items-center justify-between hover:border-indigo-500/40 transition-all"
                          >
                            <div className="space-y-0.5">
                              <div className="text-sm font-bold text-slate-200">
                                {m.name}
                              </div>
                              <div className="text-xs text-indigo-400 font-semibold">
                                {m.role}
                              </div>
                            </div>
                            <div className="text-right text-[10px] text-slate-500">
                              NIM: {m.nim}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {/* 2. VIEW JOBDESK PERSIPAN (PRA-SURVEI) */}
                {currentSubTab === "pra" && (
                  <div className="space-y-3 min-h-[140px] animate-fadeIn">
                    <div className="flex items-center justify-between">
                      <h4 className="text-[10px] font-bold text-indigo-400 uppercase tracking-wider">
                        Persiapan (Pra-Survei):
                      </h4>
                      <span className="text-[9px] bg-indigo-950 text-indigo-300 border border-indigo-900/30 px-1.5 py-0.5 rounded-md font-semibold">
                        Fase 1
                      </span>
                    </div>
                    <div className="space-y-2">
                      {info.jobdeskPra.map((job, idx) => (
                        <div
                          key={idx}
                          className="p-3 bg-slate-950/85 border border-slate-850 rounded-xl flex items-start gap-2.5"
                        >
                          <span className="bg-indigo-500/10 text-indigo-400 text-[9px] font-bold px-1.5 py-0.5 rounded border border-indigo-500/20 mt-0.5 uppercase shrink-0">
                            {job.role}
                          </span>
                          <p className="text-xs text-slate-300 leading-relaxed">
                            {job.task}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* 3. VIEW JOBDESK LAPANGAN (HARI-H) */}
                {currentSubTab === "hariH" && (
                  <div className="space-y-3 min-h-[140px] animate-fadeIn">
                    <div className="flex items-center justify-between">
                      <h4 className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider">
                        Tugas Lapangan (Hari-H):
                      </h4>
                      <span className="text-[9px] bg-emerald-950 text-emerald-300 border border-emerald-900/30 px-1.5 py-0.5 rounded-md font-semibold">
                        Fase 2
                      </span>
                    </div>
                    <div className="space-y-2">
                      {info.jobdeskHariH.map((job, idx) => (
                        <div
                          key={idx}
                          className="p-3 bg-slate-950/85 border border-slate-850 rounded-xl flex items-start gap-2.5"
                        >
                          <span className="bg-emerald-500/10 text-emerald-400 text-[9px] font-bold px-1.5 py-0.5 rounded border border-emerald-500/20 mt-0.5 uppercase shrink-0">
                            {job.role}
                          </span>
                          <p className="text-xs text-slate-300 leading-relaxed">
                            {job.task}
                          </p>
                        </div>
                      ))}
                    </div>
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
