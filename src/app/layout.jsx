import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import { ToastProvider } from '@/providers/ToastProvider';
import { ReduxProvider } from '@/providers/ReduxyProvider';
import { UserAuthProvider } from '@/providers/UserAuthProvider';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata = {
  title: 'Diário de Classe',
  description: 'Sistema de gestão escolar',
};

export default function RootLayout({ children }) {
  return (
    <html lang="pt-BR">
      <head>
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#1e293b" />
        <link rel="icon" href="/bls.png" />
        <link rel="apple-touch-icon" href="/bls.png" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ReduxProvider>
          <ToastProvider>
            <UserAuthProvider>{children}</UserAuthProvider>
          </ToastProvider>
        </ReduxProvider>
      </body>
    </html>
  );
}
