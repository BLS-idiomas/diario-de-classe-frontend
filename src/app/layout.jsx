import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import { Layout } from '@/components';
import { ToastProvider } from '@/providers/ToastProvider';
import { ReduxProvider } from '@/providers/ReduxyProvider';

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
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ReduxProvider>
          <ToastProvider>{children}</ToastProvider>
        </ReduxProvider>
      </body>
    </html>
  );
}
