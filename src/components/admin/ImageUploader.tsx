import React, { useState, useRef } from 'react';
import { Upload, Image as ImageIcon, X, Check, Folder, Loader2 } from 'lucide-react';
import { useJatibarayaData } from '../../context/DataContext';
import { compressImageFile } from '../../utils/imageCompressor';

interface ImageUploaderProps {
  currentImageUrl?: string;
  onImageSelected: (url: string) => void;
  categoryFolder?: 'LOGO' | 'BERITA' | 'ARTIKEL' | 'PROGRAM' | 'DOKUMENTASI' | 'GALERI';
  label?: string;
}

export const ImageUploader: React.FC<ImageUploaderProps> = ({
  currentImageUrl,
  onImageSelected,
  categoryFolder = 'BERITA',
  label = 'Pilih / Unggah Gambar',
}) => {
  const { data, addMedia } = useJatibarayaData();
  const [previewUrl, setPreviewUrl] = useState<string>(currentImageUrl || '');
  const [showMediaPicker, setShowMediaPicker] = useState<boolean>(false);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate size (max 10MB before compression)
    if (file.size > 10 * 1024 * 1024) {
      alert('Ukuran file maksimal 10MB.');
      return;
    }

    try {
      setIsProcessing(true);
      // Automatically compress and resize to ~80-120KB JPEG for reliable localStorage persistence
      const compressedDataUrl = await compressImageFile(file, 1200, 0.75);
      
      setPreviewUrl(compressedDataUrl);
      onImageSelected(compressedDataUrl);

      // Auto save to media catalog under specified folder category
      addMedia({
        title: file.name.replace(/\.[^/.]+$/, ''),
        caption: `Diunggah pada folder ${categoryFolder}`,
        category: categoryFolder,
        imageUrl: compressedDataUrl,
        date: new Date().toISOString().split('T')[0],
      });
    } catch (err) {
      console.error('Error processing image:', err);
      alert('Terjadi kesalahan saat memproses gambar. Silakan coba kembali.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleSelectFromLibrary = (url: string) => {
    setPreviewUrl(url);
    onImageSelected(url);
    setShowMediaPicker(false);
  };

  const handleClear = () => {
    setPreviewUrl('');
    onImageSelected('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <label className="text-xs font-semibold text-slate-700 block">
          {label}
        </label>
        <span className="text-[11px] font-mono text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
          Folder: JATIBARAYA/{categoryFolder}
        </span>
      </div>

      {isProcessing ? (
        <div className="border-2 border-dashed border-emerald-400 rounded-2xl p-8 text-center bg-emerald-50/50 flex flex-col items-center justify-center space-y-2 animate-pulse">
          <Loader2 className="w-8 h-8 text-emerald-700 animate-spin" />
          <span className="text-xs font-bold text-emerald-900">Mengoptimalkan & Mengompresi Foto...</span>
          <span className="text-[11px] text-emerald-600">Menyesuaikan ukuran agar responsif dan hemat penyimpanan</span>
        </div>
      ) : previewUrl ? (
        <div className="relative rounded-2xl overflow-hidden border border-slate-200 bg-slate-50 p-2 group">
          <div className="h-44 w-full rounded-xl overflow-hidden bg-slate-950 flex items-center justify-center">
            <img
              src={previewUrl}
              alt="Preview"
              className="max-h-44 w-full object-contain"
            />
          </div>
          <div className="flex items-center justify-between pt-2 px-1">
            <span className="text-[11px] text-emerald-700 font-medium flex items-center gap-1">
              <Check className="w-3.5 h-3.5" /> Gambar aktif
            </span>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="text-xs text-slate-600 hover:text-slate-900 font-medium hover:underline cursor-pointer"
              >
                Ganti
              </button>
              <button
                type="button"
                onClick={handleClear}
                className="text-xs text-red-600 hover:text-red-800 font-medium hover:underline cursor-pointer"
              >
                Hapus
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div
          onClick={() => fileInputRef.current?.click()}
          className="border-2 border-dashed border-slate-300 hover:border-emerald-500 rounded-2xl p-6 text-center cursor-pointer bg-slate-50/70 hover:bg-emerald-50/30 transition-colors space-y-2"
        >
          <div className="w-10 h-10 rounded-full bg-white shadow-xs border border-slate-200 flex items-center justify-center mx-auto text-emerald-700">
            <Upload className="w-5 h-5" />
          </div>
          <div className="text-xs text-slate-600">
            <strong className="text-emerald-800">Klik untuk upload foto</strong> dari HP/komputer
            <p className="text-[11px] text-slate-400 mt-0.5">PNG, JPG, WebP (maks. 5MB)</p>
          </div>
        </div>
      )}

      {/* Media Library Picker Trigger */}
      <div className="flex justify-between items-center pt-1">
        <button
          type="button"
          onClick={() => setShowMediaPicker(true)}
          className="text-xs font-semibold text-emerald-800 hover:text-emerald-950 flex items-center gap-1.5 cursor-pointer"
        >
          <Folder className="w-3.5 h-3.5 text-amber-600" />
          <span>Pilih dari Pustaka Media ({data.media.length} foto)</span>
        </button>
      </div>

      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/*"
        className="hidden"
      />

      {/* Media Picker Modal */}
      {showMediaPicker && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 shadow-2xl border border-slate-200 space-y-4 max-h-[85vh] flex flex-col">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h3 className="text-base font-serif font-bold text-slate-900">
                  Pustaka Media Jatibaraya
                </h3>
                <p className="text-xs text-slate-500">Pilih foto yang pernah diunggah sebelumnya</p>
              </div>
              <button
                type="button"
                onClick={() => setShowMediaPicker(false)}
                className="p-2 text-slate-400 hover:text-slate-700 rounded-full hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="overflow-y-auto flex-1 grid grid-cols-2 sm:grid-cols-3 gap-3 p-1">
              {data.media.map((item) => (
                <div
                  key={item.id}
                  onClick={() => handleSelectFromLibrary(item.imageUrl)}
                  className="group relative h-28 rounded-xl overflow-hidden border border-slate-200 bg-slate-950 cursor-pointer hover:border-emerald-500"
                >
                  <img
                    src={item.imageUrl}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-transparent to-transparent p-2 flex flex-col justify-end">
                    <span className="text-[10px] text-amber-300 font-mono line-clamp-1">
                      {item.title}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            <div className="pt-3 border-t border-slate-100 flex justify-end">
              <button
                type="button"
                onClick={() => setShowMediaPicker(false)}
                className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold"
              >
                Batal
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
