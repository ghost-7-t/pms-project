
"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { School } from 'lucide-react';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import Link from 'next/link';

export default function LoginForm() {
  const router = useRouter();
  const [role, setRole] = useState('applicant');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (role === 'applicant') {
      router.push('/applicant');
    } else {
      router.push('/dashboard');
    }
  };

  return (
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
                <RadioGroup defaultValue="applicant" onValueChange={setRole} className="flex space-x-4">
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
            <Label htmlFor="email">{role === 'applicant' ? 'JAMB Registration Number' : 'FUTA Staff ID'}</Label>
            <Input id="email" type={role === 'applicant' ? 'text' : 'email'} placeholder={role === 'applicant' ? 'Enter your JAMB reg number' : 'user@futa.edu.ng'} required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input id="password" type="password" required />
          </div>
           <div className="flex items-center justify-between">
             <Button variant="link" className="px-0" asChild>
                <Link href="/signup">Sign up</Link>
             </Button>
             <Button variant="link" className="px-0" asChild>
                <Link href="/forgot-password">Forgot password?</Link>
             </Button>
           </div>
          <Button type="submit" className="w-full">
            Sign In
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
