import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Mountain, Lock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export default function AdminLogin() {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (login(password)) {
      navigate('/portal-access-v1');
    } else {
      setError('Invalid password');
    }
  };

  return (
    <div className="min-h-screen bg-background dark flex items-center justify-center p-4">
      <div className="w-full max-w-md p-8 rounded-2xl bg-card border border-border">
        <div className="text-center mb-8">
          <div className="inline-flex p-3 rounded-xl bg-accent/10 mb-4">
            <Mountain className="w-8 h-8 text-accent" />
          </div>
          <h1 className="font-heading font-bold text-2xl text-foreground">Admin Portal</h1>
          <p className="text-muted-foreground text-sm mt-2">Enter password to continue</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="pl-10"
            />
          </div>
          {error && <p className="text-destructive text-sm">{error}</p>}
          <Button type="submit" className="w-full btn-adventure">
            Access Dashboard
          </Button>
        </form>
        <p className="text-xs text-muted-foreground text-center mt-6">Demo password: simba2024</p>
      </div>
    </div>
  );
}
