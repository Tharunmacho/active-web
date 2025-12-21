import { useEffect, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useNavigate } from 'react-router-dom';

export default function Account() {
  const navigate = useNavigate();
  const [name, setName] = useState('Member');

  useEffect(() => {
    const n = localStorage.getItem('userName') || 'Member';
    setName(n);
  }, []);

  const Item = ({ icon, label, onClick }: { icon: React.ReactNode; label: string; onClick: () => void }) => (
    <button onClick={onClick} className="w-full flex items-center justify-between p-4 rounded-xl bg-white hover:bg-gray-50 border">
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-lg bg-gray-100 flex items-center justify-center text-gray-700">
          {icon}
        </div>
        <span className="font-medium">{label}</span>
      </div>
      <span className="text-gray-400">›</span>
    </button>
  );

  return (
    <div className="min-h-screen p-4 flex items-start justify-center bg-background">
      <div className="w-full max-w-md">
        <div className="text-center mb-6">
          <h1 className="text-xl font-semibold">Account</h1>
        </div>

        <Card className="mb-6">
          <CardContent className="p-6 flex flex-col items-center">
            <Avatar className="w-24 h-24 mb-2">
              <AvatarImage src="/assets/placeholder.svg" />
              <AvatarFallback>ME</AvatarFallback>
            </Avatar>
            <div className="text-lg font-semibold">{name}</div>
            <div className="text-sm text-blue-600">TechCorp Solution</div>
          </CardContent>
        </Card>

        <div className="space-y-3">
          <Item icon={<span role="img" aria-label="user">👤</span>} label="My Profile" onClick={() => navigate('/member/profile')} />
          <Item icon={<span role="img" aria-label="card">💳</span>} label="Payment History" onClick={() => navigate('/member/payment-history')} />
          <Item icon={<span role="img" aria-label="cert">📄</span>} label="Certificates" onClick={() => navigate('/member/certificate')} />
        </div>

        <div className="mt-8">
          <Button variant="outline" className="w-full" onClick={() => navigate('/member/dashboard')}>Back to Home</Button>
        </div>
      </div>
    </div>
  );
}
