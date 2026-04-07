import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Amazon Ads Insights — Healthy Snack Bars',
  description: 'SP / SB / SD campaign analytics for Protein & Energy Bars on Amazon India',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
