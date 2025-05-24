import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Link from 'next/link';
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Project Charter App",
  description: "Gerenciador de Termos de Abertura de Projeto",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-slate-50 text-slate-900`}
      >
        <header className="bg-sky-700 text-white shadow-md">
          <nav className="container mx-auto px-4 py-3 flex justify-between items-center">
            <Link href="/" className="text-xl font-bold hover:text-sky-200">
              Project Charter App
            </Link>
            <div className="space-x-4">
              <Link href="/" className="hover:text-sky-200 px-3 py-2 rounded-md text-sm font-medium">
                Home
              </Link>
              <Link href="/projetos/novo" className="hover:text-sky-200 px-3 py-2 rounded-md text-sm font-medium">
                Novo Projeto
              </Link>
            </div>
          </nav>
        </header>
        <main className="container mx-auto p-4 mt-6">
          {children}
        </main>
        <footer className="text-center py-4 mt-8 text-sm text-slate-600 border-t border-slate-200">
          <p>&copy; {new Date().getFullYear()} Project Charter App. Todos os direitos reservados.</p>
        </footer>
      </body>
    </html>
  );
}
