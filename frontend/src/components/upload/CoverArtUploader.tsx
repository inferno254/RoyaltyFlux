import { FileUploader } from './FileUploader';

export function CoverArtUploader({ songId, onUploaded }: { songId: string; onUploaded: () => void }) {
  return (
    <FileUploader
      accept="image/*"
      label="Choose cover art"
      onUploaded={() => onUploaded()}
    />
  );
}
