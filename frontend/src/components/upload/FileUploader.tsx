import { useState } from 'react';
import { Button } from '../ui/Button';
import { Progress } from '../ui/Progress';
import { uploadApi } from '../../services/api/upload.api';
import toast from 'react-hot-toast';

export function FileUploader({
  accept,
  onUploaded,
  label = 'Upload file',
}: {
  accept: string;
  onUploaded: (hash: string) => void;
  label?: string;
}) {
  const [progress, setProgress] = useState(0);
  const [uploading, setUploading] = useState(false);

  const handle = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    setProgress(30);
    try {
      // For real progress, switch to fetch + ReadableStream
      const res = (await uploadApi.file(file)) as { data: { data: { hash: string } } };
      setProgress(100);
      toast.success('Uploaded to IPFS');
      onUploaded(res.data.data.hash);
    } catch {
      toast.error('Upload failed');
    } finally {
      setUploading(false);
      setTimeout(() => setProgress(0), 1500);
    }
  };

  return (
    <div className="space-y-2">
      <label className="btn-primary cursor-pointer">
        {uploading ? 'Uploading...' : label}
        <input type="file" accept={accept} onChange={handle} className="hidden" disabled={uploading} />
      </label>
      {progress > 0 && <Progress value={progress} />}
    </div>
  );
}
