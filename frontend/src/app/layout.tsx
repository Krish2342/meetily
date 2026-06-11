'use client'

import './globals.css'
import { Source_Sans_3 } from 'next/font/google'
import Sidebar from '@/components/Sidebar'
import { SidebarProvider } from '@/components/Sidebar/SidebarProvider'
import MainContent from '@/components/MainContent'
import AnalyticsProvider from '@/components/AnalyticsProvider'
import { Toaster } from 'sonner'
import "sonner/dist/styles.css"
import { useState, useEffect } from 'react'
import { listen } from '@tauri-apps/api/event'
import { invoke } from '@tauri-apps/api/core'
import { LegacyDatabaseImport } from '@/components/DatabaseImport/LegacyDatabaseImport'
import { TooltipProvider } from '@/components/ui/tooltip'
import { RecordingStateProvider } from '@/contexts/RecordingStateContext'
import { OllamaDownloadProvider } from '@/contexts/OllamaDownloadContext'

const sourceSans3 = Source_Sans_3({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-source-sans-3',
})

// Runs before React hydration to set dark class — prevents white flash
const themeScript = `(function(){try{var s=localStorage.getItem('theme'),m=window.matchMedia('(prefers-color-scheme: dark)').matches;if(s==='dark'||(s===null&&m)){document.documentElement.classList.add('dark');}else{document.documentElement.classList.remove('dark');}}catch(e){}})();`

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [showImportDialog, setShowImportDialog] = useState(false)

  useEffect(() => {
    invoke<boolean>('check_first_launch')
      .then((isFirstLaunch) => {
        if (isFirstLaunch) setShowImportDialog(true)
      })
      .catch((error) => {
        console.error('Failed to check first launch:', error)
      })

    const unlistenFirstLaunch = listen('first-launch-detected', () => {
      setShowImportDialog(true)
    })

    const unlistenDbInit = listen('database-initialized', () => {
      setShowImportDialog(false)
    })

    return () => {
      unlistenFirstLaunch.then((fn) => fn())
      unlistenDbInit.then((fn) => fn())
    }
  }, [])

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Anti-flash dark mode: runs synchronously before paint */}
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body className={`${sourceSans3.variable} font-sans`}>
        <AnalyticsProvider>
          <RecordingStateProvider>
            <OllamaDownloadProvider>
              <SidebarProvider>
                <TooltipProvider>
                  <div className="flex">
                    <Sidebar />
                    <MainContent>{children}</MainContent>
                  </div>
                </TooltipProvider>
              </SidebarProvider>
            </OllamaDownloadProvider>
          </RecordingStateProvider>
        </AnalyticsProvider>
        <Toaster position="bottom-center" richColors closeButton theme="system" />
        <LegacyDatabaseImport
          isOpen={showImportDialog}
          onComplete={() => setShowImportDialog(false)}
        />
      </body>
    </html>
  )
}
