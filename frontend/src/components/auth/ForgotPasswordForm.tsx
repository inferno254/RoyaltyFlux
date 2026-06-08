import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';
import { Alert } from '../ui/Alert';
import { authApi } from '../../services/api/auth.api';

export function ForgotPasswordForm() {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await authApi.forgotPassword(email);
      setSent(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      {sent && <Alert type="success">If that email exists, a reset link has been sent.</Alert>}
      <Input id="email" type="email" label="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
      <Button type="submit" loading={loading} className="w-full">Send reset link</Button>
      <p className="text-center text-sm text-gray-400">
        <Link to="/login" className="hover:text-white">Back to login</Link>
      </p>
    </form>
  );
}
