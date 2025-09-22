"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Loader2, Sparkles } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { getAdmissionSummary } from "@/app/dashboard/actions";
import type { AdmissionEligibilitySummaryOutput } from "@/ai/flows/admission-eligibility-summary";

const formSchema = z.object({
  predictedScore: z.coerce.number().min(0, "Score must be at least 0").max(100, "Score must be 100 or less"),
  academicBackground: z.string().min(20, { message: "Please provide more details on academic background." }),
  extracurricularActivities: z.string().min(20, { message: "Please provide more details on extracurriculars." }),
  personalStatement: z.string().min(50, { message: "Personal statement must be at least 50 characters." }),
});

export default function AdmissionSummary() {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<AdmissionEligibilitySummaryOutput | null>(null);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      predictedScore: 75,
      academicBackground: "",
      extracurricularActivities: "",
      personalStatement: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    setResult(null);

    const { data, error } = await getAdmissionSummary(values);

    if (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error,
      });
    } else {
      setResult(data);
    }
    setIsLoading(false);
  }

  return (
    <Card>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardHeader>
            <CardTitle>Admission Eligibility Summary</CardTitle>
            <CardDescription>Generate an AI-powered summary of an applicant's admission eligibility.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <FormField
              control={form.control}
              name="predictedScore"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Predicted Score (0-100)</FormLabel>
                  <FormControl>
                    <Input type="number" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="academicBackground"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Academic Background</FormLabel>
                  <FormControl>
                    <Textarea placeholder="e.g., WAEC results, relevant coursework..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="extracurricularActivities"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Extracurricular Activities</FormLabel>
                  <FormControl>
                    <Textarea placeholder="e.g., Club memberships, awards, volunteering..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
             <FormField
              control={form.control}
              name="personalStatement"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Personal Statement</FormLabel>
                  <FormControl>
                    <Textarea placeholder="The applicant's personal essay or statement." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
          <CardFooter className="flex-col items-start gap-4">
            <Button type="submit" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Sparkles className="mr-2 h-4 w-4" />
                  Generate Summary
                </>
              )}
            </Button>
            {result && (
                <div className="w-full rounded-lg border bg-accent/20 p-4 animate-in fade-in">
                    <h4 className="font-semibold mb-2 text-foreground">AI Generated Summary</h4>
                    <p className="text-sm text-foreground/80">{result.eligibilitySummary}</p>
                </div>
            )}
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
}
