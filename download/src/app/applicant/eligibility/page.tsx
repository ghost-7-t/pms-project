
"use client";

import React, { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { CheckCircle, XCircle, FileText, ArrowRight, Home } from 'lucide-react';

import ApplicantHeader from '@/components/applicant/header';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';

const gradeToPoints: { [key: string]: number } = {
  "A1": 80, "B2": 72, "B3": 64, "C4": 56, "C5": 48, "C6": 40, "D7": 32, "E8": 24, "F9": 0
};

const creditGrades = ["A1", "B2", "B3", "C4", "C5", "C6"];

const departmentRequirements: { [key: string]: { school: string; subjects: string[] } } = {
  "computer-science-soc": { school: "SOC", subjects: ["math", "english", "physics", "chemistry"] },
  "mechanical-engineering-seet": { school: "SEET", subjects: ["math", "english", "physics", "chemistry"] },
  "civil-engineering-seet": { school: "SEET", subjects: ["math", "english", "physics", "chemistry"] },
  "food-science-tech-saat": { school: "SAAT", subjects: ["math", "english", "chemistry", "biology"] },
};

function EligibilityCheck() {
  const searchParams = useSearchParams();
  const department = searchParams.get('department') || '';
  const jambScore = Number(searchParams.get('jambScore'));

  const subjectEntries = Object.entries(departmentRequirements[department]?.subjects || {});
  const subjectGrades = subjectEntries.map(([_, subject]) => searchParams.get(subject as string) || '');
  
  const deptName = department.split('-').slice(0, -1).map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
  const school = departmentRequirements[department]?.school;
  const requiredSubjects = departmentRequirements[department]?.subjects || [];

  const hasMinimumJamb = jambScore >= 180;
  const creditCount = subjectGrades.filter(grade => creditGrades.includes(grade)).length;
  const has5Credits = creditCount >= 5;

  const isEligible = hasMinimumJamb && has5Credits;

  if (!department) {
     return (
        <Card className="w-full max-w-2xl">
            <CardHeader>
                <CardTitle>Check Your Eligibility</CardTitle>
                <CardDescription>Please first submit your transcripts to check your admission eligibility.</CardDescription>
            </CardHeader>
            <CardContent>
                <Button asChild>
                    <Link href="/applicant/scores">
                        <FileText className="mr-2 h-4 w-4" />
                        Submit Transcripts
                    </Link>
                </Button>
            </CardContent>
        </Card>
     )
  }

  return (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          {isEligible ? <CheckCircle className="h-8 w-8 text-green-600" /> : <XCircle className="h-8 w-8 text-red-600" />}
          Eligibility Status
        </CardTitle>
        <CardDescription>
            Screening results for {deptName} ({school}).
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className={`p-4 rounded-md ${isEligible ? 'bg-green-100/80 border-green-400' : 'bg-red-100/80 border-red-400'} border`}>
          <h3 className="font-semibold text-lg mb-2">
            {isEligible ? `Congratulations! You are eligible for ${deptName}.` : `Unfortunately, you are not eligible for ${deptName}.`}
          </h3>
          <p className="text-sm">
            {isEligible ? "You may proceed to the next stage to view your admission status." : "Please review the requirements or consider other departments."}
          </p>
        </div>

        <div>
            <h4 className="font-semibold mb-2">Department Requirements:</h4>
            <ul className="list-disc list-inside space-y-1 text-sm">
                <li>JAMB Score >= 180: <Badge variant={hasMinimumJamb ? 'default' : 'destructive'}>{jambScore}</Badge></li>
                <li>5 Credits in core subjects: <Badge variant={has5Credits ? 'default' : 'destructive'}>{creditCount} credits</Badge></li>
            </ul>
        </div>
        
         <div>
            <h4 className="font-semibold mb-2">Core Subjects for {deptName}:</h4>
            <div className="flex flex-wrap gap-2">
                {requiredSubjects.map(subject => (
                    <Badge key={subject} variant="secondary" className="capitalize">{subject}</Badge>
                ))}
            </div>
        </div>
        
        <div className="flex gap-4">
          {isEligible ? (
            <Button asChild>
              <Link href={`/applicant/status?${searchParams.toString()}`}>
                View Admission Status <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          ) : (
             <Button asChild>
              <Link href={`/applicant/supplementary?${searchParams.toString()}`}>
                Explore Supplementary Options <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          )}
           <Button variant="outline" asChild>
              <Link href="/applicant">
                <Home className="mr-2"/>
                Back to Home
              </Link>
            </Button>
        </div>
      </CardContent>
    </Card>
  );
}

function EligibilityPageSkeleton() {
    return (
        <Card className="w-full max-w-2xl">
            <CardHeader>
                <Skeleton className="h-8 w-48" />
                <Skeleton className="h-4 w-64" />
            </CardHeader>
            <CardContent className="space-y-6">
                <Skeleton className="h-24 w-full" />
                <div className="space-y-2">
                    <Skeleton className="h-6 w-40" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-full" />
                </div>
                <div className="space-y-2">
                    <Skeleton className="h-6 w-56" />
                     <div className="flex flex-wrap gap-2">
                        <Skeleton className="h-6 w-20" />
                        <Skeleton className="h-6 w-20" />
                        <Skeleton className="h-6 w-20" />
                     </div>
                </div>
                <div className="flex gap-4">
                    <Skeleton className="h-10 w-40" />
                    <Skeleton className="h-10 w-28" />
                </div>
            </CardContent>
        </Card>
    )
}

export default function EligibilityPage() {
    return (
        <div className="flex flex-col min-h-screen bg-background">
            <ApplicantHeader />
            <main className="flex-1 p-4 sm:p-6 md:p-8 flex justify-center items-start">
                <Suspense fallback={<EligibilityPageSkeleton />}>
                    <EligibilityCheck />
                </Suspense>
            </main>
        </div>
    );
}
