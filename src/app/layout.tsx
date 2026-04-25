import type { Metadata } from 'next';
import { Bungee_Inline, Bungee_Shade, Lexend_Exa } from 'next/font/google';
import type { ReactNode } from 'react';
import './globals.css';

const bungeeInline = Bungee_Inline({
  subsets: ['latin'],
  weight: '400',
  variable: '--font-display',
});

const bungeeShade = Bungee_Shade({
  subsets: ['latin'],
  weight: '400',
  variable: '--font-attention',
});

const lexendExa = Lexend_Exa({
  subsets: ['latin'],
  variable: '--font-body',
});

export const metadata: Metadata = {
  title: 'Noster',
  description: 'Noster - Engenharia de decisao com IA.',
};

type RootLayoutProps = {
  children: ReactNode;
};

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="pt-BR">
      <body className={`${bungeeInline.variable} ${bungeeShade.variable} ${lexendExa.variable}`}>
        {children}
      </body>
    </html>
  );
}
