'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { ThemeToggle } from '@/components/theme-toggle'
import { 
  MessageSquare, 
  FileText, 
  Table, 
  Presentation, 
  Mic, 
  Image, 
  Video, 
  Library, 
  Settings 
} from 'lucide-react'

const navigation = [
  { name: 'Chat', href: '/', icon: MessageSquare },
  { name: 'Text', href: '/text', icon: FileText },
  { name: 'Tabelle', href: '/table', icon: Table },
  { name: 'Präsentation', href: '/presentation', icon: Presentation },
  { name: 'Podcast', href: '/podcast', icon: Mic },
  { name: 'Bild', href: '/image', icon: Image },
  { name: 'Video', href: '/video', icon: Video },
  { name: 'Dokumente', href: '/docs', icon: FileText },
  { name: 'Bibliothek', href: '/library', icon: Library },
  { name: 'Einstellungen', href: '/settings', icon: Settings },
]

export function Header() {
  const pathname = usePathname()

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center">
        <div className="mr-4 hidden md:flex">
          <Link href="/" className="mr-6 flex items-center space-x-2">
            <div className="h-6 w-6 rounded bg-gradient-to-r from-blue-600 to-purple-600" />
            <span className="hidden font-bold sm:inline-block">TWM</span>
          </Link>
          <nav className="flex items-center space-x-6 text-sm font-medium">
            {navigation.slice(0, 6).map((item) => {
              const Icon = item.icon
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center space-x-1 transition-colors hover:text-foreground/80 ${
                    pathname === item.href ? 'text-foreground' : 'text-foreground/60'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span className="hidden lg:inline">{item.name}</span>
                </Link>
              )
            })}
          </nav>
        </div>
        
        <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
          <div className="w-full flex-1 md:w-auto md:flex-none">
            <nav className="flex items-center space-x-2">
              {navigation.slice(6).map((item) => {
                const Icon = item.icon
                return (
                  <Button
                    key={item.href}
                    variant={pathname === item.href ? 'default' : 'ghost'}
                    size="sm"
                    asChild
                  >
                    <Link href={item.href}>
                      <Icon className="h-4 w-4" />
                      <span className="hidden sm:ml-2 sm:inline">{item.name}</span>
                    </Link>
                  </Button>
                )
              })}
            </nav>
          </div>
          <ThemeToggle />
        </div>
      </div>
    </header>
  )
}