/**
 * Utility to compress images using HTML5 Canvas before storing in browser localStorage.
 * Keeps resolution sharp while keeping file size ~50-150KB to avoid QuotaExceededError.
 */
export async function compressImageFile(file: File, maxDimension = 1200, quality = 0.75): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error('Gagal membaca file gambar'));
    reader.onload = () => {
      const img = new window.Image();
      img.onerror = () => reject(new Error('Gagal memproses file gambar'));
      img.onload = () => {
        let { width, height } = img;

        if (width > height) {
          if (width > maxDimension) {
            height = Math.round((height * maxDimension) / width);
            width = maxDimension;
          }
        } else {
          if (height > maxDimension) {
            width = Math.round((width * maxDimension) / height);
            height = maxDimension;
          }
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          resolve(reader.result as string);
          return;
        }

        // Draw image smoothly
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';
        ctx.drawImage(img, 0, 0, width, height);

        // If it's a PNG, preserve PNG format to keep alpha transparency intact for logos
        if (file.type === 'image/png') {
          const pngDataUrl = canvas.toDataURL('image/png');
          // If under 150KB string length, return directly
          if (pngDataUrl.length <= 180000) {
            resolve(pngDataUrl);
            return;
          }
          // If too large, scale down further to max 512px to preserve transparency while keeping size small
          const scaleFactor = Math.min(512 / width, 512 / height, 1);
          if (scaleFactor < 1) {
            const smallCanvas = document.createElement('canvas');
            smallCanvas.width = Math.round(width * scaleFactor);
            smallCanvas.height = Math.round(height * scaleFactor);
            const smallCtx = smallCanvas.getContext('2d');
            if (smallCtx) {
              smallCtx.imageSmoothingEnabled = true;
              smallCtx.imageSmoothingQuality = 'high';
              smallCtx.drawImage(img, 0, 0, smallCanvas.width, smallCanvas.height);
              const smallPng = smallCanvas.toDataURL('image/png');
              if (smallPng.length <= 250000) {
                resolve(smallPng);
                return;
              }
            }
          }
        }

        // Otherwise export as JPEG with controlled quality
        const compressedDataUrl = canvas.toDataURL('image/jpeg', quality);
        resolve(compressedDataUrl);
      };
      img.src = reader.result as string;
    };
    reader.readAsDataURL(file);
  });
}
