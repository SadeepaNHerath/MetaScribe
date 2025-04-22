import { Switch, Route, Router as WouterRouter } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { ThemeProvider } from "@/components/theme-provider";
import NotFound from "@/pages/not-found";
import Home from "@/pages/home";
import { AppHeader } from "@/components/app-header";

function Router() {
  return (
    <WouterRouter base="">
      <Switch>
        <Route path="/" component={Home} />
        <Route component={NotFound} />
      </Switch>
    </WouterRouter>
  );
}

function App() {
  return (
    <ThemeProvider defaultTheme="system" storageKey="seo-analyzer-theme">
      <QueryClientProvider client={queryClient}>
        <>
          <AppHeader />
          <Router />
          <Toaster />
        </>
      </QueryClientProvider>
    </ThemeProvider>
  );
}

export default App;
