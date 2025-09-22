
"use client";

import Link from 'next/link';
import { Award, BarChart, Home, Scale, ArrowLeft } from 'lucide-react';
import ApplicantHeader from '@/components/applicant/header';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ResponsiveContainer, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

const selectionRateData = [
  { name: 'Male', rate: 22, fill: 'var(--color-chart-2)' },
  { name: 'Female', rate: 20, fill: 'var(--color-chart-5)' },
];

const MetricCard = ({ title, value, description }: { title: string, value: string, description: string }) => (
    <Card className="bg-accent/20 border-accent/50">
        <CardHeader className="pb-2">
            <CardTitle className="text-lg">{title}</CardTitle>
        </CardHeader>
        <CardContent>
            <p className="text-3xl font-bold">{value}</p>
            <p className="text-sm text-muted-foreground">{description}</p>
        </CardContent>
    </Card>
)

export default function FairnessStatsPage() {
  return (
    <div className="flex flex-col min-h-screen bg-background">
        <ApplicantHeader />
        <main className="flex-1 p-4 sm:p-6 md:p-8">
            <div className="max-w-4xl mx-auto">
                <div className="mb-6">
                    <h1 className="text-3xl font-bold font-headline flex items-center gap-2">
                        <Award className="h-8 w-8 text-primary"/>
                        Fairness & Transparency Report
                    </h1>
                    <p className="text-muted-foreground">Ensuring equitable treatment for all applicants.</p>
                </div>

                <Card className="mb-8">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                           <Scale className="h-6 w-6" />
                           Disparate Impact Analysis
                        </CardTitle>
                        <CardDescription>This ratio helps us ensure that selection rates are fair across different groups. A ratio above 0.8 is generally considered equitable.</CardDescription>
                    </CardHeader>
                    <CardContent className="grid gap-6 md:grid-cols-3">
                         <MetricCard 
                            title="Gender"
                            value="0.90"
                            description="Female rate vs. Male rate"
                        />
                         <MetricCard 
                            title="State of Origin"
                            value="0.95"
                            description="Lowest vs. Highest state rate"
                        />
                         <MetricCard 
                            title="Physically Challenged"
                            value="1.10"
                            description="PC rate vs. Non-PC rate"
                        />
                    </CardContent>
                </Card>
                
                 <Card className="mb-8">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                           <BarChart className="h-6 w-6" />
                           Selection Rate by Gender
                        </CardTitle>
                        <CardDescription>The percentage of applicants admitted from different gender groups.</CardDescription>
                    </CardHeader>
                    <CardContent>
                       <div className="h-64 w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={selectionRateData} layout="vertical" margin={{ left: 10 }}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis type="number" domain={[0, 100]} unit="%" />
                                    <YAxis type="category" dataKey="name" width={60} />
                                    <Tooltip
                                        cursor={{ fill: 'hsl(var(--accent) / 0.3)' }}
                                        formatter={(value) => `${value}%`}
                                    />
                                    <Bar dataKey="rate" name="Selection Rate" barSize={40} radius={[0, 4, 4, 0]} />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </CardContent>
                </Card>


                <div className="flex justify-center gap-4">
                     <Button asChild>
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
