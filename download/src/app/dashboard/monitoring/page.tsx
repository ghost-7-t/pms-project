
"use client";

import { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, BarChart3, Filter, Target, Users, Zap, Home } from 'lucide-react';
import Header from '@/components/dashboard/header';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ResponsiveContainer, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const applicantData = [
  { name: 'Comp Sci', applicants: 500, fill: 'var(--color-chart-2)' },
  { name: 'Mech Eng', applicants: 400, fill: 'var(--color-chart-1)' },
  { name: 'Civil Eng', applicants: 350, fill: 'var(--color-chart-3)' },
  { name: 'Food Sci', applicants: 280, fill: 'var(--color-chart-4)' },
  { name: 'Software Eng', applicants: 450, fill: 'var(--color-chart-5)' },
  { name: 'Info Tech', applicants: 420, fill: 'var(--color-chart-2)' },
];

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
);

export default function MonitoringStatsPage() {
    const [faculty, setFaculty] = useState('all');
    const [department, setDepartment] = useState('all');
    
  return (
    <div className="flex flex-col min-h-screen bg-background">
        <Header />
        <main className="flex-1 p-4 sm:p-6 md:p-8">
            <div className="max-w-6xl mx-auto">
                <div className="mb-6">
                    <h1 className="text-3xl font-bold font-headline flex items-center gap-2">
                        <BarChart3 className="h-8 w-8 text-primary"/>
                        Monitoring Statistics
                    </h1>
                    <p className="text-muted-foreground">Analyze admission trends and applicant data in real-time.</p>
                </div>
                
                 <Card className="mb-8">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                           <Filter className="h-6 w-6" />
                           Filters
                        </CardTitle>
                        <CardDescription>Filter the data by faculty or department to narrow down the results.</CardDescription>
                    </CardHeader>
                    <CardContent className="flex flex-col sm:flex-row gap-4">
                        <Select onValueChange={setFaculty} defaultValue={faculty}>
                            <SelectTrigger className="w-full sm:w-64">
                                <SelectValue placeholder="Filter by Faculty" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Faculties</SelectItem>
                                <SelectItem value="soc">School of Computing (SOC)</SelectItem>
                                <SelectItem value="seet">School of Engineering & Engineering Technology (SEET)</SelectItem>
                                <SelectItem value="saat">School of Agriculture & Agricultural Technology (SAAT)</SelectItem>
                            </SelectContent>
                        </Select>
                        <Select onValueChange={setDepartment} defaultValue={department}>
                            <SelectTrigger className="w-full sm:w-64">
                                <SelectValue placeholder="Filter by Department" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Departments</SelectItem>
                                <SelectItem value="computer-science-soc">Computer Science</SelectItem>
                                <SelectItem value="mechanical-engineering-seet">Mechanical Engineering</SelectItem>
                            </SelectContent>
                        </Select>
                    </CardContent>
                </Card>

                 <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
                    <MetricCard 
                        icon={<Users className="w-5 h-5 text-muted-foreground" />}
                        title="Eligible Applicants"
                        value="500"
                        footer="For Computer Science"
                    />
                    <MetricCard 
                        icon={<Target className="w-5 h-5 text-muted-foreground" />}
                        title="Dynamic Cut-off"
                        value="65.0"
                        footer="For Computer Science"
                    />
                     <MetricCard 
                        icon={<Users className="w-5 h-5 text-muted-foreground" />}
                        title="Quota Filled"
                        value="45 / 100"
                        footer="For Computer Science"
                    />
                    <MetricCard 
                        icon={<Zap className="w-5 h-5 text-muted-foreground" />}
                        title="Key Factor"
                        value="Maths Grade"
                        footer="Top score predictor"
                    />
                </div>

                 <Card className="mb-8">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                           <BarChart3 className="h-6 w-6" />
                           Eligible Applicants by Department
                        </CardTitle>
                        <CardDescription>Comparison of the number of eligible applicants across top departments.</CardDescription>
                    </CardHeader>
                    <CardContent>
                       <div className="h-80 w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={applicantData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="name" />
                                    <YAxis />
                                    <Tooltip
                                        cursor={{ fill: 'hsl(var(--accent) / 0.3)' }}
                                        formatter={(value) => `${value} applicants`}
                                    />
                                    <Legend />
                                    <Bar dataKey="applicants" name="Eligible Applicants" radius={[4, 4, 0, 0]} />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </CardContent>
                </Card>

                <div className="flex justify-center gap-4">
                     <Button asChild variant="outline">
                        <Link href="/dashboard">
                           <Home className="mr-2"/>
                           Back to Dashboard
                        </Link>
                    </Button>
                </div>
            </div>
        </main>
    </div>
  );
}
