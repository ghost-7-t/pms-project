
"use client";

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { Loader2, Camera, CheckCircle, AlertCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function FaceIdSetupPage() {
  const router = useRouter();
  const { toast } = useToast();
  const videoRef = useRef<HTMLVideoElement>(null);
  const [hasCameraPermission, setHasCameraPermission] = useState<boolean | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [scanComplete, setScanComplete] = useState(false);

  useEffect(() => {
    const getCameraPermission = async () => {
      if (typeof window !== 'undefined' && navigator.mediaDevices) {
        try {
          const stream = await navigator.mediaDevices.getUserMedia({ video: true });
          setHasCameraPermission(true);
          if (videoRef.current) {
            videoRef.current.srcObject = stream;
          }
        } catch (error) {
          console.error('Error accessing camera:', error);
          setHasCameraPermission(false);
          toast({
            variant: 'destructive',
            title: 'Camera Access Denied',
            description: 'Please enable camera permissions in your browser settings to set up Face ID.',
          });
        }
      }
    };
    getCameraPermission();

    return () => {
        if (videoRef.current && videoRef.current.srcObject) {
            const stream = videoRef.current.srcObject as MediaStream;
            stream.getTracks().forEach(track => track.stop());
        }
    };
  }, [toast]);

  const handleStartScan = async () => {
    setIsScanning(true);
    // Simulate a face scan process
    await new Promise(resolve => setTimeout(resolve, 3000));
    setIsScanning(false);
    setScanComplete(true);
    toast({
        title: "Face ID Setup Complete!",
        description: "You can now use your face to log in.",
    });
  };

  const handleFinish = () => {
    router.push('/');
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-8 bg-background">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
            <div className="flex justify-center items-center mb-4">
                <div className="bg-primary text-primary-foreground rounded-full p-3">
                    <Camera className="h-8 w-8" />
                </div>
            </div>
          <CardTitle className="text-2xl font-headline">Set Up Face ID</CardTitle>
          <CardDescription>Position your face in the frame to complete the setup.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
            <div className="relative aspect-video w-full overflow-hidden rounded-md border bg-muted">
                <video ref={videoRef} className="h-full w-full object-cover" autoPlay muted playsInline />
                {isScanning && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/50">
                        <Loader2 className="h-10 w-10 animate-spin text-primary-foreground" />
                    </div>
                )}
                 {scanComplete && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center bg-green-600/80 text-white">
                        <CheckCircle className="h-16 w-16" />
                        <p className="mt-2 text-lg font-semibold">Scan Successful!</p>
                    </div>
                )}
            </div>
            
            {hasCameraPermission === false && (
                <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>Camera Access Required</AlertTitle>
                    <AlertDescription>
                        Please allow camera access in your browser settings to use this feature.
                    </AlertDescription>
                </Alert>
            )}

        </CardContent>
        <CardFooter className="flex-col gap-4">
            {!scanComplete ? (
                <Button className="w-full" onClick={handleStartScan} disabled={!hasCameraPermission || isScanning}>
                    {isScanning ? 'Scanning...' : 'Start Scan'}
                </Button>
            ) : (
                <Button className="w-full" onClick={handleFinish}>
                    Finish & Go to Login
                </Button>
            )}
            <Button variant="link" onClick={() => router.push('/')}>Skip for now</Button>
        </CardFooter>
      </Card>
    </main>
  );
}
