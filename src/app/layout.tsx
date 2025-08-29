import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { ThemeProvider } from '../components/theme-provider'
import { Header } from '../components/layout/header'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'TWM - AI Content Creation Platform',
  description: 'Erstellen Sie Texte, Tabellen, Präsentationen, Podcasts, Bilder und Videos mit KI-Unterstützung',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="de" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <Header />
          <main>{children}</main>
        </ThemeProvider>
      </body>
    </html>
  )
}