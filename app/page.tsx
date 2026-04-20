import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function Home() {
  return (
    <div className="min-h-screen bg-linear-to-b from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900">
      <main className="flex flex-col items-center justify-center py-32 px-4 sm:px-6">
        <div className="max-w-4xl space-y-12">
          {/* Header */}
          <div className="space-y-4 text-center">
            <h1 className="text-5xl font-bold tracking-tight text-slate-900 dark:text-slate-50">
              MediSync AI
            </h1>
            <p className="text-xl text-slate-600 dark:text-slate-400">
              Healthcare Intelligence Platform
            </p>
          </div>

          {/* Feature Cards */}
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Built with Next.js 15</CardTitle>
                <CardDescription>React 19 & App Router</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  Latest Next.js with TypeScript, ESLint, and strict type checking for healthcare data safety.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Shadcn UI Ready</CardTitle>
                <CardDescription>Professional Components</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  Fully typed Shadcn UI components with Tailwind CSS for beautiful, accessible UIs.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Zustand State</CardTitle>
                <CardDescription>Lightweight State Management</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  Modern state management with Zustand for optimal performance and developer experience.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Turbo Mode</CardTitle>
                <CardDescription>Fast Development</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  Run npm run dev:turbo for optimized CPU/RAM usage during development.
                </p>
              </CardContent>
            </Card>
          </div>

          {/* CTA Section */}
          <div className="flex flex-col gap-4 items-center">
            <Button size="lg" className="w-full sm:w-auto">
              Get Started
            </Button>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              Ready to build your healthcare app. Check the docs for next steps.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
