import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Input } from '../components/ui/Input';
import { Textarea } from '../components/ui/Textarea';
import { Select } from '../components/ui/Select';
import { Button } from '../components/ui/Button';
import { Card, CardBody, CardHeader, CardTitle } from '../components/ui/Card';
import { AudioUploader } from '../components/upload/AudioUploader';
import { CoverArtUploader } from '../components/upload/CoverArtUploader';
import { CollaboratorSplits } from '../components/song/CollaboratorSplits';
import { songApi } from '../services/api/song.api';
import toast from 'react-hot-toast';

export default function UploadSong() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({
    title: '',
    description: '',
    genre: '',
    collaborators: [] as { userId: string; shareBps: number; email: string }[],
  });
  const [songId, setSongId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const next = async () => {
    if (step === 1) {
      if (!form.title) return toast.error('Title required');
      setSaving(true);
      try {
        const res = (await songApi.create({
          title: form.title,
          description: form.description,
          genre: form.genre,
          collaborators: form.collaborators.length
            ? form.collaborators
            : [{ userId: 'self', shareBps: 10000, email: '' }],
        })) as { data: { data: { id: string } } };
        setSongId(res.data.data.id);
        setStep(2);
      } catch (err) {
        toast.error('Failed to create song');
      } finally {
        setSaving(false);
      }
    } else {
      setStep((s) => Math.min(4, s + 1));
    }
  };

  return (
    <div className="mx-auto max-w-2xl">
      <h1 className="mb-6 text-2xl font-bold">Upload song</h1>
      <p className="mb-4 text-sm text-gray-400">Step {step} of 4</p>

      {step === 1 && (
        <Card>
          <CardHeader><CardTitle>Details</CardTitle></CardHeader>
          <CardBody className="space-y-4">
            <Input id="title" label="Title" value={form.title} onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))} />
            <Textarea id="desc" label="Description" value={form.description} onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))} />
            <Select
              label="Genre"
              value={form.genre}
              onChange={(e) => setForm((f) => ({ ...f, genre: e.target.value }))}
              options={[
                { value: '', label: 'Select...' },
                { value: 'afro-pop', label: 'Afro-pop' },
                { value: 'benga', label: 'Benga' },
                { value: 'gengetone', label: 'Gengetone' },
                { value: 'hiphop', label: 'Hip-hop' },
                { value: 'rnb', label: 'R&B' },
                { value: 'gospel', label: 'Gospel' },
                { value: 'other', label: 'Other' },
              ]}
            />
            <CollaboratorSplits
              collaborators={form.collaborators}
              onChange={(c) => setForm((f) => ({ ...f, collaborators: c }))}
            />
          </CardBody>
        </Card>
      )}

      {step === 2 && songId && (
        <Card>
          <CardHeader><CardTitle>Audio file</CardTitle></CardHeader>
          <CardBody>
            <AudioUploader songId={songId} onUploaded={() => setStep(3)} />
          </CardBody>
        </Card>
      )}

      {step === 3 && songId && (
        <Card>
          <CardHeader><CardTitle>Cover art</CardTitle></CardHeader>
          <CardBody>
            <CoverArtUploader songId={songId} onUploaded={() => setStep(4)} />
          </CardBody>
        </Card>
      )}

      {step === 4 && songId && (
        <Card>
          <CardHeader><CardTitle>Build NFT metadata</CardTitle></CardHeader>
          <CardBody>
            <p className="mb-4 text-sm text-gray-300">
              Once your audio and cover are uploaded, we can pin your NFT metadata to IPFS.
            </p>
            <Button onClick={async () => {
              try {
                await songApi.buildMetadata(songId);
                toast.success('Metadata ready — proceed to mint from My Songs');
                navigate('/my-songs');
              } catch {
                toast.error('Failed to build metadata');
              }
            }}>Build & continue</Button>
          </CardBody>
        </Card>
      )}

      <div className="mt-4 flex justify-between">
        <Button variant="secondary" onClick={() => setStep((s) => Math.max(1, s - 1))} disabled={step === 1}>Back</Button>
        {step < 4 && <Button onClick={next} loading={saving}>Next</Button>}
      </div>
    </div>
  );
}
