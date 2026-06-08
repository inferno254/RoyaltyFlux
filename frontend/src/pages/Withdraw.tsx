import { useState } from 'react';
import { Card, CardBody, CardHeader, CardTitle } from '../components/ui/Card';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import { Alert } from '../components/ui/Alert';
import { useStkPush } from '../hooks/useMpesa';
import { formatKes } from '../lib/format';
import { useNavigate } from 'react-router-dom';

export default function Withdraw() {
  const [phone, setPhone] = useState('');
  const [amount, setAmount] = useState(100);
  const stk = useStkPush();
  const navigate = useNavigate();

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = (await stk.mutateAsync({
        phone,
        amount,
        accountRef: 'WITHDRAW',
        transactionDesc: 'Royalty withdrawal',
      })) as { data: { data: { checkoutRequestId: string; customerMessage: string } } };
      alert('Check your phone: ' + res.data.data.customerMessage);
      navigate('/earnings');
    } catch {
      // toast handled in axios interceptor
    }
  };

  return (
    <div className="mx-auto max-w-md">
      <h1 className="mb-6 text-2xl font-bold">Withdraw to M-Pesa</h1>
      <Card>
        <CardHeader><CardTitle>STK Push</CardTitle></CardHeader>
        <CardBody>
          <Alert type="info" >
            Enter the phone number registered to your M-Pesa account. You'll receive a popup to confirm.
          </Alert>
          <form onSubmit={onSubmit} className="mt-4 space-y-4">
            <Input id="phone" label="Phone (254...)" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="0712345678" required />
            <Input id="amount" type="number" label="Amount (KES)" value={amount} onChange={(e) => setAmount(Number(e.target.value))} min={1} max={70000} required />
            <p className="text-sm text-gray-400">You'll receive: <strong className="text-green-400">{formatKes(amount)}</strong></p>
            <Button type="submit" loading={stk.isPending} className="w-full">Send STK Push</Button>
          </form>
        </CardBody>
      </Card>
    </div>
  );
}
