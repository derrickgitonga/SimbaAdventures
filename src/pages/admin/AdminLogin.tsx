import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Mountain, Lock, Mail, Shield, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export default function AdminLogin() {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const success = await login(password);
      if (success) {
        navigate('/portal-access-v1');
      } else {
        setError('Invalid password');
      }
    } catch {
      setError('Login failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background dark flex items-center justify-center p-4">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-amber-900/20 via-background to-background" />

      <div className="relative w-full max-w-md">
        {/* Login Card */}
        <div className="p-8 rounded-2xl bg-card border border-border shadow-2xl">
          {/* Logo */}
          <div className="text-center mb-8">
            <div className="inline-flex p-4 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-600 mb-4 shadow-lg shadow-amber-500/20">
              <Mountain className="w-10 h-10 text-white" />
            </div>
            <h1 className="font-heading font-bold text-2xl text-foreground">
              Admin Portal
            </h1>
            <p className="text-muted-foreground text-sm mt-2">
              Secure access to Simba Adventures management
            </p>
          </div>

          {/* Security Badge */}
          <div className="flex items-center justify-center gap-2 mb-6 p-3 rounded-lg bg-green-500/10 border border-green-500/20">
            <Shield className="w-4 h-4 text-green-500" />
            <span className="text-sm text-green-500">SSL Encrypted Connection</span>
          </div>

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  type="password"
                  placeholder="Enter admin password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10 h-12"
                  disabled={isLoading}
                />
              </div>
            </div>

            {error && (
              <div className="flex items-center gap-2 p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-500">
                <AlertCircle className="w-4 h-4" />
                <span className="text-sm">{error}</span>
              </div>
            )}

            <Button
              type="submit"
              className="w-full h-12 bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white font-semibold text-lg"
              disabled={isLoading}
            >
              {isLoading ? (
                <span className="flex items-center gap-2">
                  <span className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                  Authenticating...
                </span>
              ) : (
                'Access Dashboard'
              )}
            </Button>
          </form>

          {/* Demo Info */}
          <div className="mt-6 p-4 rounded-lg bg-muted/50 border border-border">
            <p className="text-xs text-muted-foreground text-center">
              <strong className="text-foreground">Demo Access:</strong> simba2026
            </p>
          </div>
        </div>

        {/* Footer */}
        <p className="text-center text-xs text-muted-foreground mt-6">
          © 2026 Simba Adventures. All activities are logged for security.
        </p>
      </div>
    </div>
  );
}
