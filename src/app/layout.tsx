import './globals.css';
import { Montserrat } from 'next/font/google';
import Header from '@/components/Header';

const montserrat = Montserrat({
  weight: ['400', '500', '600', '700'],
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-montserrat',
});

export const metadata = {
  title: '3D Maquette',
  description: '3D printing made simple',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={montserrat.className}>
      <body className="min-h-screen text-blue-900">
        <Header />
        <main className="max-w-8xl mx-auto px-4 py-6">{children}</main>
      </body>
    </html>
  );
}
