
"use client";

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { UserPlus, Fingerprint, Home } from 'lucide-react';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Checkbox } from '@/components/ui/checkbox';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';
import { activityLog } from '@/lib/activity-log';
import { userDB } from '@/lib/user-db';

export default function SignUpPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [role, setRole] = useState<'applicant' | 'admin'>('applicant');
  const [enableFaceId, setEnableFaceId] = useState(false);
  const [userId, setUserId] = useState('');
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [gender, setGender] = useState<'male' | 'female'>();

  const handleSignUp = (e: React.FormEvent) => {
    e.preventDefault();
    activityLog.info({ user: userId, role: role, action: 'signup_attempt', details: { enableFaceId } });

    // Password validation
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/;
    if (!passwordRegex.test(password)) {
        activityLog.warn({ user: userId, role: role, action: 'signup_fail_password_policy' });
        toast({
            variant: "destructive",
            title: "Invalid Password",
            description: "Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, and one number.",
        });
        return;
    }

    if (password !== confirmPassword) {
        activityLog.warn({ user: userId, role: role, action: 'signup_fail_password_mismatch' });
        toast({
            variant: "destructive",
            title: "Passwords Do Not Match",
            description: "Please ensure your passwords match.",
        });
        return;
    }

    if (!gender) {
        toast({
            variant: "destructive",
            title: "Gender not selected",
            description: "Please select your gender.",
        });
        return;
    }

    // Check if user already exists
    const userExists = userDB.findUser(userId, role);

    if (userExists) {
        activityLog.warn({ user: userId, role: role, action: 'signup_fail_exists' });
        toast({
            variant: "destructive",
            title: "Account Already Exists",
            description: (
                <div className="flex flex-col gap-2">
                   <p>An account with these details already exists.</p>
                   <div className="flex gap-2">
                     <Button size="sm" asChild>
                       <Link href="/">Login Instead</Link>
                     </Button>
                      <Button size="sm" variant="outline" asChild>
                       <Link href="/forgot-password">Forgot Password?</Link>
                     </Button>
                   </div>
                </div>
            )
        });
        return;
    }
    
    // Add user to our "DB"
    const result = userDB.addUser({
        id: userId,
        role,
        fullName,
        email,
        phone,
        faceIdEnabled: enableFaceId,
        gender,
    }, password);

    if (!result.success) {
        activityLog.error({ user: userId, role, action: 'signup_fail_db_error', details: { error: result.error }});
        toast({
            variant: "destructive",
            title: "Sign-up failed",
            description: result.error,
        });
        return;
    }

    if (enableFaceId) {
        activityLog.info({ user: userId, role: role, action: 'signup_redirect_faceid' });
        router.push('/face-id-setup');
    } else {
        toast({
            title: "Account Created!",
            description: "Please log in with your credentials.",
        });
        activityLog.info({ user: userId, role: role, action: 'signup_success' });
        router.push('/');
    }
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-8 bg-background">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex justify-center items-center mb-4">
              <div className="bg-primary text-primary-foreground rounded-full p-3">
                  <UserPlus className="h-8 w-8" />
              </div>
          </div>
          <CardTitle className="text-2xl font-headline">Create an Account</CardTitle>
          <CardDescription>Join the FUTA Admissions Companion</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSignUp} className="space-y-4">
              <div className="space-y-2">
                  <Label>Select Your Role</Label>
                  <RadioGroup defaultValue="applicant" onValueChange={(v) => setRole(v as 'applicant' | 'admin')} className="flex space-x-4">
                      <div className="flex items-center space-x-2">
                          <RadioGroupItem value="applicant" id="applicant" />
                          <Label htmlFor="applicant">Applicant</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                          <RadioGroupItem value="admin" id="admin" />
                          <Label htmlFor="admin">Admin</Label>
                      </div>
                  </RadioGroup>
              </div>

              <div className="space-y-2">
                <Label htmlFor="full-name">Full Name</Label>
                <Input id="full-name" type="text" placeholder="e.g., John Doe" required value={fullName} onChange={(e) => setFullName(e.target.value)} />
              </div>

              <div className="space-y-2">
                  <Label htmlFor="id-number">{role === 'applicant' ? 'JAMB Registration Number' : 'FUTA Staff ID'}</Label>
                  <Input id="id-number" type="text" placeholder={role === 'applicant' ? 'e.g., 12345678AB' : 'e.g., admin@futa.edu.ng'} required value={userId} onChange={(e) => setUserId(e.target.value)} />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <Input id="email" type="email" placeholder="you@example.com" required value={email} onChange={(e) => setEmail(e.target.value)}/>
                </div>
                <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input id="phone" type="tel" placeholder="08012345678" required value={phone} onChange={(e) => setPhone(e.target.value)}/>
                </div>
              </div>

              <div className="space-y-2">
                  <Label>Gender</Label>
                  <RadioGroup onValueChange={(v) => setGender(v as 'male' | 'female')} className="flex space-x-4">
                      <div className="flex items-center space-x-2">
                          <RadioGroupItem value="male" id="male" />
                          <Label htmlFor="male">Male</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                          <RadioGroupItem value="female" id="female" />
                          <Label htmlFor="female">Female</Label>
                      </div>
                  </RadioGroup>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <Input id="password" type="password" required value={password} onChange={(e) => setPassword(e.target.value)} />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="confirm-password">Confirm Password</Label>
                    <Input id="confirm-password" type="password" required value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
                </div>
              </div>
               
              <div className="flex items-center justify-between space-x-2 rounded-md border p-4 shadow">
                <div className="flex items-center space-x-2">
                    <Fingerprint className="text-primary"/>
                    <Label htmlFor="face-id-switch">Enable Face ID Login</Label>
                </div>
                <Switch 
                    id="face-id-switch"
                    checked={enableFaceId}
                    onCheckedChange={setEnableFaceId}
                />
              </div>

              <div className="flex items-start space-x-2 pt-2">
                <Checkbox id="terms" required />
                <div className="grid gap-1.5 leading-none">
                    <label
                    htmlFor="terms"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                    I agree to the terms and conditions.
                    </label>
                    <p className="text-sm text-muted-foreground">
                    You agree to our data privacy policy.
                    </p>
                </div>
              </div>
            
              <Button type="submit" className="w-full">
                Create Account
              </Button>
          </form>
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
