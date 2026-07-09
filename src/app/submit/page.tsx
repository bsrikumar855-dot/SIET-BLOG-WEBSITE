"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { BookOpen, FileText, Check, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { PageContainer } from "@/components/shared/PageContainer";
import { motion, AnimatePresence } from "framer-motion";

const submitSchema = z.object({
  title: z.string().min(10, { message: "Title must be at least 10 characters long" }),
  summary: z.string().min(20, { message: "Summary must be at least 20 characters long" }),
  content: z.string().min(100, { message: "Content body must be at least 100 characters long" }),
  category: z.string().min(2, { message: "Please select a valid category" }),
  tags: z.string().min(2, { message: "Please provide at least 2 comma-separated tags" }),
});

type SubmitFormData = z.infer<typeof submitSchema>;

export default function SubmitPage() {
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [isSuccess, setIsSuccess] = React.useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<SubmitFormData>({
    resolver: zodResolver(submitSchema),
    defaultValues: {
      title: "",
      summary: "",
      content: "",
      category: "tech",
      tags: "React, Nextjs",
    },
  });

  const onSubmit = async (data: SubmitFormData) => {
    setIsSubmitting(true);
    try {
      // Simulate API submit latency
      await new Promise((resolve) => setTimeout(resolve, 1500));
      console.log("Submitted article draft:", data);
      setIsSuccess(true);
      reset();
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <PageContainer className="max-w-2xl mx-auto space-y-8">
      {/* Title Header */}
      <div className="flex items-center gap-2.5 border-b border-border/40 pb-4">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
          <FileText className="h-5 w-5" />
        </div>
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight">Write Publication</h1>
          <p className="text-sm text-muted-foreground">
            Submit your research notes, placement interview logs, or student project reviews
          </p>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {isSuccess ? (
          <motion.div
            key="success"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="flex flex-col items-center justify-center space-y-3 py-12 text-center"
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-500">
              <Check className="h-6 w-6" />
            </div>
            <h3 className="text-lg font-bold">Draft Submitted Successfully!</h3>
            <p className="text-sm text-muted-foreground max-w-sm">
              Your article has been saved as a draft. Faculty moderators will review it before publishing to the main feed.
            </p>
            <Button onClick={() => setIsSuccess(false)} variant="outline" size="sm" className="mt-2">
              Submit Another Article
            </Button>
          </motion.div>
        ) : (
          <motion.div key="form">
            <Card className="bg-card/50 backdrop-blur-sm shadow-sm border border-border/60">
              <CardContent className="p-6">
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                  
                  {/* Article Title */}
                  <div className="space-y-1">
                    <label htmlFor="title" className="text-xs font-semibold text-foreground/80">Title</label>
                    <Input
                      id="title"
                      placeholder="e.g. A review of MQTT latency under resource-constrained devices"
                      disabled={isSubmitting}
                      {...register("title")}
                    />
                    {errors.title && (
                      <p className="text-[10px] text-destructive font-medium">{errors.title.message}</p>
                    )}
                  </div>

                  {/* Summary */}
                  <div className="space-y-1">
                    <label htmlFor="summary" className="text-xs font-semibold text-foreground/80">Executive Summary</label>
                    <Input
                      id="summary"
                      placeholder="Brief abstract/summary of the post..."
                      disabled={isSubmitting}
                      {...register("summary")}
                    />
                    {errors.summary && (
                      <p className="text-[10px] text-destructive font-medium">{errors.summary.message}</p>
                    )}
                  </div>

                  {/* Category & Tags Row */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label htmlFor="category" className="text-xs font-semibold text-foreground/80">Category</label>
                      <select
                        id="category"
                        disabled={isSubmitting}
                        className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-xs shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring focus-visible:border-primary"
                        {...register("category")}
                      >
                        <option value="tech">Technology</option>
                        <option value="research">Research & Innovation</option>
                        <option value="careers">Careers & Placements</option>
                        <option value="events">College Events</option>
                      </select>
                    </div>

                    <div className="space-y-1">
                      <label htmlFor="tags" className="text-xs font-semibold text-foreground/80">Tags (comma-separated)</label>
                      <Input
                        id="tags"
                        placeholder="IoT, Edge, IEEE"
                        disabled={isSubmitting}
                        {...register("tags")}
                      />
                      {errors.tags && (
                        <p className="text-[10px] text-destructive font-medium">{errors.tags.message}</p>
                      )}
                    </div>
                  </div>

                  {/* Content Area */}
                  <div className="space-y-1">
                    <label htmlFor="content" className="text-xs font-semibold text-foreground/80">Article Body Content</label>
                    <textarea
                      id="content"
                      placeholder="Write your detailed article body content here..."
                      disabled={isSubmitting}
                      className="w-full min-h-[180px] rounded-md border border-input bg-transparent px-3 py-2 text-xs shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring focus-visible:border-primary"
                      {...register("content")}
                    />
                    {errors.content && (
                      <p className="text-[10px] text-destructive font-medium">{errors.content.message}</p>
                    )}
                  </div>

                  {/* Action triggers */}
                  <div className="flex justify-end gap-3 pt-2">
                    <Button
                      type="submit"
                      disabled={isSubmitting}
                      className="shadow-sm"
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="h-3.5 w-3.5 animate-spin mr-1.5" />
                          <span>Submitting...</span>
                        </>
                      ) : (
                        "Submit Draft"
                      )}
                    </Button>
                  </div>

                </form>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </PageContainer>
  );
}
