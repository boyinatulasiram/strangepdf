export interface CompressionStats {
  originalSize: number;
  compressedSize: number;
  savingsBytes: number;
  percentage: number;
  isLarger: boolean;
}

export interface ThumbnailData {
  page: number;
  width: number;
  height: number;
  image: string;
}

export interface PreviewResponse {
  filename: string;
  size: number;
  total_pages: number;
  thumbnails: ThumbnailData[];
}

export async function executeToolApi(
  endpoint: string,
  formData: FormData,
  onProgress?: (pct: number) => void
): Promise<{ blob: Blob; filename: string; stats?: CompressionStats }> {
  const xhr = new XMLHttpRequest();
  
  return new Promise((resolve, reject) => {
    xhr.open('POST', endpoint);
    
    if (xhr.upload && onProgress) {
      xhr.upload.onprogress = (event) => {
        if (event.lengthComputable) {
          const percent = Math.round((event.loaded / event.total) * 100);
          onProgress(percent);
        }
      };
    }

    xhr.responseType = 'blob';

    xhr.onload = () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        // Extract filename from Content-Disposition header if available
        let filename = 'download';
        const disposition = xhr.getResponseHeader('Content-Disposition');
        if (disposition && disposition.indexOf('filename=') !== -1) {
          const match = disposition.match(/filename="?([^";]+)"?/);
          if (match && match[1]) {
            filename = match[1];
          }
        }

        // Extract compression stats if present in headers
        let stats: CompressionStats | undefined;
        const originalSize = xhr.getResponseHeader('X-Original-Size');
        const compressedSize = xhr.getResponseHeader('X-Compressed-Size');
        if (originalSize && compressedSize) {
          stats = {
            originalSize: parseInt(originalSize, 10),
            compressedSize: parseInt(compressedSize, 10),
            savingsBytes: parseInt(xhr.getResponseHeader('X-Savings-Bytes') || '0', 10),
            percentage: parseFloat(xhr.getResponseHeader('X-Percentage') || '0'),
            isLarger: xhr.getResponseHeader('X-Is-Larger') === 'true'
          };
        }

        resolve({ blob: xhr.response, filename, stats });
      } else {
        // Attempt to parse error text from blob
        const reader = new FileReader();
        reader.onload = () => {
          try {
            const errObj = JSON.parse(reader.result as string);
            reject(new Error(errObj.detail || 'Processing failed.'));
          } catch {
            reject(new Error(`Server error (${xhr.status}): Operation could not be completed.`));
          }
        };
        reader.onerror = () => reject(new Error('Unknown server processing error'));
        reader.readAsText(xhr.response);
      }
    };

    xhr.onerror = () => reject(new Error('Network connection failed or server unreachable.'));
    xhr.send(formData);
  });
}

export async function fetchDocumentThumbnails(file: File): Promise<PreviewResponse> {
  const formData = new FormData();
  formData.append('file', file);
  
  const response = await fetch('/api/preview/thumbnails', {
    method: 'POST',
    body: formData
  });

  if (!response.ok) {
    throw new Error('Failed to render document preview.');
  }

  return response.json();
}
