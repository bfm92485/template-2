import "./globals.css";
import { Inter } from 'next/font/google';
import { DeepgramContextProvider } from '../lib/contexts/DeepgramContext';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'Voice Notes App',
  description: 'A simple voice-based note-taking app',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <DeepgramContextProvider>
          {children}
        </DeepgramContextProvider>
      </body>
    </html>
  );
}
