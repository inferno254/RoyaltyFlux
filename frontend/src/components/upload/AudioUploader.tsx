import { FileUploader } from './FileUploader';
import { songApi } from '../../services/api/song.api';
import toast from 'react-hot-toast';

export function AudioUploader({ songId, onUploaded }: { songId: string; onUploaded: () => void }) {
  return (
    <FileUploader
      accept="audio/*"
      label="Choose audio file (mp3, wav, flac)"
      onUploaded={async () => {
        toast.success('Audio uploaded — click Next');
        onUploaded();
      }}
    />
  );
}
