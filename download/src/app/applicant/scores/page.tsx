
"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Loader2, CheckCircle, AlertCircle, Calculator, Upload, FileUp, Home } from "lucide-react";
import Link from 'next/link';

import ApplicantHeader from "@/components/applicant/header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import { activityLog } from "@/lib/activity-log";

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp", "application/pdf"];

const gradeToPoints: { [key: string]: number } = {
  "A1": 80, "B2": 72, "B3": 64, "C4": 56, "C5": 48, "C6": 40, "D7": 32, "E8": 24, "F9": 0
};
const gradesEnum = z.enum(Object.keys(gradeToPoints) as [string, ...string[]]);

const ALL_SSCE_SUBJECTS = [
    "math", "english", "physics", "chemistry", "biology",
    "agric", "economics", "government", "geography"
] as const;

const formSchema = z.object({
  jambScore: z.coerce.number().min(0, "Score must be positive").max(400, "Score cannot exceed 400"),
  department: z.string().min(1, "Please select a department"),
  physicallyChallenged: z.boolean().default(false),
  jambResultSlip: z.any()
    .refine((files) => files?.length == 1, "JAMB Result Slip is required.")
    .refine((files) => files?.[0]?.size <= MAX_FILE_SIZE, `Max file size is 5MB.`)
    .refine(
      (files) => ACCEPTED_IMAGE_TYPES.includes(files?.[0]?.type),
      ".jpg, .jpeg, .png, .webp and .pdf files are accepted."
    ),
  ssceCertificate: z.any()
    .refine((files) => files?.length == 1, "SSCE Certificate is required.")
    .refine((files) => files?.[0]?.size <= MAX_FILE_SIZE, `Max file size is 5MB.`)
    .refine(
      (files) => ACCEPTED_IMAGE_TYPES.includes(files?.[0]?.type),
      ".jpg, .jpeg, .png, .webp and .pdf files are accepted."
    ),
  birthCertificate: z.any()
    .refine((files) => files?.length == 1, "Birth Certificate is required.")
    .refine((files) => files?.[0]?.size <= MAX_FILE_SIZE, `Max file size is 5MB.`)
    .refine(
      (files) => ACCEPTED_IMAGE_TYPES.includes(files?.[0]?.type),
      ".jpg, .jpeg, .png, .webp and .pdf files are accepted."
    ),
    // SSCE Subjects
    math: gradesEnum,
    english: gradesEnum,
    physics: gradesEnum,
    chemistry: gradesEnum,
    biology: gradesEnum,
    agric: gradesEnum.optional(),
    economics: gradesEnum.optional(),
    government: gradesEnum.optional(),
    geography: gradesEnum.optional(),
});

type FormValues = z.infer<typeof formSchema>;

