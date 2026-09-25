import { cookies } from 'next/headers';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import { ToastProvider } from '@/providers/ToastProvider';
import { ReduxProvider } from '@/providers/ReduxyProvider';
import { UserAuthProvider } from '@/providers/UserAuthProvider';
import { ThemeProvider } from '@/providers/ThemeProvider';
import { getKey, parseThemeCookie } from '@/utils/themeCookie';
import { ServiceWorkerRegister } from '@/components/app/ServiceWorkerRegister';

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

export default async function RootLayout({ children }) {
  const cookieStore = await cookies();
  // `null` (cookie ausente/inválido) chega como está a `ThemeProvider` — é o
  // sinal, idêntico nos dois lados, de "nada para herdar" (DEC-002-001);
  // colapsar aqui para `DEFAULT_THEME` impediria o provider de distinguir
  // "sem cookie" de "cookie=light" e de disparar a migração de
  // `localStorage`.
  const initialTheme = parseThemeCookie(cookieStore.get(getKey())?.value);

  return (
    <html lang="pt-BR">
      <head>
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#1e293b" />
        <link rel="icon" href="/icon-192.png" />
        <link rel="apple-touch-icon" href="/icon-192.png" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ServiceWorkerRegister />
        <ReduxProvider>
          <ThemeProvider initialTheme={initialTheme}>
            <ToastProvider>
              <UserAuthProvider>{children}</UserAuthProvider>
            </ToastProvider>
          </ThemeProvider>
        </ReduxProvider>
      </body>
    </html>
  );
}
