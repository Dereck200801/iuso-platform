import React from 'react'
import { Header } from './Header'
import { Footer } from './Footer'
import { SimpleFooter } from './SimpleFooter'
import { CookieBanner } from '../CookieBanner'
import { CookieSettingsButton } from '../CookieSettingsButton'

interface LayoutProps {
  children: React.ReactNode
  simpleFooter?: boolean
}

export const Layout: React.FC<LayoutProps> = ({ children, simpleFooter = false }) => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        {children}
      </main>
      {simpleFooter ? <SimpleFooter /> : <Footer />}
      <CookieBanner />
      <CookieSettingsButton />
    </div>
  )
}

export default Layout 