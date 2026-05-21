import { Outlet } from 'react-router-dom'
import { Sidebar } from './ui/sidebar'

const SidebarLayout = () => {
  return (
    <div className="flex h-screen">
      <Sidebar className="w-64" />
      <main className="flex-1 overflow-auto p-6">
        <Outlet />
      </main>
    </div>
  )
}

export default SidebarLayout