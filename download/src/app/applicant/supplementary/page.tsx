
"use client";

import { Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { ArrowRight, CheckCircle, Home, XCircle } from 'lucide-react';
import ApplicantHeader from '@/components/applicant/header';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Skeleton } from '@/components/ui/skeleton';

const creditGrades = ["A1", "B2", "B3", "C4", "C5", "C6"];

const allDepartments: { [key: string]: { name: string; school: string; subjects: string[] } } = {
  "computer-science-soc": { name: "Computer Science", school: "SOC", subjects: ["math", "english", "physics", "chemistry"] },
  "mechanical-engineering-seet": { name: "Mechanical Engineering", school: "SEET", subjects: ["math", "english", "physics", "chemistry"] },
  "civil-engineering-seet": { name: "Civil Engineering", school: "SEET", subjects: ["math", "english", "physics", "chemistry"] },
  "food-science-tech-saat": { name: "Food Science & Technology", school: "SAAT", subjects: ["math", "english", "chemistry", "biology"] },
  "software-engineering-soc": { name: "Software Engineering", school: "SOC", subjects: ["math", "english", "physics", "chemistry"] },
  "information-technology-soc": { name: "Information Technology", school: "SOC", subjects: ["math", "english", "physics", "chemistry"] },
};

function SupplementaryOptions() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const jambScore = Number(searchParams.get('jambScore'));
  const originalDepartment = searchParams.get('department') || '';

  const handleApply = (deptKey: string) => {
    const newQuery = new URLSearchParams(searchParams.toString());
    newQuery.set('department', deptKey);
    router.push(`/applicant/status?${newQuery.toString()}`);
  };

  return (
    <Card className="w-full max-w-4xl">
      <CardHeader>
        <CardTitle>Supplementary Admission Options</CardTitle>
        <CardDescription>
          Explore other departments you may be eligible for based on your scores.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Department</TableHead>
              <TableHead>School</TableHead>
              <TableHead>Eligibility</TableHead>
              <TableHead className="text-right">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {Object.entries(allDepartments).map(([key, dept]) => {
              if (key === originalDepartment) return null;

              const requiredSubjects = dept.subjects;
              const subjectGrades = requiredSubjects.map(s => searchParams.get(s) || '');
              const creditCount = subjectGrades.filter(grade => creditGrades.includes(grade)).length;
              const has5Credits = creditCount >= 5;
              const hasMinimumJamb = jambScore >= 180;
              const isEligible = has5Credits && hasMinimumJamb;

              return (
                <TableRow key={key}>
                  <TableCell className="font-medium">{dept.name}</TableCell>
                  <TableCell>{dept.school}</TableCell>
                  <TableCell>
                    {isEligible ? (
                      <Badge variant="default" className="bg-green-600 hover:bg-green-700">
                        <CheckCircle className="mr-2 h-4 w-4" />
                        Eligible
                      </Badge>
                    ) : (
                      <Badge variant="destructive">
                        <XCircle className="mr-2 h-4 w-4" />
                        Not Eligible
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button onClick={() => handleApply(key)} disabled={!isEligible}>
                      Apply <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
        <div className="mt-6 flex justify-center">
            <Button asChild variant="secondary">
                <Link href="/applicant"><Home className="mr-2"/>Back to Home</Link>
            </Button>
        </div>
      </CardContent>
    </Card>
  );
}

function SupplementaryPageSkeleton() {
    return (
        <Card className="w-full max-w-4xl">
            <CardHeader>
                <Skeleton className="h-8 w-64" />
                <Skeleton className="h-4 w-96" />
            </CardHeader>
            <CardContent>
                <div className="space-y-2">
                    {[...Array(3)].map((_, i) => (
                         <div key={i} className="flex justify-between items-center p-2">
                            <div className="space-y-2">
                                <Skeleton className="h-5 w-48" />
                                <Skeleton className="h-4 w-24" />
                            </div>
                            <Skeleton className="h-10 w-24" />
                         </div>
                    ))}
                </div>
                 <div className="mt-6 flex justify-center">
                    <Skeleton className="h-10 w-36" />
                </div>
            </CardContent>
        </Card>
    )
}

export default function SupplementaryPage() {
    return (
        <div className="flex flex-col min-h-screen bg-background">
            <ApplicantHeader />
            <main className="flex-1 p-4 sm:p-6 md:p-8 flex justify-center items-start">
                <Suspense fallback={<SupplementaryPageSkeleton/>}>
                    <SupplementaryOptions />
                </Suspense>
            </main>
        </div>
    );
}
