import { useState } from 'react';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import { Card, CardBody, CardHeader, CardTitle } from '../components/ui/Card';
import { Alert } from '../components/ui/Alert';
import { useUser } from '../hooks/useUser';
import { userApi } from '../services/api/user.api';
import toast from 'react-hot-toast';

export default function Profile() {
  const { data, refetch } = useUser();
  const [form, setForm] = useState({ phone: data?.data?.phone ?? '', walletAddress: data?.data?.walletAddress ?? '' });
  const [saving, setSaving] = useState(false);

  const onSave = async () => {
    setSaving(true);
    try {
      await userApi.update(form);
      await refetch();
      toast.success('Profile updated');
    } finally {
      setSaving(false);
    }
  };

  if (!data?.data) return null;
  return (
    <div className="mx-auto max-w-2xl">
      <h1 className="mb-6 text-2xl font-bold">Profile</h1>
      <Card>
        <CardHeader><CardTitle>Account</CardTitle></CardHeader>
        <CardBody>
          <Alert type="info" >
            <strong>{data.data.email}</strong> — {data.data.role}
          </Alert>
          <div className="mt-4 space-y-4">
            <Input id="phone" label="M-Pesa phone" value={form.phone} onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))} />
            <Input id="wallet" label="Wallet" value={form.walletAddress} onChange={(e) => setForm((f) => ({ ...f, walletAddress: e.target.value }))} />
            <Button onClick={onSave} loading={saving}>Save</Button>
          </div>
        </CardBody>
      </Card>
    </div>
  );
}
