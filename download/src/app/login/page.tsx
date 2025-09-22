
"use client";

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { School, Fingerprint, AlertCircle } from 'lucide-react';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useToast } from '@/hooks/use-toast';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { activityLog } from '@/lib/activity-log';
import { userDB } from '@/lib/user-db';

export default function LoginPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [role, setRole] = useState<'applicant' | 'admin'>('applicant');
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [hasCameraPermission, setHasCameraPermission] = useState<boolean | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [loginId, setLoginId] = useState('');
  const [password, setPassword] = useState('');

  useEffect(() => {
    // Clean up camera stream when component unmounts
    return () => {
      if (videoRef.current && videoRef.current.srcObject) {
        const stream = videoRef.current.srcObject as MediaStream;
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  const getCameraPermission = async () => {
    if (typeof window !== 'undefined' && navigator.mediaDevices) {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ video: true });
            setHasCameraPermission(true);
            if (videoRef.current) {
                videoRef.current.srcObject = stream;
            }
            return stream;
        } catch (error) {
            console.error('Error accessing camera:', error);
            setHasCameraPermission(false);
            toast({
                variant: 'destructive',
                title: 'Camera Access Denied',
                description: 'Please enable camera permissions in your browser settings to use Face ID.',
            });
            return null;
        }
    }
    return null;
  };

  const handleFaceIdLogin = async () => {
    setIsLoggingIn(true);
    const stream = await getCameraPermission();
    
    if (stream) {
        // Simulate Face ID scan
        toast({ title: "Scanning face...", description: "Please look at the camera." });
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        // Simulate success
        toast({ title: "Face ID Successful!", description: "Welcome back." });
        activityLog.info({ user: 'face-id-user', role: role, action: 'login_faceid_success' });
        
        // Stop camera stream
        stream.getTracks().forEach(track => track.stop());

        if (role === 'applicant') {
            router.push('/applicant');
        } else {
            router.push('/dashboard');
        }
    } else {
       activityLog.warn({ role: role, action: 'login_faceid_fail', details: { reason: 'permission_denied' } });
    }
    setIsLoggingIn(false);
  };
  
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoggingIn(true);

    activityLog.info({ user: loginId, role: role, action: 'login_attempt' });
    
    setTimeout(() => {
        const user = userDB.findUserByIdOrEmail(loginId, role);

        if (user) {
            const isPasswordCorrect = userDB.verifyPassword(user.id, role, password);
            if (isPasswordCorrect) {
                activityLog.info({ user: user.id, role: role, action: 'login_success' });
                if (role === 'applicant') {
                    router.push(`/applicant?userId=${user.id}`);
                } else {
                    router.push('/dashboard');
                }
            } else {
                activityLog.warn({ user: loginId, role: role, action: 'login_fail_incorrect_password' });
                toast({
                    variant: "destructive",
                    title: "Login Failed",
                    description: "Incorrect password. Please try again.",
                });
            }
        } else {
            activityLog.warn({ user: loginId, role: role, action: 'login_fail_not_found' });
            toast({
                variant: "destructive",
                title: "Login Failed",
                description: "User not found. Please check your credentials.",
            });
        }
        setIsLoggingIn(false);
    }, 1000);
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-8 bg-background">
      <Card className="w-full max-w-sm">
        <CardHeader className="text-center">
          <div className="flex justify-center items-center mb-4">
              <div className="bg-primary text-primary-foreground rounded-full p-3">
                  <School className="h-8 w-8" />
              </div>
          </div>
          <CardTitle className="text-2xl font-headline">FUTA Admissions Companion</CardTitle>
          <CardDescription>Sign in to access the predictive monitoring system</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                  <Label>Select Your Role</Label>
                  <RadioGroup defaultValue="applicant" onValueChange={(v) => setRole(v as 'applicant' | 'admin')} className="flex space-x-4">
                      <div className="flex items-center space-x-2">
                          <RadioGroupItem value="applicant" id="applicant" />
                          <Label htmlFor="applicant">Applicant</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                          <RadioGroupItem value="admin" id="admin" />
                          <Label htmlFor="admin">Admin/Admissions Officer</Label>
                      </div>
                  </RadioGroup>
              </div>
            <div className="space-y-2">
              <Label htmlFor="email">{role === 'applicant' ? 'Email or JAMB Number' : 'Email or Staff ID'}</Label>
              <Input id="email" type="text" placeholder={role === 'applicant' ? 'e.g., 12345678AB' : 'e.g., admin@futa.edu.ng'} required value={loginId} onChange={(e) => setLoginId(e.target.value)}/>
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input id="password" type="password" required value={password} onChange={(e) => setPassword(e.target.value)} />
            </div>
            
             {hasCameraPermission && (
                <div className="relative">
                    <video ref={videoRef} className="w-full aspect-video rounded-md" autoPlay muted playsInline />
                </div>
            )}
            {hasCameraPermission === false && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>Camera Access Required</AlertTitle>
                  <AlertDescription>
                    Please allow camera access to use this feature.
                  </AlertDescription>
                </Alert>
            )}

            <Button type="submit" className="w-full" disabled={isLoggingIn}>
              Sign In
            </Button>
            <Button type="button" variant="outline" className="w-full" onClick={handleFaceIdLogin} disabled={isLoggingIn}>
                <Fingerprint className="mr-2"/>
                Log in with Face ID
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex-col gap-2">
            <div className="flex items-center justify-between w-full">
                <Button variant="link" className="px-0" asChild>
                    <Link href="/signup">Sign up</Link>
                </Button>
                <Button variant="link" className="px-0" asChild>
                    <Link href="/forgot-password">Forgot password?</Link>
                </Button>
            </div>
        </CardFooter>
      </Card>
    </main>
  );
}
