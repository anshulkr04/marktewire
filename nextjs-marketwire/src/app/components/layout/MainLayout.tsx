'use client'

import React from 'react'
import TopBar from './TopBar'
import Sidebar from './Sidebar'
import { useAppContext } from '../contexts/AppContext'

interface MainLayoutProps {
  children: React.ReactNode
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  const { isSidebarOpen } = useAppContext()

  return (
    <div className="flex flex-col h-screen bg-gray-100">
      <TopBar />
      <div className="flex flex-1 pt-16 overflow-hidden">
        <Sidebar />
        <main
          className={`flex-1 p-6 overflow-y-auto bg-white transition-all duration-300 ease-in-out
                     ${isSidebarOpen ? 'ml-72' : 'ml-0'}`}
        >
          {children}
        </main>
      </div>
    </div>
  )
}

export default MainLayout