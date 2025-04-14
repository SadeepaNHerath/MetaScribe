import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Loader2 } from "lucide-react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";

const urlSchema = z.object({
  url: z.string().url("Please enter a valid URL").min(1, "URL is required"),
});

type UrlFormValues = z.infer<typeof urlSchema>;

interface UrlInputProps {
  onSubmit: (url: string) => void;
  isLoading: boolean;
}

export function UrlInput({ onSubmit, isLoading }: UrlInputProps) {
  const form = useForm<UrlFormValues>({
    resolver: zodResolver(urlSchema),
    defaultValues: {
      url: "",
    },
  });

  const handleSubmit = (values: UrlFormValues) => {
    let formattedUrl = values.url;
    if (!formattedUrl.startsWith("http://") && !formattedUrl.startsWith("https://")) {
      formattedUrl = `https://${formattedUrl}`;
    }
    onSubmit(formattedUrl);
  };

  return (
    <section className="bg-background rounded-lg shadow-md p-6 mb-8">
      <h2 className="text-2xl font-semibold mb-4">Analyze Website Meta Tags</h2>
      <p className="text-gray-600 mb-6">
        Enter a URL to analyze its meta tags, view search and social media previews, and get SEO recommendations.
      </p>
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="flex flex-col md:flex-row gap-4">
          <FormField
            control={form.control}
            name="url"
            render={({ field }) => (
              <FormItem className="flex-grow">
                <FormControl>
                  <Input 
                    placeholder="https://example.com" 
                    className="w-full px-4 py-6 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                    {...field}
                  />
                </FormControl>
              </FormItem>
            )}
          />
          
          <Button 
            type="submit" 
            className="bg-primary hover:bg-primary/90 text-white font-medium py-6 px-6 h-auto"
            disabled={isLoading}
          >
            {isLoading ? (
              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
            ) : (
              <Search className="mr-2 h-5 w-5" />
            )}
            Analyze
          </Button>
        </form>
      </Form>
      
      <div className="mt-4 text-sm text-gray-500">
        Example URLs: techcrunch.com, nytimes.com, github.com
      </div>
    </section>
  );
}
