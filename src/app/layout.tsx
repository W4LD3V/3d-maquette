import './globals.css';

export const metadata = {
  title: '3D Maquette',
  description: '3D printing made simple',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body suppressHydrationWarning className="bg-white text-black">
        {children}
      </body>
    </html>
  );
}

