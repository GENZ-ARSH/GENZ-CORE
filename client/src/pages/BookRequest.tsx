import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useMutation } from '@tanstack/react-query';
import { apiRequest, queryClient } from '@/lib/queryClient';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { BookPlus } from 'lucide-react';
import { insertBookRequestSchema } from '@shared/schema';

const formSchema = insertBookRequestSchema.extend({
  title: z.string().min(5, {
    message: "Title must be at least 5 characters.",
  }),
  description: z.string().min(10, {
    message: "Description must be at least 10 characters.",
  }),
});

type FormValues = z.infer<typeof formSchema>;

export default function BookRequest() {
  const { toast } = useToast();
  
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      author: "",
      description: "",
      requestedBy: 1, // Mock user ID
    },
  });

  const mutation = useMutation({
    mutationFn: async (data: FormValues) => {
      // In a real app, we would call the API
      // const response = await apiRequest('POST', '/api/book-requests', data);
      // return response.json();
      console.log('Submitting book request:', data);
      return { id: Math.random() };
    },
    onSuccess: () => {
      toast({
        title: "Request Submitted",
        description: "Your book request has been successfully submitted.",
      });
      form.reset();
      // In a real app, we would invalidate the query
      // queryClient.invalidateQueries({ queryKey: ['/api/book-requests'] });
    },
    onError: (error) => {
      toast({
        title: "Failed to submit request",
        description: error.message || "Please try again later.",
        variant: "destructive",
      });
    },
  });

  function onSubmit(data: FormValues) {
    mutation.mutate(data);
  }

  return (
    <div className="fade-in max-w-2xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BookPlus className="h-5 w-5" />
            Request a Book or Resource
          </CardTitle>
          <CardDescription>
            Fill out this form to request a new book or educational resource. Our team will review your request.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Title</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter the book or resource title" {...field} />
                    </FormControl>
                    <FormDescription>
                      Provide the full title of the book or resource you're requesting.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="author"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Author</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter author name (if known)" {...field} />
                    </FormControl>
                    <FormDescription>
                      Optional: Include the author's name if you know it.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Describe the resource and why you need it..." 
                        className="min-h-[120px]"
                        {...field} 
                      />
                    </FormControl>
                    <FormDescription>
                      Please provide details about the resource and why it would be valuable.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <div className="flex justify-end gap-4">
                <Button 
                  variant="outline" 
                  type="button"
                  onClick={() => form.reset()}
                >
                  Reset
                </Button>
                <Button 
                  type="submit"
                  disabled={mutation.isPending}
                >
                  {mutation.isPending ? "Submitting..." : "Submit Request"}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
