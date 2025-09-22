"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Loader2, ShieldAlert, ShieldCheck } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { getScoreVerification } from "@/app/dashboard/actions";
import type { ScoreVerificationOutput } from "@/ai/flows/score-verification-analysis";

const formSchema = z.object({
  scoreData: z.string().min(1, { message: "Score data cannot be empty." }),
  applicantResponses: z.string().min(20, { message: "Please provide more details on applicant responses." }),
  applicantBackground: z.string().min(20, { message: "Please provide more details on applicant background." }),
});

export default function ScoreVerification() {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<ScoreVerificationOutput | null>(null);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      scoreData: "",
      applicantResponses: "",
      applicantBackground: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    setResult(null);

    const { data, error } = await getScoreVerification(values);

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
            <CardTitle>Score Verification Analysis</CardTitle>
            <CardDescription>Use AI to analyze and validate an applicant's score and supporting documents.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
             <FormField
              control={form.control}
              name="scoreData"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Score Data</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Paste raw score data, e.g., JAMB/UTME scores, Post-UTME score, etc." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="applicantResponses"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Applicant Responses</FormLabel>
                  <FormControl>
                    <Textarea placeholder="e.g., Responses from screening questions, uploaded document text..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="applicantBackground"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Applicant Background</FormLabel>
                  <FormControl>
                    <Textarea placeholder="e.g., Information from O'level certificates, previous institutions..." {...field} />
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
                  Analyzing...
                </>
              ) : (
                <>
                  <ShieldCheck className="mr-2 h-4 w-4" />
                  Verify Score
                </>
              )}
            </Button>
            {result && (
                <div className="w-full rounded-lg border bg-accent/20 p-4 animate-in fade-in">
                    <div className="flex items-center gap-4 mb-2">
                        <h4 className="font-semibold text-foreground">Verification Result</h4>
                        <Badge variant={result.isValid ? "default" : "destructive"}>
                            {result.isValid ? <ShieldCheck className="mr-2 h-4 w-4"/> : <ShieldAlert className="mr-2 h-4 w-4"/>}
                            {result.isValid ? "Valid Score" : "Discrepancy Found"}
                        </Badge>
                    </div>
                    <p className="text-sm text-foreground/80">{result.analysis}</p>
                </div>
            )}
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
}
