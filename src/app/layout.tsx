import type { Metadata } from 'next';
import './globals.css';
import { AuthProvider } from '@/context/AuthContext';
import { ThemeProvider } from '@/context/ThemeContext';
import { Toaster } from 'sonner';

export const metadata: Metadata = {
  title: 'FixMate | Smart Device & Home Appliance Repair Service Platform',
  description:
    'On-demand device and home appliance repair booking platform. Connect with certified technicians, track real-time job pipelines, and pay securely only after work completion.',
  icons: {
    icon: '/favicon.ico',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="antialiased selection:bg-blue-600 selection:text-white">
        <ThemeProvider>
          <AuthProvider>
            {children}
            <Toaster position="top-right" richColors closeButton />
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
