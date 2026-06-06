import { useState, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { ChevronRight, Upload as UploadIcon, X, Plus, Wallet, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '@/lib/api';
import { GENRES, COLLABORATOR_ROLES } from '@/constants/app';

const step1Schema = z.object({ title: z.string().min(1, 'Title required'), genre: z.string().min(1, 'Genre required'), duration: z.coerce.number().optional(), releaseDate: z.string().optional() });
const step4Schema = z.object({
  collaborators: z.array(z.object({ role: z.enum(['LYRICIST', 'COMPOSER', 'PRODUCER']), walletAddress: z.string().regex(/^0x[a-fA-F0-9]{40}$/, 'Invalid ETH address'), percentage: z.coerce.number().min(1).max(100) })).max(10).optional(),
}).refine((d) => (d.collaborators?.reduce((s, c) => s + c.percentage, 0) || 0) <= 100, { message: 'Total exceeds 100%', path: ['collaborators'] });

type Step1Data = z.infer<typeof step1Schema>;

export default function UploadSong() {
  const [step, setStep] = useState(1);
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [audioPreview, setAudioPreview] = useState('');
  const [coverPreview, setCoverPreview] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [progress, setProgress] = useState(0);

  const s1 = useForm<Step1Data>({ resolver: zodResolver(step1Schema), defaultValues: { title: '', genre: '', releaseDate: new Date().toISOString().split('T')[0] } });
  const s4 = useForm({ resolver: zodResolver(step4Schema), defaultValues: { collaborators: [] as any[] } });
  const { fields, append, remove } = useFieldArray({ control: s4.control, name: 'collaborators' });

  useEffect(() => { if (audioFile) setAudioPreview(URL.createObjectURL(audioFile)); }, [audioFile]);
  useEffect(() => { if (coverFile) setCoverPreview(URL.createObjectURL(coverFile)); }, [coverFile]);

  const audioDrop = useDropzone({ accept: { 'audio/mpeg': ['.mp3'], 'audio/wav': ['.wav'], 'audio/mp4': ['.m4a'] }, maxFiles: 1, maxSize: 50 * 1024 * 1024, onDrop: (a) => a[0] && setAudioFile(a[0]) });
  const coverDrop = useDropzone({ accept: { 'image/jpeg': ['.jpg', '.jpeg'], 'image/png': ['.png'] }, maxFiles: 1, maxSize: 5 * 1024 * 1024, onDrop: (a) => a[0] && setCoverFile(a[0]) });

  const next1 = async () => { const ok = await s1.trigger(); if (!ok) return; setStep(2); };
  const submitAll = async () => {
    const ok = await s4.trigger(); if (!ok) return;
    setSubmitting(true); setProgress(0);
    try {
      const fd = new FormData();
      const v1 = s1.getValues();
      fd.append('title', v1.title); fd.append('genre', v1.genre);
      if (v1.duration) fd.append('duration', String(v1.duration));
      if (v1.releaseDate) fd.append('releaseDate', v1.releaseDate);
      if (audioFile) fd.append('audio', audioFile);
      if (coverFile) fd.append('cover', coverFile);
      fd.append('collaborators', JSON.stringify(s4.getValues().collaborators));
      await (api as any).post('/songs', fd, { headers: { 'Content-Type': 'multipart/form-data' }, onUploadProgress: (e: any) => setProgress(Math.round((e.loaded / (e.total || 1)) * 100)) });
      toast.success('Song minted successfully!');
      setTimeout(() => window.location.href = '/dashboard', 1500);
    } catch (err: any) { toast.error(err?.response?.data?.error || 'Upload failed'); setSubmitting(false); }
  };

  const pctTotal = fields.reduce((s, f) => s + (f.percentage || 0), 0);

  return (
    <div className="max-w-3xl mx-auto py-12 px-4">
      <h1 className="text-3xl font-bold mb-2">Upload New Song</h1>
      <div className="flex items-center gap-2 mb-8">{[1, 2, 3, 4].map((n) => <div key={n} className={`h-2 flex-1 rounded-full ${step >= n ? 'bg-primary' : 'bg-gray-200'}`} />)}</div>
      <div className="bg-white dark:bg-gray-900 rounded-xl shadow p-6">
        {step === 1 && (<div className="space-y-4"><h2 className="text-xl font-bold">Basic Info</h2>
          <div><label className="block text-sm font-medium mb-1">Song Title</label><input {...s1.register('title')} className="w-full border border-gray-300 rounded-lg px-4 py-2" />{s1.formState.errors.title && <p className="text-red-500 text-sm mt-1">{s1.formState.errors.title.message}</p>}</div>
          <div><label className="block text-sm font-medium mb-1">Genre</label><select {...s1.register('genre')} className="w-full border border-gray-300 rounded-lg px-4 py-2">{GENRES.map((g) => <option key={g.value} value={g.value}>{g.label}</option>)}</select>{s1.formState.errors.genre && <p className="text-red-500 text-sm mt-1">{s1.formState.errors.genre.message}</p>}</div>
          <div><label className="block text-sm font-medium mb-1">Duration (seconds)</label><input type="number" {...s1.register('duration', { valueAsNumber: true })} className="w-full border border-gray-300 rounded-lg px-4 py-2" /></div>
          <div><label className="block text-sm font-medium mb-1">Release Date</label><input type="date" {...s1.register('releaseDate')} className="w-full border border-gray-300 rounded-lg px-4 py-2" /></div>
          <button type="button" onClick={next1} className="bg-primary hover:bg-primary/90 text-white font-semibold py-2.5 rounded-lg">Next <ChevronRight className="inline w-4 h-4" /></button>
        </div>)}

        {step === 2 && (<div className="space-y-4"><h2 className="text-xl font-bold">Audio File</h2>
          <div {...audioDrop.getRootProps()} className="border-2 border-dashed rounded-xl p-8 text-center cursor-pointer hover:border-primary"><input {...audioDrop.getInputProps()} disabled={submitting} /><UploadIcon className="w-12 h-12 mx-auto text-gray-400 mb-3" /><p>{audioFile ? audioFile.name : 'Drag & drop audio or click to browse'}</p><p className="text-sm text-gray-500">MP3, WAV, M4A — max 50MB</p></div>
          {audioPreview && <audio controls src={audioPreview} className="w-full" />}
          {audioFile && <button type="button" onClick={() => setAudioFile(null)} className="text-red-500 text-sm">Remove</button>}
          <div className="flex justify-between"><button type="button" onClick={() => setStep(1)} className="px-4 py-2 border rounded-lg">Back</button><button type="button" onClick={() => setStep(3)} className="bg-primary hover:bg-primary/90 text-white font-semibold py-2.5 rounded-lg">Next <ChevronRight className="inline w-4 h-4" /></button></div>
        </div>)}

        {step === 3 && (<div className="space-y-4"><h2 className="text-xl font-bold">Cover Image</h2>
          <div {...coverDrop.getRootProps()} className="border-2 border-dashed rounded-xl p-8 text-center cursor-pointer hover:border-primary"><input {...coverDrop.getInputProps()} disabled={submitting} /><UploadIcon className="w-12 h-12 mx-auto text-gray-400 mb-3" /><p>{coverFile ? coverFile.name : 'Drag & drop image or click to browse'}</p><p className="text-sm text-gray-500">JPG, PNG — max 5MB</p></div>
          {coverPreview && <img src={coverPreview} alt="Preview" className="w-48 h-48 object-cover rounded-lg mx-auto" />}
          {coverFile && <button type="button" onClick={() => setCoverFile(null)} className="text-red-500 text-sm block mx-auto">Remove</button>}
          <div className="flex justify-between"><button type="button" onClick={() => setStep(2)} className="px-4 py-2 border rounded-lg">Back</button><button type="button" onClick={() => setStep(4)} className="bg-primary hover:bg-primary/90 text-white font-semibold py-2.5 rounded-lg">Next <ChevronRight className="inline w-4 h-4" /></button></div>
        </div>)}

        {step === 4 && (<div className="space-y-4"><h2 className="text-xl font-bold">Royalty Split</h2>
          <div className="bg-blue-50 p-4 rounded-lg flex items-start gap-3"><Wallet className="w-5 h-5 text-blue-600 mt-0.5" /><p className="text-sm text-blue-800">You (artist) receive the remaining percentage. Example: 3 collaborators at 40+30+20=90%, you get 10%.</p></div>
          {fields.map((f, i) => (
            <div key={f.id} className="grid grid-cols-12 gap-2 items-end bg-gray-50 dark:bg-gray-800 p-3 rounded-lg">
              <div className="col-span-4"><label className="block text-xs font-medium mb-1">Role</label><select {...s4.register(`collaborators.${i}.role` as const)} className="w-full border border-gray-300 rounded px-2 py-1.5 text-sm">{COLLABORATOR_ROLES.map((r) => <option key={r.value} value={r.value}>{r.label}</option>)}</select></div>
              <div className="col-span-5"><label className="block text-xs font-medium mb-1">Wallet</label><input {...s4.register(`collaborators.${i}.walletAddress` as const)} className="w-full border border-gray-300 rounded px-2 py-1.5 text-sm" placeholder="0x..." /></div>
              <div className="col-span-2"><label className="block text-xs font-medium mb-1">%</label><input type="number" {...s4.register(`collaborators.${i}.percentage`, { valueAsNumber: true })} className="w-full border border-gray-300 rounded px-2 py-1.5 text-sm" /></div>
              <div className="col-span-1 pb-2"><button type="button" onClick={() => remove(i)} className="text-red-500"><X className="w-4 h-4" /></button></div>
            </div>
          ))}
          {fields.length < 10 && <button type="button" onClick={() => append({ role: 'LYRICIST', walletAddress: '', percentage: 0 })} className="text-primary text-sm font-medium flex items-center gap-1"><Plus className="w-4 h-4" /> Add Collaborator</button>}
          <div className="text-sm font-medium">Total split: <span className={pctTotal > 100 ? 'text-red-500' : ''}>{pctTotal}%</span></div>
          {s4.formState.errors.collaborators?.root && <p className="text-red-500 text-sm">{s4.formState.errors.collaborators.root.message}</p>}
          <div className="flex justify-between pt-4"><button type="button" onClick={() => setStep(3)} className="px-4 py-2 border rounded-lg">Back</button><button type="button" onClick={submitAll} disabled={submitting} className="bg-primary hover:bg-primary/90 text-white font-semibold py-2.5 rounded-lg flex items-center gap-2">{submitting && <Loader2 className="w-4 h-4 animate-spin" />}{submitting ? `${progress}%` : 'Mint Song'}</button></div>
          {submitting && <div className="w-full bg-gray-200 rounded-full h-2 mt-3"><div className="bg-primary h-2 rounded-full transition-all" style={{ width: `${progress}%` }} /></div>}
        </div>)}
      </div>
    </div>
  );
}
