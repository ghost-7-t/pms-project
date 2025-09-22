
"use client";

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { KeyRound, Fingerprint, AlertCircle, Home } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { userDB } from '@/lib/user-db';

export default function ForgotPasswordPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [isProcessing, setIsProcessing] = useState(false);
  const [emailOrId, setEmailOrId] = useState('');
  const [hasCameraPermission, setHasCameraPermission] = useState<boolean | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
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

  const handleFaceIdReset = async () => {
    setIsProcessing(true);
    const user = userDB.findUserByIdOrEmail(emailOrId);
    if (!user || !user.faceIdEnabled) {
        toast({ variant: 'destructive', title: "Face ID Not Enabled", description: "This user does not exist or has not enabled Face ID."});
        setIsProcessing(false);
        return;
    }

    const stream = await getCameraPermission();
    if (stream) {
        toast({ title: "Scanning face...", description: "This will be used to reset your password." });
        await new Promise(resolve => setTimeout(resolve, 2000));
        stream.getTracks().forEach(track => track.stop());

        toast({ title: "Face ID Verified!", description: "You can now reset your password." });
        // Here you would typically show a password reset form
        // For simulation, we'll just redirect
        router.push('/');
    }
    setIsProcessing(false);
  };

  const handleResetLink = (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);
    
    const user = userDB.findUserByIdOrEmail(emailOrId);
    if (!user) {
        toast({ variant: 'destructive', title: "User Not Found", description: "No account found with that ID or email."});
        setIsProcessing(false);
        return;
    }

    // Simulate sending reset link
    setTimeout(() => {
        toast({
            title: 'Password Reset Link Sent',
            description: 'Please check your email to continue.',
        });
        router.push('/');
        setIsProcessing(false);
    }, 1000);
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-8 bg-background">
      <Card className="w-full max-w-sm">
        <CardHeader className="text-center">
          <div className="flex justify-center items-center mb-4">
              <div className="bg-primary text-primary-foreground rounded-full p-3">
                  <KeyRound className="h-8 w-8" />
              </div>
          </div>
          <CardTitle className="text-2xl font-headline">Forgot Password?</CardTitle>
          <CardDescription>Enter your email or ID to receive a reset link, or use Face ID.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <form onSubmit={handleResetLink} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email / JAMB Number / Staff ID</Label>
              <Input id="email" type="text" placeholder="Enter your credentials" required value={emailOrId} onChange={(e) => setEmailOrId(e.target.value)} />
            </div>
            <Button type="submit" className="w-full" disabled={isProcessing}>
              Send Reset Link
            </Button>
          </form>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">Or</span>
            </div>
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

           <Button variant="outline" className="w-full" onClick={handleFaceIdReset} disabled={isProcessing || !emailOrId}>
              <Fingerprint className="mr-2"/>
              Use Face ID to Reset
           </Button>

        </CardContent>
        <CardFooter className="flex justify-center">
            <Button variant="link" asChild>
                <Link href="/"><Home className="mr-2"/>Back to Home</Link>
            </Button>
        </CardFooter>
      </Card>
    </main>
  );
}
