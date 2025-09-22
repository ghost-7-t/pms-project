
"use client";

import Link from 'next/link';
import { Award, BarChart, FileText, GitBranch, Home, Percent, Target, Users } from 'lucide-react';
import ApplicantHeader from '@/components/applicant/header';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { useSearchParams } from 'next/navigation';

const MetricCard = ({ icon, title, value, footer }: { icon: React.ReactNode, title: string, value: string, footer: string }) => (
    <Card className="bg-accent/20 border-accent/50">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">{title}</CardTitle>
            {icon}
        </CardHeader>
        <CardContent>
            <div className="text-2xl font-bold">{value}</div>
            <p className="text-xs text-muted-foreground">{footer}</p>
        </CardContent>
    </Card>
)

export default function AdmissionStatusPage() {
  const searchParams = useSearchParams();
  const admissionChance = 85;
  const totalScore = 82.38; // This would be calculated or fetched

  return (
    <div className="flex flex-col min-h-screen bg-background">
        <ApplicantHeader />
        <main className="flex-1 p-4 sm:p-6 md:p-8">
            <div className="max-w-4xl mx-auto">
                <div className="mb-6">
                    <h1 className="text-3xl font-bold font-headline">Admission Status</h1>
                    <p className="text-muted-foreground">Results for Computer Science (SOC)</p>
                </div>

                <Card className="mb-8">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Percent className="h-6 w-6 text-primary" />
                            Admission Prediction
                        </CardTitle>
                        <CardDescription>Your estimated chance of admission based on our AI model.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="text-center">
                            <p className="text-6xl font-bold text-primary">{admissionChance}%</p>
                            <p className="text-lg text-muted-foreground">Chance of Admission</p>
                        </div>
                        <Progress value={admissionChance} className="w-full" />
                         <p className="text-sm text-center text-muted-foreground">
                            This prediction is based on your Total Score and historical admission data.
                        </p>
                    </CardContent>
                </Card>

                <div className="grid gap-6 md:grid-cols-2 mb-8">
                    <MetricCard 
                        icon={<Target className="w-5 h-5 text-muted-foreground" />}
                        title="Dynamic Cut-off"
                        value="65.0"
                        footer="Score of last admitted student"
                    />
                     <MetricCard 
                        icon={<FileText className="w-5 h-5 text-muted-foreground" />}
                        title="Your Total Score"
                        value={totalScore.toString()}
                        footer="JAMB + SSCE + Bonus"
                    />
                </div>
                
                <Card className="mb-8">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Users className="h-6 w-6 text-primary" />
                            Quota Details
                        </CardTitle>
                        <CardDescription>Admission distribution for Computer Science.</CardDescription>
                    </CardHeader>
                    <CardContent className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                        <div>
                            <p className="font-bold text-xl">100</p>
                            <p className="text-sm text-muted-foreground">Total Slots</p>
                        </div>
                         <div>
                            <p className="font-bold text-xl">45%</p>
                            <p className="text-sm text-muted-foreground">Merit</p>
                        </div>
                         <div>
                            <p className="font-bold text-xl">35%</p>
                            <p className="text-sm text-muted-foreground">Catchment</p>
                        </div>
                         <div>
                            <p className="font-bold text-xl">20%</p>
                            <p className="text-sm text-muted-foreground">ELDS/Disadvantaged</p>
                        </div>
                    </CardContent>
                </Card>
                
                <Card className="mb-8">
                    <CardHeader>
                        <CardTitle>Decision Factors</CardTitle>
                        <CardDescription>Key factors influencing your admission prediction.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <ul className="list-disc list-inside space-y-2 text-sm">
                            <li><span className="font-semibold">Maths grade (A1)</span> significantly boosted your score.</li>
                            <li><span className="font-semibold">JAMB score (300)</span> is well above the typical cut-off.</li>
                            <li>Your Total Score of {totalScore} is currently above the dynamic cut-off of 65.0.</li>
                        </ul>
                    </CardContent>
                </Card>


                <Separator className="my-8" />

                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Button asChild>
                        <Link href={`/applicant/supplementary?${searchParams.toString()}`}>
                            <GitBranch className="mr-2"/>
                            Supplementary Options
                        </Link>
                    </Button>
                     <Button asChild variant="outline">
                        <Link href="/applicant/fairness">
                             <Award className="mr-2"/>
                            Fairness Stats
                        </Link>
                    </Button>
                    <Button asChild variant="secondary">
                        <Link href="/applicant">
                            <Home className="mr-2"/>
                           Back to Home
                        </Link>
                    </Button>
                </div>
            </div>
        </main>
    </div>
  );
}
