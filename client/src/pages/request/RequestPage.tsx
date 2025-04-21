import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { insertRequestSchema } from "@shared/schema";

const requestFormSchema = insertRequestSchema
  .extend({
    notifyMe: z.boolean().default(false),
  })
  .omit({ userId: true, status: true });

type RequestFormValues = z.infer<typeof requestFormSchema>;

const RequestPage = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const form = useForm<RequestFormValues>({
    resolver: zodResolver(requestFormSchema),
    defaultValues: {
      title: "",
      author: "",
      subject: "",
      classLevel: "",
      description: "",
      priority: "normal",
      notifyMe: false,
    },
  });

  const requestMutation = useMutation({
    mutationFn: (data: RequestFormValues) => {
      const { notifyMe, ...requestData } = data;
      
      // In a real app, you would get the user ID from authentication
      const userId = 1;
      
      return apiRequest("POST", "/api/requests", {
        ...requestData,
        userId,
        status: "pending",
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['/api/stats'],
      });
      queryClient.invalidateQueries({
        queryKey: ['/api/requests'],
      });
      
      toast({
        title: "Request Submitted",
        description: "Your book request has been submitted successfully.",
      });
      
      form.reset();
      setIsSubmitting(false);
    },
    onError: (error) => {
      toast({
        title: "Error Submitting Request",
        description: "There was an error submitting your request. Please try again.",
        variant: "destructive",
      });
      setIsSubmitting(false);
    },
  });

  const onSubmit = (data: RequestFormValues) => {
    setIsSubmitting(true);
    requestMutation.mutate(data);
  };

  return (
    <div>
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl font-bold">Request a Book / Resource</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Request Form */}
        <div className="lg:col-span-2">
          <Card className="shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
            <CardHeader className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
              <CardTitle className="text-lg font-semibold">Request Form</CardTitle>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                Fill in the details of the book or resource you need
              </p>
            </CardHeader>

            <CardContent className="p-6">
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="title"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Book/Resource Title *</FormLabel>
                          <FormControl>
                            <Input 
                              placeholder="E.g., Advanced Calculus" 
                              {...field} 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="author"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Author (if known)</FormLabel>
                          <FormControl>
                            <Input 
                              placeholder="E.g., Dr. Robert Chen" 
                              {...field} 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="subject"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Subject *</FormLabel>
                          <Select 
                            onValueChange={field.onChange} 
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select Subject" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="Mathematics">Mathematics</SelectItem>
                              <SelectItem value="Physics">Physics</SelectItem>
                              <SelectItem value="Chemistry">Chemistry</SelectItem>
                              <SelectItem value="Biology">Biology</SelectItem>
                              <SelectItem value="English">English</SelectItem>
                              <SelectItem value="Other">Other</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="classLevel"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Class/Exam *</FormLabel>
                          <Select 
                            onValueChange={field.onChange} 
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select Class/Exam" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="JEE">JEE</SelectItem>
                              <SelectItem value="NEET">NEET</SelectItem>
                              <SelectItem value="12th">12th</SelectItem>
                              <SelectItem value="11th">11th</SelectItem>
                              <SelectItem value="10th">10th</SelectItem>
                              <SelectItem value="9th">9th</SelectItem>
                              <SelectItem value="Other">Other</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Description / Additional Information *</FormLabel>
                        <FormControl>
                          <Textarea 
                            rows={4} 
                            placeholder="Please describe the book or resource you're looking for. Include any specific chapters, editions, or other details that would help us find it."
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="priority"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Priority</FormLabel>
                        <Select 
                          onValueChange={field.onChange} 
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select Priority" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="normal">Normal</SelectItem>
                            <SelectItem value="high">High - Needed within a week</SelectItem>
                            <SelectItem value="urgent">Urgent - Needed within 3 days</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div>
                    <FormLabel>Reference Image / Sample (Optional)</FormLabel>
                    <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 dark:border-gray-600 border-dashed rounded-md">
                      <div className="space-y-1 text-center">
                        <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48" aria-hidden="true">
                          <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                        <div className="flex text-sm text-gray-600 dark:text-gray-400">
                          <label htmlFor="file-upload" className="relative cursor-pointer bg-white dark:bg-gray-700 rounded-md font-medium text-primary-600 dark:text-primary-400 hover:text-primary-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-primary-500">
                            <span>Upload a file</span>
                            <input id="file-upload" name="file-upload" type="file" className="sr-only" />
                          </label>
                          <p className="pl-1">or drag and drop</p>
                        </div>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          PNG, JPG, GIF up to 10MB
                        </p>
                      </div>
                    </div>
                  </div>

                  <FormField
                    control={form.control}
                    name="notifyMe"
                    render={({ field }) => (
                      <FormItem className="flex items-center space-x-2 space-y-0">
                        <FormControl>
                          <Checkbox 
                            checked={field.value} 
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <FormLabel className="font-normal text-gray-700 dark:text-gray-300">
                          Notify me when this resource becomes available
                        </FormLabel>
                      </FormItem>
                    )}
                  />

                  <Button 
                    type="submit" 
                    className="w-full" 
                    disabled={isSubmitting}
                  >
                    <i className="ri-send-plane-fill mr-2"></i>
                    {isSubmitting ? "Submitting..." : "Submit Request"}
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        </div>

        {/* Information Card */}
        <div>
          <Card className="shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
            <CardHeader className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
              <CardTitle className="text-lg font-semibold">Request Information</CardTitle>
            </CardHeader>

            <CardContent className="p-6 space-y-6">
              <div>
                <h4 className="font-medium mb-2 flex items-center">
                  <i className="ri-information-line text-primary-500 mr-2"></i>
                  About Book Requests
                </h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Our team reviews all resource requests and aims to fulfill them as quickly as possible. Priority is given to requests that benefit many students.
                </p>
              </div>

              <div>
                <h4 className="font-medium mb-2 flex items-center">
                  <i className="ri-time-line text-primary-500 mr-2"></i>
                  Processing Time
                </h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Most requests are processed within 48-72 hours. Urgent requests may be handled sooner based on availability.
                </p>
              </div>

              <div>
                <h4 className="font-medium mb-2 flex items-center">
                  <i className="ri-question-line text-primary-500 mr-2"></i>
                  Request Status
                </h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  You'll receive notifications about your request status if you check the notification box. You can also check the status in your profile.
                </p>
              </div>

              <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                <h4 className="font-medium mb-2 flex items-center">
                  <i className="ri-shield-check-line text-green-500 mr-2"></i>
                  Already Submitted?
                </h4>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                  If you've already submitted a request, you can track its status below.
                </p>
                <Button variant="outline" className="w-full">
                  <i className="ri-search-line mr-2"></i>
                  Check Request Status
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default RequestPage;
