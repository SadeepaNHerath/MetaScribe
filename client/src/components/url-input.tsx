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
    if (
      !formattedUrl.startsWith("http://") &&
      !formattedUrl.startsWith("https://")
    ) {
      formattedUrl = `https://${formattedUrl}`;
    }
    onSubmit(formattedUrl);
  };

  return (
    <section>
      <h2 className="text-2xl font-semibold mb-4">Analyze Website Meta Tags</h2>
      <p className="text-muted-foreground mb-6">
        Enter a URL to analyze its meta tags, view search and social media
        previews, and get SEO recommendations.
      </p>

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(handleSubmit)}
          className="flex flex-col md:flex-row md:items-start gap-3"
        >
          <FormField
            control={form.control}
            name="url"
            render={({ field }) => (
              <FormItem className="flex-grow">
                <FormControl>
                  <Input
                    placeholder="https://example.com"
                    className="h-12"
                    {...field}
                  />
                </FormControl>
              </FormItem>
            )}
          />

          <Button
            type="submit"
            className="h-12 px-6 md:self-start"
            disabled={isLoading}
          >
            {isLoading ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Search className="mr-2 h-4 w-4" />
            )}
            Analyze
          </Button>
        </form>
      </Form>

      <div className="mt-4 text-sm text-muted-foreground">
        Example URLs: techcrunch.com, nytimes.com, github.com
      </div>
    </section>
  );
}
