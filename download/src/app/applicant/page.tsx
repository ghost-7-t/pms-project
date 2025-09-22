
"use client";

import { useState, useEffect } from 'react';
import ApplicantHeader from '@/components/applicant/header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Bell, FileText, BarChart2, CheckCircle, Award, GitBranch } from 'lucide-react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { userDB } from '@/lib/user-db';


export default function ApplicantPage() {
  const [userName, setUserName] = useState('Applicant');
  const searchParams = useSearchParams();

  useEffect(() => {
    const id = searchParams.get('userId');
    if (id) {
        const user = userDB.findUser(id, 'applicant');
        if (user) {
            setUserName(user.fullName);
        }
    }
  }, [searchParams]);

  const features = [
    { title: 'Submit Transcripts', href: '/applicant/scores', icon: FileText, description: 'Input your JAMB and SSCE details.' },
    { title: 'Check Eligibility', href: '/applicant/eligibility', icon: CheckCircle, description: 'Verify if you meet the requirements.' },
    { title: 'View Admission Status', href: '/applicant/status', icon: BarChart2, description: 'See your admission prediction and rank.' },
    { title: 'Supplementary Options', href: '/applicant/supplementary', icon: GitBranch, description: 'Explore alternative departments.' },
    { title: 'Fairness Stats', href: '/applicant/fairness', icon: Award, description: 'View statistics on admission fairness.' },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <ApplicantHeader />
      <main className="flex-1 p-4 sm:p-6 md:p-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold font-headline">Welcome, {userName}</h1>
              <p className="text-muted-foreground">Manage your admission process here.</p>
            </div>
            <Button variant="outline" size="icon">
              <Bell className="h-5 w-5" />
              <span className="sr-only">Notifications</span>
            </Button>
          </div>

          <Card className="mb-8 border-primary/50 bg-primary/5">
              <CardHeader>
                  <CardTitle className="flex items-center">
                      <Bell className="h-5 w-5 mr-2 text-primary"/>
                      Notifications
                  </CardTitle>
              </CardHeader>
              <CardContent>
                  <p>Your admission list has been updated!</p>
              </CardContent>
          </Card>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((feature) => (
              <Card key={feature.title} className="hover:shadow-lg transition-shadow">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-lg font-medium">{feature.title}</CardTitle>
                  <feature.icon className="w-6 h-6 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">{feature.description}</p>
                  <Button className="w-full" asChild>
                    <Link href={feature.href}>Go to {feature.title}</Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
