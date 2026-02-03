import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { EditorProvider } from "./EditorProvider";
import VisualEditor from "./components/VisualEditor";
import { Toaster } from "react-hot-toast";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Analytics } from "@vercel/analytics/react";
import Providers from "./providers";
import SiteLayout from "./SiteLayout";
import fs from 'fs';
import path from 'path';

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Zero-Cost Web Factory - Free Website Boilerplate",
  description: "Build and manage beautiful websites with zero ongoing costs using Next.js, TinaCMS, and Vercel",
  keywords: ["Next.js", "TinaCMS", "Vercel", "Free Hosting", "Zero Cost", "CMS"],
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const lang = process.env.DEPLOY_LANGUAGE || 'ko';

  // Load modules configuration (Global)
  const modulesJsonPath = path.join(process.cwd(), 'content', 'modules.json');
  let modules = { modules: [] };
  try {
    if (fs.existsSync(modulesJsonPath)) {
      modules = JSON.parse(fs.readFileSync(modulesJsonPath, 'utf-8'));
    }
  } catch (error) {
    console.error(`Failed to load modules.json from ${modulesJsonPath}:`, error);
  }

  // Load global settings (Global)
  const settingsJsonPath = path.join(process.cwd(), 'content', lang, 'settings.json');
  let settings = {};
  try {
    if (fs.existsSync(settingsJsonPath)) {
      settings = JSON.parse(fs.readFileSync(settingsJsonPath, 'utf-8'));
    }
  } catch (error) {
    console.error(`Failed to load settings.json from ${settingsJsonPath}:`, error);
  }

  return (
    <html lang={lang}>
      <body className={`${inter.className} antialiased`}>
        <Providers>
          <EditorProvider lang={lang}>
            <SiteLayout initialModules={modules} initialSettings={settings}>
              {children}
            </SiteLayout>
            <VisualEditor />
          </EditorProvider>
          <Toaster
            position="top-center"
            toastOptions={{
              duration: 4000,
              style: {
                background: '#111827',
                color: '#fff',
                borderRadius: '8px',
                border: '1px solid rgba(16, 185, 129, 0.3)',
              },
              success: {
                iconTheme: {
                  primary: '#10b981',
                  secondary: '#fff',
                },
              },
              error: {
                iconTheme: {
                  primary: '#ef4444',
                  secondary: '#fff',
                },
              },
            }}
          />
          <Analytics />
          <SpeedInsights />
        </Providers>
      </body>
    </html>
  );
}
