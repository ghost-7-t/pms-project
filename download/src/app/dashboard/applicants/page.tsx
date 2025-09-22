
"use client";

import Link from 'next/link';
import { ArrowLeft, Edit, Eye, Filter, Search, Trash2, Users, FileDown, Home } from 'lucide-react';
import Header from '@/components/dashboard/header';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator } from '@/components/ui/dropdown-menu';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const applicants = [
    { id: "12345678AB", name: "John Doe", department: "Computer Science", totalScore: 82.38, status: "Eligible" },
    { id: "87654321BA", name: "Jane Smith", department: "Mechanical Engineering", totalScore: 75.10, status: "Eligible" },
    { id: "11223344CD", name: "Samuel Green", department: "Civil Engineering", totalScore: 68.50, status: "Not Eligible" },
    { id: "55667788DE", name: "Emily White", department: "Food Science & Technology", totalScore: 78.90, status: "Eligible" },
    { id: "99887766FE", name: "Chris Black", department: "Software Engineering", totalScore: 91.20, status: "Eligible" },
];

export default function ManageApplicantsPage() {
    return (
        <div className="flex flex-col min-h-screen bg-background">
            <Header />
            <main className="flex-1 p-4 sm:p-6 md:p-8">
                <div className="max-w-7xl mx-auto">
                    <div className="mb-6">
                        <h1 className="text-3xl font-bold font-headline flex items-center gap-2">
                            <Users className="h-8 w-8 text-primary"/>
                            Manage Applicants
                        </h1>
                        <p className="text-muted-foreground">View, filter, and manage all applicant profiles.</p>
                    </div>

                    <Card>
                        <CardHeader>
                            <CardTitle>Applicant List</CardTitle>
                            <CardDescription>
                                A list of all applicants who have submitted their details.
                            </CardDescription>
                             <div className="flex items-center gap-4 pt-4">
                                <div className="relative w-full md:w-1/3">
                                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                                    <Input placeholder="Search applicants by name or ID..." className="pl-10" />
                                </div>
                                <Select defaultValue="all">
                                    <SelectTrigger className="w-full sm:w-48">
                                        <SelectValue placeholder="Filter by Department" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">All Departments</SelectItem>
                                        <SelectItem value="computer-science-soc">Computer Science</SelectItem>
                                        <SelectItem value="mechanical-engineering-seet">Mechanical Engineering</SelectItem>
                                    </SelectContent>
                                </Select>
                                <Select defaultValue="all">
                                    <SelectTrigger className="w-full sm:w-48">
                                        <SelectValue placeholder="Filter by Status" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">All Statuses</SelectItem>
                                        <SelectItem value="eligible">Eligible</SelectItem>
                                        <SelectItem value="not-eligible">Not Eligible</SelectItem>
                                    </SelectContent>
                                </Select>
                                <Button variant="outline">
                                    <FileDown className="mr-2"/>
                                    Export CSV
                                </Button>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Applicant ID</TableHead>
                                        <TableHead>Name</TableHead>
                                        <TableHead>Department</TableHead>
                                        <TableHead className="text-center">Total Score</TableHead>
                                        <TableHead className="text-center">Status</TableHead>
                                        <TableHead className="text-right">Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {applicants.map(applicant => (
                                        <TableRow key={applicant.id}>
                                            <TableCell className="font-mono">{applicant.id}</TableCell>
                                            <TableCell className="font-medium">{applicant.name}</TableCell>
                                            <TableCell>{applicant.department}</TableCell>
                                            <TableCell className="text-center font-semibold">{applicant.totalScore}</TableCell>
                                            <TableCell className="text-center">
                                                <Badge variant={applicant.status === 'Eligible' ? 'default' : 'destructive'}>
                                                    {applicant.status}
                                                </Badge>
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <Button size="sm" variant="ghost" className="mr-2">
                                                    <Eye className="mr-2 h-4 w-4" /> View
                                                </Button>
                                                <Button size="sm" variant="ghost">
                                                    <Edit className="mr-2 h-4 w-4" /> Edit
                                                </Button>
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
