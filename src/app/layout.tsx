import './globals.css';
import { Montserrat } from 'next/font/google'

const montserrat = Montserrat({
  weight: ['400', '500', '600', '700'],
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-montserrat',
})


export const metadata = {
  title: '3D Maquette',
  description: '3D printing made simple',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html className={montserrat.className} lang="en">
      <body suppressHydrationWarning className="bg-white text-black">
        {children}
      </body>
    </html>
  );
}

