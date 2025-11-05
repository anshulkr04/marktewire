import './globals.css'
import { Inter } from 'next/font/google'
import { AppProvider } from './components/contexts/AppContext'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'MarketWire',
  description: 'Financial market data and analysis platform',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AppProvider>
          {children}
        </AppProvider>
      </body>
    </html>
  )
}