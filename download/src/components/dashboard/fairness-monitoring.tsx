
"use client";

import { BarChart, Users, Scale } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ResponsiveContainer, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

const data = [
  { name: 'Merit', 'Male': 40, 'Female': 45 },
  { name: 'Catchment', 'Male': 30, 'Female': 35 },
  { name: 'ELDS/Disadvantaged', 'Male': 20, 'Female': 25 },
];

export default function FairnessMonitoring() {
  return (
    <Card>
        <CardHeader>
            <CardTitle>Fairness & Monitoring</CardTitle>
            <CardDescription>Visualize admission statistics and fairness metrics.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
            <div className="space-y-4">
                <h3 className="font-semibold flex items-center"><BarChart className="mr-2 h-5 w-5" />Admission Statistics</h3>
                <div className="h-64 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={data}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="name" />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Bar dataKey="Male" fill="var(--color-chart-2)" />
                            <Bar dataKey="Female" fill="var(--color-chart-5)" />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>
            <div className="space-y-4">
                <h3 className="font-semibold flex items-center"><Scale className="mr-2 h-5 w-5" />Fairness Metrics</h3>
                <div className="grid gap-4 md:grid-cols-2">
                    <div className="p-4 bg-accent/20 rounded-lg">
                        <p className="text-sm font-medium text-foreground/80">Gender Admission Rate</p>
                        <p className="text-2xl font-bold">50% Male / 50% Female</p>
                    </div>
                    <div className="p-4 bg-accent/20 rounded-lg">
                        <p className="text-sm font-medium text-foreground/80">State-by-State Equality</p>
                        <p className="text-2xl font-bold">Balanced</p>
                    </div>
                </div>
            </div>
             <div className="space-y-4">
                <h3 className="font-semibold flex items-center"><Users className="mr-2 h-5 w-5" />Department Applicants</h3>
                 <div className="p-4 bg-accent/20 rounded-lg">
                    <p className="text-sm font-medium text-foreground/80">Eligible for Computer Science</p>
                    <p className="text-2xl font-bold">500 Applicants</p>
                </div>
            </div>
        </CardContent>
    </Card>
  );
}
