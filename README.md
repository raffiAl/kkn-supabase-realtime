# 🌾 Digital Platform & System Information KKN Kelompok 22B
> **Lokasi Penugasan:** Desa Kadununggal, Kecamatan Kalapanunggal  
> **Program:** KKN Sinergi Gelombang 1 — Universitas Nusa Putra  
> **Arsitek Sistem & Lead Dev:** Moh. Raffi Alfatih (NIM: 20240040066)

---

## 📌 Gambaran Umum Proyek

Aplikasi web terintegrasi ini dirancang khusus untuk mendukung operasional pendataan riset lapangan, digitalisasi inventarisasi masalah desa, dan dokumentasi program kerja **KKN Kelompok 22B Universitas Nusa Putra** di Desa Kadununggal.

Sistem dibangun menggunakan arsitektur SPA (*Single Page Application*) yang mengusung konsep **Offline-First via LocalStorage Fallback**, sehingga anggota tim tetap dapat mengumpulkan data kuesioner dan kerusakan infrastruktur di area pelosok desa yang minim sinyal internet. Saat perangkat terhubung kembali ke jaringan, data secara otomatis tersinkronisasi ke **Supabase Cloud Database (PostgreSQL)**.

---

## 🚀 Fitur Utama Sistem

1. **🏦 Digital Bank Masalah Desa (`village_problems`)**
   - Pencatatan keluhan fisik & infrastruktur (parit tersumbat, jalan berlubang, sanitasi air).
   - Penentuan tingkat urgensi masalah (*Tinggi, Sedang, Rendah*).
   - Sinkronisasi instan ke Supabase Cloud dengan skema ID berbasis String/UUID.

2. **📊 Peta Struktur & Tugas Fungsional Tim (Canvas Modular)**
   - Visualisasi dinamik peran 10 personil anggota kelompok.
   - Pembedaan tugas berbasis fase timeline: **Fase 1 (Pra-Survei)** dan **Fase 2 (Hari-H Eksplorasi)**.

3. **📝 Modul Instrumen Riset & Cetak PDF Rapi**
   - Ekstraksi panduan wawancara tokoh kunci (Kades/Sekdes).
   - Template kuesioner warga *door-to-door* dengan optimasi CSS `@media print` A4 bebas potong.

4. **⚡ Hybrid Storage Architecture**
   - Integrasi langsung ke Supabase Cloud REST API.
   - Penanganan otomatis status *offline* menggunakan `localStorage` browser.

---

## 🛠️ Spesifikasi Teknologi (*Tech Stack*)

- **Frontend Core:** React.js (Vite)
- **Styling & UI Components:** Tailwind CSS, Lucide React Icons
- **Database & Backend Services:** Supabase Cloud (PostgreSQL)
- **Database Client:** `@supabase/supabase-client`
- **Deployment & Hosting:** Vercel / Netlify

---

## 🗂️ Struktur Repositori

```text
kkn-22b-kadununggal/
├── public/
│   └── favicon.ico
├── src/
│   ├── assets/
│   │   └── logo-nusaputra.png
│   ├── components/
│   │   ├── Navbar.jsx
│   │   └── Footer.jsx
│   ├── pages/
│   │   ├── Dashboard.jsx
│   │   ├── BankMasalah.jsx
│   │   └── Struktur.jsx
│   ├── utils/
│   │   └── supabaseClient.js
│   ├── App.jsx
│   └── main.jsx
├── fix_supabase_schema.sql     # Skrip SQL DDL untuk setup database Supabase
├── panduan_peran_taktis_22b.html # Laporan PDF/HTML Siap Cetak
├── panduan_kuesioner_nusaputra.html # Form Kuesioner Digital Nusa Putra
├── package.json
├── tailwind.config.js
└── README.md
