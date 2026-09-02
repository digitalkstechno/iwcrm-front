import type {Metadata} from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Nexus CRM - Enterprise Suite',
  description: 'Modern B2B SaaS CRM Enterprise Suite for managing Leads, Dealers, and Staff with analytics, conversion pipelines, and reporting.',
  openGraph: {
    title: 'Nexus CRM - Enterprise Suite',
    description: 'Modern B2B SaaS CRM Enterprise Suite for managing Leads, Dealers, and Staff with analytics, conversion pipelines, and reporting.',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Nexus CRM - Enterprise Suite',
    description: 'Modern B2B SaaS CRM Enterprise Suite for managing Leads, Dealers, and Staff with analytics, conversion pipelines, and reporting.',
  },
};

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html lang="en">
      <body suppressHydrationWarning className="bg-[#f9fafb] text-[#111827] antialiased selection:bg-blue-600 selection:text-white">
        {children}
      </body>
    </html>
  );
}
