import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { Input } from '../ui/Input';
import { Select } from '../ui/Select';
import { Button } from '../ui/Button';
import { Alert } from '../ui/Alert';

export function RegisterForm() {
  const { register, loading } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    email: '',
    password: '',
    phone: '',
    walletAddress: '',
    role: 'LISTENER',
    displayName: '',
  });
  const [error, setError] = useState('');

  const onChange = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.value }));

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      await register(form);
      navigate('/dashboard');
    } catch (err: unknown) {
      const e = err as { response?: { data?: { error?: string } } };
      setError(e?.response?.data?.error || 'Registration failed');
    }
  };

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      {error && <Alert type="error">{error}</Alert>}
      <Input id="email" type="email" label="Email" value={form.email} onChange={onChange('email')} required />
      <Input id="password" type="password" label="Password" value={form.password} onChange={onChange('password')} required minLength={8} />
      <Select
        label="I am a..."
        value={form.role}
        onChange={onChange('role')}
        options={[
          { value: 'LISTENER', label: 'Listener' },
          { value: 'ARTIST', label: 'Artist' },
          { value: 'COLLABORATOR', label: 'Collaborator / Producer' },
        ]}
      />
      {form.role === 'ARTIST' && (
        <Input id="displayName" label="Stage / display name" value={form.displayName} onChange={onChange('displayName')} />
      )}
      <Input id="phone" label="M-Pesa phone (optional)" placeholder="0712345678" value={form.phone} onChange={onChange('phone')} />
      <Input id="wallet" label="Avalanche wallet (optional)" placeholder="0x..." value={form.walletAddress} onChange={onChange('walletAddress')} />
      <Button type="submit" loading={loading} className="w-full">Create account</Button>
      <p className="text-center text-sm text-gray-400">
        Already have an account? <Link to="/login" className="font-medium text-brand-400 hover:text-brand-300">Sign in</Link>
      </p>
    </form>
  );
}
