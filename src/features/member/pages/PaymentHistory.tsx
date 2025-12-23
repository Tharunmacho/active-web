import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export default function PaymentHistory() {
  const [payments, setPayments] = useState<Array<any>>([]);

  useEffect(() => {
    async function load() {
      let apps: any[] = [];
      // Get applications from local storage
      try { 
        apps = JSON.parse(localStorage.getItem('applications') || '[]'); 
      } catch (_) { 
        apps = []; 
      }
      
      const list = apps
        .filter(a => a.payment && a.payment.status)
        .map(a => ({ id: a.id, ...a.payment }))
        .sort((a, b) => new Date(b.paidAt || 0).getTime() - new Date(a.paidAt || 0).getTime());
      setPayments(list);
    }
    load();
  }, []);

  return (
    <div className="min-h-screen p-4 flex items-start justify-center bg-background">
      <div className="w-full max-w-md">
        <Card className="mb-4">
          <CardHeader>
            <CardTitle>Payment History</CardTitle>
          </CardHeader>
        </Card>

        {payments.length ? (
          <div className="space-y-3">
            {payments.map(p => (
              <Card key={`${p.id}-${p.paidAt}`}>
                <CardContent className="p-4 flex items-center justify-between">
                  <div>
                    <div className="text-sm text-muted-foreground">{p.plan === 'lifetime' ? 'Lifetime Membership' : 'Annual Membership'}</div>
                    <div className="font-semibold">₹{p.totalAmount}</div>
                    <div className="text-xs text-muted-foreground">{new Date(p.paidAt).toLocaleString()} • {p.id}</div>
                  </div>
                  <Button variant="outline" onClick={() => {
                    const blob = new Blob([`Payment Receipt\nMember ID: ${p.id}\nPlan: ${p.plan}\nAmount: ₹${p.totalAmount}\nPaid: ${new Date(p.paidAt).toLocaleString()}`], { type: 'text/plain' });
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.href = url; a.download = `Receipt-${p.id}.txt`; document.body.appendChild(a); a.click(); a.remove(); URL.revokeObjectURL(url);
                  }}>Receipt</Button>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="p-6 text-center text-sm text-muted-foreground">No payments yet</CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
