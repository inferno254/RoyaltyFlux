import { useUser } from '../hooks/useUser';
import { Card, CardBody, CardHeader, CardTitle } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { useState } from 'react';
import { useTheme } from '../hooks/useTheme';
import toast from 'react-hot-toast';

export default function Settings() {
  const { data, refetch } = useUser();
  const { theme, setTheme } = useTheme();
  const [emailNotif, setEmailNotif] = useState(true);
  const [smsNotif, setSmsNotif] = useState(false);

  return (
    <div className="mx-auto max-w-2xl">
      <h1 className="mb-6 text-2xl font-bold">Settings</h1>

      <Card className="mb-4">
        <CardHeader><CardTitle>Appearance</CardTitle></CardHeader>
        <CardBody>
          <div className="flex gap-2">
            <Button variant={theme === 'dark' ? 'primary' : 'secondary'} onClick={() => setTheme('dark')}>Dark</Button>
            <Button variant={theme === 'light' ? 'primary' : 'secondary'} onClick={() => setTheme('light')}>Light</Button>
          </div>
        </CardBody>
      </Card>

      <Card className="mb-4">
        <CardHeader><CardTitle>Notifications</CardTitle></CardHeader>
        <CardBody>
          <label className="mb-2 flex items-center gap-2">
            <input type="checkbox" checked={emailNotif} onChange={(e) => setEmailNotif(e.target.checked)} />
            <span>Email notifications</span>
          </label>
          <label className="flex items-center gap-2">
            <input type="checkbox" checked={smsNotif} onChange={(e) => setSmsNotif(e.target.checked)} />
            <span>SMS notifications</span>
          </label>
          <Button className="mt-4" onClick={() => toast.success('Preferences saved')}>Save</Button>
        </CardBody>
      </Card>

      <Card>
        <CardHeader><CardTitle>Account</CardTitle></CardHeader>
        <CardBody>
          <p className="text-sm text-gray-300">{data?.data?.email}</p>
          <p className="text-xs text-gray-500">Joined {new Date(data?.data?.createdAt ?? Date.now()).toLocaleDateString()}</p>
        </CardBody>
      </Card>
    </div>
  );
}
