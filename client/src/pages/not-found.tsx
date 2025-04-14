import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertCircle } from "lucide-react";
import { Link } from "wouter";

export default function NotFound() {
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-background">
      <Card className="w-full max-w-md mx-4 border-border shadow-lg">
        <CardContent className="pt-6">
          <div className="flex flex-col items-center text-center mb-6">
            <div className="bg-muted rounded-full p-4 mb-4">
              <AlertCircle className="h-12 w-12 text-destructive" />
            </div>
            <h1 className="text-3xl font-bold text-foreground">404 Page Not Found</h1>
            <p className="mt-4 text-muted-foreground">
              The page you're looking for doesn't exist or has been moved.
            </p>
          </div>
          
          <div className="flex justify-center mt-6">
            <Button asChild variant="default">
              <Link href="/">Return to Home</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
