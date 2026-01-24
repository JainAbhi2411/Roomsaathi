import React, { useState } from 'react';
import { supabase } from '@/db/supabase';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';

export default function TestAuthPage() {
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const testConnection = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase.auth.getSession();
      setResult({ type: 'connection', data, error });
      console.log('Connection test:', { data, error });
    } catch (err) {
      setResult({ type: 'connection', error: err });
      console.error('Connection error:', err);
    }
    setLoading(false);
  };

  const testSendOtp = async () => {
    if (!email) {
      alert('Please enter an email');
      return;
    }

    setLoading(true);
    try {
      console.log('Attempting to send OTP to:', email);
      const { data, error } = await supabase.auth.signInWithOtp({
        email: email,
        options: {
          shouldCreateUser: true,
        },
      });
      setResult({ type: 'sendOtp', data, error, email });
      console.log('Send OTP result:', { data, error });
      
      if (error) {
        alert(`Error: ${error.message}`);
      } else {
        alert('OTP sent! Check your email and console logs.');
      }
    } catch (err: any) {
      setResult({ type: 'sendOtp', error: err });
      console.error('Send OTP error:', err);
      alert(`Exception: ${err.message}`);
    }
    setLoading(false);
  };

  const testVerifyOtp = async () => {
    if (!email || !otp) {
      alert('Please enter email and OTP');
      return;
    }

    setLoading(true);
    try {
      console.log('Attempting to verify OTP:', { email, otp });
      const { data, error } = await supabase.auth.verifyOtp({
        email: email,
        token: otp,
        type: 'email',
      });
      setResult({ type: 'verifyOtp', data, error });
      console.log('Verify OTP result:', { data, error });
      
      if (error) {
        alert(`Error: ${error.message}`);
      } else {
        alert('OTP verified successfully!');
      }
    } catch (err: any) {
      setResult({ type: 'verifyOtp', error: err });
      console.error('Verify OTP error:', err);
      alert(`Exception: ${err.message}`);
    }
    setLoading(false);
  };

  const checkEnvVars = () => {
    const url = import.meta.env.VITE_SUPABASE_URL;
    const key = import.meta.env.VITE_SUPABASE_ANON_KEY;
    
    setResult({
      type: 'envVars',
      url: url || 'NOT SET',
      keyLength: key ? key.length : 0,
      keyPrefix: key ? key.substring(0, 20) + '...' : 'NOT SET',
    });
    
    console.log('Environment variables:', {
      url,
      keyLength: key?.length,
      keyPrefix: key?.substring(0, 20),
    });
  };

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-4xl mx-auto space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Supabase Authentication Test Page</CardTitle>
            <CardDescription>
              Test Supabase connection and email OTP functionality
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Environment Variables Test */}
            <div className="space-y-2">
              <h3 className="font-semibold">1. Check Environment Variables</h3>
              <Button onClick={checkEnvVars} disabled={loading}>
                Check Env Vars
              </Button>
            </div>

            {/* Connection Test */}
            <div className="space-y-2">
              <h3 className="font-semibold">2. Test Supabase Connection</h3>
              <Button onClick={testConnection} disabled={loading}>
                Test Connection
              </Button>
            </div>

            {/* Send OTP Test */}
            <div className="space-y-2">
              <h3 className="font-semibold">3. Send OTP</h3>
              <Label htmlFor="test-email">Email Address</Label>
              <Input
                id="test-email"
                type="email"
                placeholder="your.email@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <Button onClick={testSendOtp} disabled={loading || !email}>
                {loading ? 'Sending...' : 'Send OTP'}
              </Button>
            </div>

            {/* Verify OTP Test */}
            <div className="space-y-2">
              <h3 className="font-semibold">4. Verify OTP</h3>
              <Label htmlFor="test-otp">6-Digit OTP</Label>
              <Input
                id="test-otp"
                type="text"
                placeholder="123456"
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                maxLength={6}
              />
              <Button onClick={testVerifyOtp} disabled={loading || !email || !otp}>
                {loading ? 'Verifying...' : 'Verify OTP'}
              </Button>
            </div>

            {/* Result Display */}
            {result && (
              <div className="space-y-2">
                <h3 className="font-semibold">Result:</h3>
                <pre className="bg-muted p-4 rounded-lg overflow-auto text-xs">
                  {JSON.stringify(result, null, 2)}
                </pre>
              </div>
            )}

            {/* Instructions */}
            <div className="space-y-2 border-t pt-4">
              <h3 className="font-semibold">Instructions:</h3>
              <ol className="list-decimal list-inside space-y-1 text-sm text-muted-foreground">
                <li>First, check environment variables are loaded</li>
                <li>Test Supabase connection</li>
                <li>Enter your email and click "Send OTP"</li>
                <li>Check your email inbox (and spam folder)</li>
                <li>Enter the 6-digit OTP and click "Verify OTP"</li>
                <li>Check browser console for detailed logs</li>
              </ol>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