export default function ScoreInputPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<{ status: 'verified' | 'invalid'; totalScore: number } | null>(null);
  const router = useRouter();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      jambScore: 180,
      department: "",
      physicallyChallenged: false,
    },
  });

  async function onSubmit(values: FormValues) {
    setIsLoading(true);
    setResult(null);
    const logValues = { ...values, jambResultSlip: values.jambResultSlip[0].name, ssceCertificate: values.ssceCertificate[0].name, birthCertificate: values.birthCertificate[0].name };
    activityLog.info({ user: `applicant_${values.jambScore}`, role: 'applicant', action: 'submit_scores', details: logValues });
    
    // Simulate API call and calculation
    await new Promise(resolve => setTimeout(resolve, 1500));

    const ssceScores = ALL_SSCE_SUBJECTS
        .map(subject => values[subject])
        .filter((grade): grade is string => !!grade)
        .map(grade => gradeToPoints[grade] || 0)
        .sort((a, b) => b - a);

    const best5Subjects = ssceScores.slice(0, 5);
    const ssceTotal = best5Subjects.reduce((sum, points) => sum + points, 0);

    const jambComponent = (values.jambScore / 400) * 75;
    const ssceComponent = (ssceTotal / 400) * 25; // Assuming max 5*80=400 points
    const bonus = values.physicallyChallenged ? 5 : 0;
    
    const totalScore = jambComponent + ssceComponent + bonus;

    const finalResult = {
      status: 'verified', // Mock verification
      totalScore: Math.round(totalScore * 100) / 100,
    };
    setResult(finalResult);
    activityLog.info({ user: `applicant_${values.jambScore}`, role: 'applicant', action: 'calculate_score_success', details: { ...logValues, calculatedScore: finalResult.totalScore } });

    setIsLoading(false);

    const query = new URLSearchParams(
      Object.entries(values).reduce((acc, [key, value]) => {
        if (key !== 'jambResultSlip' && key !== 'ssceCertificate' && key !== 'birthCertificate' && value) {
            acc[key] = String(value);
        }
        return acc;
      }, {} as Record<string, string>)
    );
    router.push(`/applicant/eligibility?${query.toString()}`);
  }

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <ApplicantHeader />
      <main className="flex-1 p-4 sm:p-6 md:p-8 flex justify-center">
        <div className="w-full max-w-4xl">
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Submit Your Transcripts</CardTitle>
                  <CardDescription>Provide your JAMB and SSCE results to calculate your admission score.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                   <div className="space-y-4">
                     <h3 className="text-lg font-medium">Core Information</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <FormField
                          control={form.control}
                          name="jambScore"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>JAMB UTME Score</FormLabel>
                              <FormControl>
                                <Input type="number" placeholder="Enter score out of 400" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                         <FormField
                            control={form.control}
                            name="department"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Department</FormLabel>
                                 <Select onValueChange={field.onChange} defaultValue={field.value}>
                                  <FormControl>
                                    <SelectTrigger>
                                      <SelectValue placeholder="Select your desired department" />
                                    </SelectTrigger>
                                  </FormControl>
                                  <SelectContent>
                                    <SelectItem value="computer-science-soc">Computer Science (SOC)</SelectItem>
                                    <SelectItem value="mechanical-engineering-seet">Mechanical Engineering (SEET)</SelectItem>
                                    <SelectItem value="civil-engineering-seet">Civil Engineering (SEET)</SelectItem>
                                    <SelectItem value="food-science-tech-saat">Food Science & Technology (SAAT)</SelectItem>
                                  </SelectContent>
                                </Select>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                      </div>
                  </div>

                  <Separator />

                  <div>
                     <h3 className="text-lg font-medium mb-4">O'Level (SSCE) Grades</h3>
                     <p className="text-sm text-muted-foreground mb-4">Enter grades for all relevant subjects. At least 5 are required, including Mathematics and English. Your best 5 scores will be used for calculation.</p>
                     <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                        {ALL_SSCE_SUBJECTS.map((subject) => (
                           <FormField
                            key={subject}
                            control={form.control}
                            name={subject}
                            render={({ field }) => (
                                <FormItem>
                                <FormLabel className="capitalize">{subject.replace('crk', 'CRK').replace('irk', 'IRK')}</FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <FormControl>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Grade" />
                                    </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        {Object.keys(gradeToPoints).map(grade => (
                                            <SelectItem key={grade} value={grade}>{grade}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <FormMessage />
                                </FormItem>
                            )}
                            />
                        ))}
                     </div>
                  </div>
                  
                  <Separator />

                   <div>
                     <h3 className="text-lg font-medium mb-4">Upload Documents</h3>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <FormField
                          control={form.control}
                          name="jambResultSlip"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>JAMB Result Slip</FormLabel>
                              <FormControl>
                                <div className="relative">
                                    <Upload className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
                                    <Input type="file" className="pl-10" onChange={(e) => field.onChange(e.target.files)} />
                                </div>
                              </FormControl>
                              <FormDescription>PDF, PNG, JPG accepted (Max 5MB).</FormDescription>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                         <FormField
                          control={form.control}
                          name="ssceCertificate"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>SSCE Certificate</FormLabel>
                              <FormControl>
                                 <div className="relative">
                                    <Upload className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
                                    <Input type="file" className="pl-10" onChange={(e) => field.onChange(e.target.files)} />
                                 </div>
                              </FormControl>
                               <FormDescription>PDF, PNG, JPG accepted (Max 5MB).</FormDescription>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="birthCertificate"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Birth Certificate</FormLabel>
                              <FormControl>
                                 <div className="relative">
                                    <Upload className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
                                    <Input type="file" className="pl-10" onChange={(e) => field.onChange(e.target.files)} />
                                 </div>
                              </FormControl>
                               <FormDescription>PDF, PNG, JPG accepted (Max 5MB).</FormDescription>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                  </div>

                  <Separator />

                   <FormField
                    control={form.control}
                    name="physicallyChallenged"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4 shadow">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                          <FormLabel>
                            I am a physically challenged applicant.
                          </FormLabel>
                        </div>
                      </FormItem>
                    )}
                  />
                </CardContent>
                <CardFooter className="flex-col items-start gap-4">
                    <div className="flex gap-4 items-center">
                         <Button type="submit" disabled={isLoading}>
                            {isLoading ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Verifying & Calculating...
                            </>
                            ) : (
                            <>
                                <FileUp className="mr-2 h-4 w-4" />
                                Submit Application
                            </>
                            )}
                        </Button>
                        <Button variant="outline" asChild>
                            <Link href="/applicant"><Home className="mr-2"/> Back to Home</Link>
                        </Button>
                    </div>
                   {result && (
                      <div className="w-full rounded-lg border bg-accent/20 p-4 animate-in fade-in">
                          <div className="flex items-center gap-4 mb-2">
                              <h4 className="font-semibold text-foreground">Calculation Result</h4>
                              <span className={`flex items-center text-sm font-medium ${result.status === 'verified' ? 'text-green-600' : 'text-red-600'}`}>
                                {result.status === 'verified' ? <CheckCircle className="mr-2 h-4 w-4"/> : <AlertCircle className="mr-2 h-4 w-4"/>}
                                {result.status === 'verified' ? "Scores Verified" : "Invalid Scores"}
                              </span>
                          </div>
                          <p className="text-sm text-foreground/80">
                            Your calculated Total Score is: <strong className="text-lg">{result.totalScore}</strong>. Proceeding to check eligibility...
                          </p>
                      </div>
                  )}
                </CardFooter>
              </Card>
            </form>
          </Form>
        </div>
      </main>
    </div>
  );
}

    

    