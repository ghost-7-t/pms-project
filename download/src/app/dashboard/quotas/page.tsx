
"use client";

import { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Edit, Save, Settings, Home } from 'lucide-react';
import Header from '@/components/dashboard/header';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { activityLog } from '@/lib/activity-log';

const departments = [
    { id: "computer-science-soc", name: "Computer Science", school: "SOC", quota: 100, filled: 45 },
    { id: "mechanical-engineering-seet", name: "Mechanical Engineering", school: "SEET", quota: 75, filled: 60 },
    { id: "civil-engineering-seet", name: "Civil Engineering", school: "SEET", quota: 80, filled: 80 },
    { id: "food-science-tech-saat", name: "Food Science & Technology", school: "SAAT", quota: 60, filled: 30 },
    { id: "software-engineering-soc", name: "Software Engineering", school: "SOC", quota: 90, filled: 20 },
    { id: "information-technology-soc", name: "Information Technology", school: "SOC", quota: 90, filled: 85 },
];

type Department = typeof departments[0] & {
    merit: number;
    catchment: number;
    elds: number;
};


export default function QuotaManagementPage() {
    const [departmentData, setDepartmentData] = useState<Department[]>(
        departments.map(d => ({
            ...d,
            merit: Math.floor(d.quota * 0.45),
            catchment: Math.floor(d.quota * 0.35),
            elds: Math.ceil(d.quota * 0.20),
        }))
    );
    const [editingId, setEditingId] = useState<string | null>(null);
    const [currentValue, setCurrentValue] = useState(0);

    const handleEdit = (dept: Department) => {
        setEditingId(dept.id);
        setCurrentValue(dept.quota);
        activityLog.info({ role: 'admin', action: 'edit_quota_start', details: { departmentId: dept.id, departmentName: dept.name } });
    };

    const handleSave = (id: string) => {
        const originalDept = departmentData.find(d => d.id === id);
        activityLog.info({ role: 'admin', action: 'edit_quota_save', details: { departmentId: id, oldQuota: originalDept?.quota, newQuota: currentValue } });
        
        setDepartmentData(prevData =>
            prevData.map(d => {
                if (d.id === id) {
                    const newQuota = currentValue;
                    return {
                        ...d,
                        quota: newQuota,
                        merit: Math.floor(newQuota * 0.45),
                        catchment: Math.floor(newQuota * 0.35),
                        elds: Math.ceil(newQuota * 0.20),
                    };
                }
                return d;
            })
        );
        setEditingId(null);
    };

    return (
    <div className="flex flex-col min-h-screen bg-background">
        <Header />
        <main className="flex-1 p-4 sm:p-6 md:p-8">
            <div className="max-w-6xl mx-auto">
                <div className="mb-6">
                    <h1 className="text-3xl font-bold font-headline flex items-center gap-2">
                        <Settings className="h-8 w-8 text-primary"/>
                        Quota Management
                    </h1>
                    <p className="text-muted-foreground">Set and monitor admission quotas for all departments.</p>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>Department Quotas</CardTitle>
                        <CardDescription>
                           Quotas are split as 45% Merit, 35% Catchment, and 20% ELDS/Physically Challenged.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Department</TableHead>
                                    <TableHead className="text-center">Total Quota</TableHead>
                                    <TableHead className="text-center">Merit</TableHead>
                                    <TableHead className="text-center">Catchment</TableHead>
                                    <TableHead className="text-center">ELDS/PC</TableHead>
                                    <TableHead>Allocation Status</TableHead>
                                    <TableHead className="text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {departmentData.map(dept => (
                                    <TableRow key={dept.id}>
                                        <TableCell>
                                            <div className="font-medium">{dept.name}</div>
                                            <div className="text-sm text-muted-foreground">{dept.school}</div>
                                        </TableCell>
                                        <TableCell className="text-center">
                                            {editingId === dept.id ? (
                                                <Input
                                                    type="number"
                                                    value={currentValue}
                                                    onChange={(e) => setCurrentValue(parseInt(e.target.value, 10) || 0)}
                                                    className="w-24 mx-auto"
                                                />
                                            ) : (
                                                <Badge variant="secondary" className="text-lg">{dept.quota}</Badge>
                                            )}
                                        </TableCell>
                                        <TableCell className="text-center">{dept.merit}</TableCell>
                                        <TableCell className="text-center">{dept.catchment}</TableCell>
                                        <TableCell className="text-center">{dept.elds}</TableCell>
                                        <TableCell>
                                            <div className="flex flex-col gap-1">
                                                <Progress value={(dept.filled / dept.quota) * 100} className="h-2" />
                                                <span className="text-xs text-muted-foreground">{dept.filled} / {dept.quota} slots filled</span>
                                            </div>
                                        </TableCell>
                                        <TableCell className="text-right">
                                            {editingId === dept.id ? (
                                                <Button size="sm" onClick={() => handleSave(dept.id)}>
                                                    <Save className="mr-2 h-4 w-4" /> Save
                                                </Button>
                                            ) : (
                                                <Button size="sm" variant="outline" onClick={() => handleEdit(dept)}>
                                                    <Edit className="mr-2 h-4 w-4" /> Edit
                                                </Button>
                                            )}
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
                 <div className="flex justify-center mt-8">
                     <Button asChild variant="outline">
                        <Link href="/dashboard">
                           <Home className="mr-2 h-4 w-4"/>
                           Back to Dashboard
                        </Link>
                    </Button>
                </div>
            </div>
        </main>
    </div>
  );
}
