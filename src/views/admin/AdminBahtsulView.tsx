import React, { useState } from 'react';
import { useJatibarayaData } from '../../context/DataContext';
import { BahtsulMasailItem } from '../../types';
import {
  BookOpen,
  Plus,
  Search,
  Edit2,
  Trash2,
  CheckCircle,
  Eye,
  EyeOff,
  Share2,
  AlertCircle,
  Save,
  X,
  Scroll,
  Tag,
  Calendar,
  UserCheck,
  FileText,
  Bookmark,
} from 'lucide-react';
import { ShareModal } from '../../components/common/ShareModal';
import { ShareableItem } from '../../utils/shareUtils';

const KATEGORI_OPTIONS = [
  'Muamalah Kontemporer',
  'Ubudiyyah',
  'Munakahah',
  'Jinayah',
  'Fiqih Dakwah & Kemasyarakatan',
  'Kajian Turats & Ushul Fiqih',
];

export const AdminBahtsulView: React.FC = () => {
  const { data, addBahtsul, updateBahtsul, deleteBahtsul, saveToCloud } = useJatibarayaData();
  const bahtsulList = data.bahtsulMasail || [];

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<BahtsulMasailItem | null>(null);
  const [itemToDelete, setItemToDelete] = useState<BahtsulMasailItem | null>(null);
  const [shareItem, setShareItem] = useState<ShareableItem | null>(null);
  const [toastMessage, setToastMessage] = useState('');

  // Form State
  const [title, setTitle] = useState('');
  const [kategori, setKategori] = useState(KATEGORI_OPTIONS[0]);
  const [tingkat, setTingkat] = useState('Forum Musyawarah Bahtsul Masail Santri Priangan');
  const [tanggal, setTanggal] = useState(new Date().toISOString().split('T')[0]);
  const [masalah, setMasalah] = useState('');
  const [jawaban, setJawaban] = useState('');
  const [ibarat, setIbarat] = useState('');
  const [musyawirin, setMusyawirin] = useState('');
  const [mushahih, setMushahih] = useState('');
  const [status, setStatus] = useState<'sah' | 'ditashih' | 'draft'>('sah');
  const [published, setPublished] = useState(true);
  const [previewTab, setPreviewTab] = useState<'editor' | 'preview'>('editor');

  const showNotice = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3500);
  };

  const handleOpenAdd = () => {
    setEditingItem(null);
    setTitle('');
    setKategori(KATEGORI_OPTIONS[0]);
    setTingkat('Forum Musyawarah Bahtsul Masail Santri Priangan');
    setTanggal(new Date().toISOString().split('T')[0]);
    setMasalah('');
    setJawaban('');
    setIbarat('');
    setMusyawirin('LBM Santri Jatibaraya Kediri');
    setMushahih('Dewan Masyayikh & Asatidz Pembina');
    setStatus('sah');
    setPublished(true);
    setPreviewTab('editor');
    setIsFormOpen(true);
  };

  const handleOpenEdit = (item: BahtsulMasailItem) => {
    setEditingItem(item);
    setTitle(item.title);
    setKategori(item.kategori);
    setTingkat(item.tingkat || 'Forum Musyawarah Bahtsul Masail Santri Priangan');
    setTanggal(item.tanggal);
    setMasalah(item.masalah);
    setJawaban(item.jawaban);
    setIbarat(item.ibarat || '');
    setMusyawirin(item.musyawirin || '');
    setMushahih(item.mushahih || '');
    setStatus(item.status || 'sah');
    setPublished(item.published);
    setPreviewTab('editor');
    setIsFormOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      alert('Judul masalah / tema Bahtsul Masail harus diisi.');
      return;
    }
    if (!jawaban.trim()) {
      alert('Keputusan hukum (Al-Jawab) harus diisi.');
      return;
    }

    const payload = {
      title: title.trim(),
      kategori,
      tingkat: tingkat.trim() || 'Forum Bahtsul Masail Jatibaraya',
      tanggal,
      masalah: masalah.trim(),
      jawaban: jawaban.trim(),
      ibarat: ibarat.trim() || undefined,
      musyawirin: musyawirin.trim() || undefined,
      mushahih: mushahih.trim() || undefined,
      status,
      published,
    };

    let targetShare: ShareableItem;

    if (editingItem) {
      updateBahtsul(editingItem.id, payload);
      saveToCloud().catch(() => {});
      showNotice(`Hasil Bahtsul "${payload.title}" berhasil diperbarui & disinkronkan secara realtime.`);
      targetShare = {
        id: editingItem.id,
        title: payload.title,
        summary: payload.jawaban.slice(0, 180),
        category: payload.kategori,
        date: payload.tanggal,
        type: 'bahtsul',
      };
    } else {
      const created = addBahtsul(payload);
      saveToCloud().catch(() => {});
      showNotice(`Hasil Bahtsul "${payload.title}" berhasil ditambahkan & langsung tersimpan.`);
      targetShare = {
        id: created.id,
        title: created.title,
        summary: created.jawaban.slice(0, 180),
        category: created.kategori,
        date: created.tanggal,
        type: 'bahtsul',
      };
    }

    setIsFormOpen(false);
    setEditingItem(null);

    // Open share option if published
    if (payload.published) {
      setTimeout(() => setShareItem(targetShare), 300);
    }
  };

  const handleDelete = () => {
    if (!itemToDelete) return;
    deleteBahtsul(itemToDelete.id);
    saveToCloud().catch(() => {});
    showNotice(`Hasil Bahtsul "${itemToDelete.title}" telah dihapus.`);
    setItemToDelete(null);
  };

  const handleTogglePublish = (item: BahtsulMasailItem) => {
    updateBahtsul(item.id, { published: !item.published });
    saveToCloud().catch(() => {});
    showNotice(`Status publikasi "${item.title}" diperbarui.`);
  };

  const filteredList = bahtsulList.filter((item) => {
    const matchesSearch =
      item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.masalah.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.jawaban.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (item.ibarat && item.ibarat.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCat = selectedCategory === 'all' || item.kategori === selectedCategory;
    return matchesSearch && matchesCat;
  });

  return (
    <div className="space-y-6 pb-28 sm:pb-12">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-6 right-6 z-50 p-4 rounded-2xl bg-emerald-900 text-white shadow-xl border border-emerald-700 text-xs font-semibold flex items-center gap-2 animate-in slide-in-from-top">
          <CheckCircle className="w-4 h-4 text-amber-400 flex-shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <span className="text-xs font-mono font-bold text-amber-700 uppercase tracking-wider">
            Manajemen Keilmuan & Turats
          </span>
          <h1 className="text-2xl font-serif font-bold text-slate-900 flex items-center gap-2.5">
            <Scroll className="w-6 h-6 text-emerald-700" />
            <span>Hasil Bahtsul Masail</span>
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Input, dokumentasi, dan publikasi keputusan musyawarah fiqhiyyah santri Priangan Jatibaraya.
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-bold shadow-sm transition-all cursor-pointer"
        >
          <Plus className="w-4 h-4 text-amber-400" />
          <span>Input Hasil Bahtsul</span>
        </button>
      </div>

      {/* Filter & Search Bar */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Cari judul mas'alah, deskripsi kasus, atau kutipan ibarat..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-xs bg-white focus:outline-none focus:ring-2 focus:ring-emerald-600/30"
          />
        </div>

        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs bg-white font-medium text-slate-700"
        >
          <option value="all">Semua Kategori ({bahtsulList.length})</option>
          {KATEGORI_OPTIONS.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>
      </div>

      {/* List / Cards */}
      {filteredList.length === 0 ? (
        <div className="p-12 text-center bg-white rounded-3xl border border-slate-200 space-y-3">
          <Scroll className="w-12 h-12 text-slate-300 mx-auto" />
          <h3 className="text-sm font-bold text-slate-700">Belum Ada Hasil Bahtsul Masail</h3>
          <p className="text-xs text-slate-500 max-w-md mx-auto">
            {searchTerm
              ? 'Tidak ditemukan hasil Bahtsul yang sesuai dengan kata kunci pencarian.'
              : 'Klik tombol "Input Hasil Bahtsul" di atas untuk mulai memasukkan keputusan kajian fiqih.'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {filteredList.map((item) => (
            <div
              key={item.id}
              className="p-5 sm:p-6 bg-white rounded-2xl border border-slate-200 shadow-xs hover:border-emerald-300 transition-all space-y-4"
            >
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                <div className="space-y-1.5 flex-1">
                  <div className="flex flex-wrap items-center gap-2 text-[11px]">
                    <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 font-bold border border-emerald-200 flex items-center gap-1">
                      <Tag className="w-3 h-3" />
                      {item.kategori}
                    </span>
                    <span className="text-slate-400 flex items-center gap-1 font-mono">
                      <Calendar className="w-3 h-3" />
                      {item.tanggal}
                    </span>
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                        item.status === 'sah'
                          ? 'bg-emerald-100 text-emerald-800'
                          : item.status === 'ditashih'
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      {item.status || 'Sah'}
                    </span>
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        item.published ? 'bg-green-100 text-green-800' : 'bg-slate-200 text-slate-700'
                      }`}
                    >
                      {item.published ? 'Publik' : 'Draft'}
                    </span>
                  </div>

                  <h3 className="text-base sm:text-lg font-serif font-bold text-slate-900 leading-snug">
                    {item.title}
                  </h3>

                  {item.tingkat && (
                    <p className="text-xs text-amber-800 font-medium">
                      Forum: {item.tingkat}
                    </p>
                  )}
                </div>

                {/* Actions */}
                <div className="flex items-center gap-1.5 flex-shrink-0 self-end sm:self-start">
                  <button
                    onClick={() => handleTogglePublish(item)}
                    title={item.published ? 'Sembunyikan dari Publik' : 'Tampilkan di Website'}
                    className={`p-2 rounded-xl text-xs font-semibold border transition-colors cursor-pointer ${
                      item.published
                        ? 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100'
                        : 'bg-slate-100 text-slate-600 border-slate-200 hover:bg-slate-200'
                    }`}
                  >
                    {item.published ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                  </button>

                  <button
                    onClick={() =>
                      setShareItem({
                        id: item.id,
                        title: item.title,
                        summary: item.jawaban.slice(0, 180),
                        category: item.kategori,
                        date: item.tanggal,
                        type: 'bahtsul',
                      })
                    }
                    title="Bagikan Hasil Bahtsul (WhatsApp, dll)"
                    className="p-2 rounded-xl bg-amber-50 text-amber-800 border border-amber-200 hover:bg-amber-100 transition-colors cursor-pointer"
                  >
                    <Share2 className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => handleOpenEdit(item)}
                    title="Edit Hasil Bahtsul"
                    className="p-2 rounded-xl bg-slate-100 text-slate-700 border border-slate-200 hover:bg-slate-200 transition-colors cursor-pointer"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => setItemToDelete(item)}
                    title="Hapus"
                    className="p-2 rounded-xl bg-rose-50 text-rose-700 border border-rose-200 hover:bg-rose-100 transition-colors cursor-pointer"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Collapsed Snippet */}
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 text-xs space-y-2">
                <div>
                  <span className="font-bold text-slate-700 block mb-0.5">As-Su&apos;al (Masalah):</span>
                  <p className="text-slate-600 line-clamp-2 italic">{item.masalah}</p>
                </div>

                <div>
                  <span className="font-bold text-emerald-900 block mb-0.5">Al-Jawab (Keputusan):</span>
                  <p className="text-slate-800 line-clamp-2 font-medium">{item.jawaban}</p>
                </div>

                {item.ibarat && (
                  <div>
                    <span className="font-bold text-amber-900 block mb-0.5">Ibarat Kitab Kuning:</span>
                    <p className="text-slate-600 line-clamp-2 font-serif text-[11px]">{item.ibarat}</p>
                  </div>
                )}
              </div>

              {(item.musyawirin || item.mushahih) && (
                <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-[11px] text-slate-500 pt-1">
                  {item.musyawirin && (
                    <span className="flex items-center gap-1">
                      <UserCheck className="w-3.5 h-3.5 text-emerald-600" />
                      Musyawirin: {item.musyawirin}
                    </span>
                  )}
                  {item.mushahih && (
                    <span className="flex items-center gap-1">
                      <Bookmark className="w-3.5 h-3.5 text-amber-600" />
                      Mushahih: {item.mushahih}
                    </span>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Add / Edit Form Modal */}
      {isFormOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-3xl w-full p-6 sm:p-8 border border-slate-200 shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div>
                <span className="text-xs font-mono font-bold text-amber-700 uppercase tracking-wider">
                  {editingItem ? 'Edit Keputusan Fiqih' : 'Input Baru Bahtsul Masail'}
                </span>
                <h2 className="text-xl sm:text-2xl font-serif font-bold text-slate-900">
                  {editingItem ? 'Formulir Sunting Bahtsul' : 'Formulir Hasil Bahtsul Masail'}
                </h2>
              </div>

              <div className="flex items-center gap-2">
                <div className="flex rounded-xl bg-slate-100 p-1 text-xs font-bold">
                  <button
                    type="button"
                    onClick={() => setPreviewTab('editor')}
                    className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                      previewTab === 'editor' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600'
                    }`}
                  >
                    Editor
                  </button>
                  <button
                    type="button"
                    onClick={() => setPreviewTab('preview')}
                    className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                      previewTab === 'preview' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600'
                    }`}
                  >
                    Pratinjau
                  </button>
                </div>

                <button
                  type="button"
                  onClick={() => setIsFormOpen(false)}
                  className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {previewTab === 'preview' ? (
              /* PREVIEW TAB */
              <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 space-y-5">
                <div className="space-y-2">
                  <div className="flex flex-wrap items-center gap-2 text-xs">
                    <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold">
                      {kategori}
                    </span>
                    <span className="text-slate-500 font-mono">{tanggal}</span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-900">
                      Status: {status.toUpperCase()}
                    </span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-green-100 text-green-800">
                      {published ? 'Dipublikasikan' : 'Draft'}
                    </span>
                  </div>
                  <h3 className="text-2xl font-serif font-bold text-slate-900">{title || '(Judul Belum Diisi)'}</h3>
                  {tingkat && <p className="text-xs text-amber-800 font-medium">Forum: {tingkat}</p>}
                </div>

                <div className="p-4 rounded-xl bg-white border border-slate-200 space-y-1.5">
                  <span className="text-xs font-bold text-slate-900 uppercase tracking-wider block">
                    As-Su&apos;al (Deskripsi Masalah):
                  </span>
                  <p className="text-xs text-slate-700 whitespace-pre-line leading-relaxed">
                    {masalah || '(Belum ada deskripsi masalah)'}
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-emerald-50/70 border border-emerald-200 space-y-1.5">
                  <span className="text-xs font-bold text-emerald-950 uppercase tracking-wider block">
                    Al-Jawab (Keputusan Hukum):
                  </span>
                  <p className="text-xs text-emerald-900 whitespace-pre-line font-medium leading-relaxed">
                    {jawaban || '(Belum ada keputusan hukum)'}
                  </p>
                </div>

                {ibarat && (
                  <div className="p-4 rounded-xl bg-amber-50/60 border border-amber-200 space-y-1.5">
                    <span className="text-xs font-bold text-amber-950 uppercase tracking-wider block">
                      Al-Ibarat (Kutipan Kitab Kuning / Turats):
                    </span>
                    <p className="text-xs text-slate-800 whitespace-pre-line font-serif leading-relaxed">
                      {ibarat}
                    </p>
                  </div>
                )}
              </div>
            ) : (
              /* EDITOR FORM */
              <form onSubmit={handleSave} className="space-y-5">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 block">
                    Judul Mas&apos;alah / Tema Kajian Fiqih *
                  </label>
                  <input
                    type="text"
                    required
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Contoh: Hukum Transaksi Fitur PayLater Menurut Fiqih Syafi'iyyah"
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-medium focus:ring-2 focus:ring-emerald-600/30"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700 block">Kategori Fiqih</label>
                    <select
                      value={kategori}
                      onChange={(e) => setKategori(e.target.value)}
                      className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-xs font-medium"
                    >
                      {KATEGORI_OPTIONS.map((k) => (
                        <option key={k} value={k}>
                          {k}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700 block">Tanggal Musyawarah</label>
                    <input
                      type="date"
                      value={tanggal}
                      onChange={(e) => setTanggal(e.target.value)}
                      className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-xs font-medium"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700 block">Status Penetapan</label>
                    <select
                      value={status}
                      onChange={(e) => setStatus(e.target.value as any)}
                      className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-xs font-medium"
                    >
                      <option value="sah">Sah (Disepakati)</option>
                      <option value="ditashih">Sudah Ditashih Masyayikh</option>
                      <option value="draft">Draft / Mauquf</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 block">Tingkat / Forum Musyawarah</label>
                  <input
                    type="text"
                    value={tingkat}
                    onChange={(e) => setTingkat(e.target.value)}
                    placeholder="Contoh: Forum Musyawarah Bahtsul Masail Santri Priangan"
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-medium"
                  />
                </div>

                {/* As-Su'al */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-slate-700">
                      As-Su&apos;al (Deskripsi Masalah & Kasus) *
                    </label>
                    <span className="text-[11px] text-slate-400">Pertanyaan dan latar belakang fiqih</span>
                  </div>
                  <textarea
                    rows={3}
                    required
                    value={masalah}
                    onChange={(e) => setMasalah(e.target.value)}
                    placeholder="Tuliskan latar belakang pertanyaan atau deskripsi kasus secara jelas..."
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-sans leading-relaxed focus:ring-2 focus:ring-emerald-600/30"
                  />
                </div>

                {/* Al-Jawab */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-emerald-900">
                      Al-Jawab (Keputusan Hukum / Mauqif) *
                    </label>
                    <span className="text-[11px] text-emerald-600 font-medium">Kesimpulan & ketetapan hukum</span>
                  </div>
                  <textarea
                    rows={4}
                    required
                    value={jawaban}
                    onChange={(e) => setJawaban(e.target.value)}
                    placeholder="Tuliskan keputusan hukum hasil musyawarah secara terstruktur..."
                    className="w-full px-4 py-2.5 rounded-xl border border-emerald-300 text-xs font-sans leading-relaxed bg-emerald-50/20 focus:ring-2 focus:ring-emerald-600/30"
                  />
                </div>

                {/* Al-Ibarat */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-amber-900">
                      Al-Ibarat (Kutipan Ta&apos;bir Kitab Kuning Turats)
                    </label>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() =>
                          setIbarat(
                            (prev) =>
                              prev +
                              '\n\nعبارة من كتاب (اسم الكتاب)، ج ...، ص ...:\n(نص العبارة هنا)'
                          )
                        }
                        className="text-[10px] font-bold text-amber-700 bg-amber-50 hover:bg-amber-100 px-2 py-0.5 rounded border border-amber-200"
                      >
                        + Sisipkan Format Ta&apos;bir
                      </button>
                    </div>
                  </div>
                  <textarea
                    rows={4}
                    value={ibarat}
                    onChange={(e) => setIbarat(e.target.value)}
                    placeholder="Masukkan kutipan ta'bir kitab kuning (Fathul Mu'in, Bughyah, I'anah, dll) beserta juz dan halaman..."
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-serif leading-relaxed focus:ring-2 focus:ring-emerald-600/30"
                  />
                </div>

                {/* Musyawirin & Mushahih */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700 block">
                      Dewan Musyawirin / Perumus / Notulen
                    </label>
                    <input
                      type="text"
                      value={musyawirin}
                      onChange={(e) => setMusyawirin(e.target.value)}
                      placeholder="Contoh: LBM Santri Jatibaraya (Ust. Ahmad, Katib: M. Salman)"
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-medium"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700 block">
                      Dewan Mushahih / Kiai / Asatidz
                    </label>
                    <input
                      type="text"
                      value={mushahih}
                      onChange={(e) => setMushahih(e.target.value)}
                      placeholder="Contoh: Dewan Masyayikh Pembina Santri Priangan"
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-medium"
                    />
                  </div>
                </div>

                {/* Publish Toggle */}
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                  <div>
                    <label className="text-xs font-bold text-slate-900 block">
                      Publikasikan di Website Publik
                    </label>
                    <span className="text-[11px] text-slate-500">
                      Jika aktif, santri dan masyarakat dapat membaca hasil bahtsul ini di website Jatibaraya.
                    </span>
                  </div>

                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={published}
                      onChange={(e) => setPublished(e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
                  </label>
                </div>

                <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setIsFormOpen(false)}
                    className="px-5 py-2.5 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2.5 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-bold shadow-sm flex items-center gap-2 transition-all cursor-pointer"
                  >
                    <Save className="w-4 h-4 text-amber-400" />
                    <span>{editingItem ? 'Perbarui Keputusan' : 'Simpan & Terbitkan'}</span>
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {itemToDelete && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 space-y-4 border border-slate-200 shadow-2xl animate-in zoom-in-95">
            <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center">
              <AlertCircle className="w-6 h-6" />
            </div>

            <div className="space-y-1">
              <h3 className="text-base font-bold text-slate-900">Hapus Keputusan Bahtsul Masail?</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Apakah Anda yakin ingin menghapus data <strong>&ldquo;{itemToDelete.title}&rdquo;</strong>? Tindakan ini tidak dapat dibatalkan.
              </p>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => setItemToDelete(null)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 cursor-pointer"
              >
                Batal
              </button>
              <button
                onClick={handleDelete}
                className="px-5 py-2 rounded-xl text-xs font-bold bg-rose-600 hover:bg-rose-700 text-white cursor-pointer shadow-xs"
              >
                Ya, Hapus
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Share Modal */}
      <ShareModal
        item={shareItem}
        isOpen={!!shareItem}
        onClose={() => setShareItem(null)}
      />
    </div>
  );
};
