
import Header from '@/components/dashboard/header';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Settings, BarChart3, ShieldCheck, Users, Bell, ArrowRight, CheckCircle, Building, FileClock } from 'lucide-react';
import Link from 'next/link';

const StatCard = ({ title, value, icon: Icon }: { title: string, value: string, icon: React.ElementType }) => (
    <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">{title}</CardTitle>
            <Icon className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
            <div className="text-2xl font-bold">{value}</div>
        </CardContent>
    </Card>
);


export default function DashboardPage() {

  const features = [
    { title: 'Set Quotas', href: '/dashboard/quotas', icon: Settings, description: 'Set and update admission quotas for all departments.' },
    { title: 'View Monitoring Stats', href: '/dashboard/monitoring', icon: BarChart3, description: 'Analyze admission trends and applicant data.' },
    { title: 'Check Fairness', href: '/dashboard/fairness', icon: ShieldCheck, description: 'Review fairness metrics and ensure equity.' },
    { title: 'Manage Applicants', href: '/dashboard/applicants', icon: Users, description: 'Review and manage individual applicant profiles.' },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header />
      <main className="flex-1 p-4 sm:p-6 md:p-8">
        <div className="max-w-7xl mx-auto">
            <h1 className="text-3xl font-bold font-headline mb-6">Admin Dashboard</h1>
            
            <Card className="mb-8 border-primary/50 bg-primary/5">
              <CardHeader>
                  <CardTitle>
                    <div className="flex items-center">
                        <Bell className="h-5 w-5 mr-2 text-primary"/>
                        Notifications
                    </div>
                  </CardTitle>
              </CardHeader>
              <CardContent>
                  <p>Quota issue in Computer Science: demand exceeds available slots by 20%.</p>
              </CardContent>
          </Card>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
                <StatCard title="Total Applicants" value="5,000" icon={Users} />
                <StatCard title="Eligible Applicants" value="3,000" icon={CheckCircle} />
                <StatCard title="Departments" value="15" icon={Building} />
                <StatCard title="Pending Reviews" value="120" icon={FileClock} />
            </div>

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                {features.map((feature) => (
                <Card key={feature.title} className="hover:shadow-lg transition-shadow flex flex-col">
                    <CardHeader>
                        <CardTitle>
                            <div className="flex items-start gap-4">
                                <div className="bg-primary/10 text-primary p-2 rounded-lg">
                                    <feature.icon className="w-6 h-6" />
                                </div>
                                <span>{feature.title}</span>
                            </div>
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="flex-grow">
                    <p className="text-sm text-muted-foreground">{feature.description}</p>
                    </CardContent>
                    <CardFooter>
                         <Button className="w-full" asChild>
                            <Link href={feature.href}>
                                Go to {feature.title}
                                <ArrowRight className="ml-auto"/>
                            </Link>
                        </Button>
                    </CardFooter>
                </Card>
                ))}
            </div>
        </div>
      </main>
    </div>
  );
}
