import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import './App.css'
import LandingPage from './pages/LandingPage'
import SidebarLayout from './layout/SideBarLayout'
import AdminDashboard from './pages/admin/AdminDashboard'
import MemberDashboard from './pages/memeber/MemberDashboard'
import Moderationqueue from './pages/admin/Moderationqueue'
import Sources from './pages/admin/Sources'
import Analytics from './pages/admin/Analytics'
import AlertSystem from './pages/admin/AlertSystem'
import MemberRoster from './pages/admin/MemberRoster'
import AuditLog from './pages/admin/AuditLog'
import Settings from './pages/admin/Settings'
import MemberSettings from './pages/memeber/MemberSettings'
import Alertpreferences from './pages/memeber/Alertpreferences'
import AskAgentChart from './pages/memeber/AskAgentChart'
import AdminLogin from './pages/auth/AdminLogin'
import ForgetPassword from './pages/auth/ForgetPassword'
import ResetPassword from './pages/auth/ResetPassword'
import MembershipCallback from './pages/auth/MembershipCallback'
import { setCredentials } from './redux/apiSlice/authSlice'

function App() {
  const dispatch = useDispatch()
  const user = useSelector((state) => state.auth.user)

  useEffect(() => {
    if (!user) {
      try {
        const stored = localStorage.getItem('auth_data')
        if (stored) {
          const parsed = JSON.parse(stored)
          if (parsed?.user) {
            dispatch(
              setCredentials({
                user: parsed.user,
                token: parsed.tokens?.access?.token || parsed.access,
                refreshToken: parsed.tokens?.refresh?.token || parsed.refresh,
              })
            )
          }
        }
      } catch (_err) { void _err }
    }
  }, [user, dispatch])

  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<LandingPage />} />
        <Route path="/login" element={<AdminLogin />} />
        <Route path="/forgot-password" element={<ForgetPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/auth/ym/call-back" element={<MembershipCallback />} />
        <Route path='/admin/' element={<SidebarLayout role="admin" />}>
          <Route path='dashboard' element={<AdminDashboard />} />
          <Route path='moderationqueue' element={<Moderationqueue />} />
          <Route path='sources' element={<Sources />} />
          <Route path="analytics" element={<Analytics />} />
          <Route path="alertsystem" element={<AlertSystem/>}/>
          <Route path="members" element={<MemberRoster/>}/>
          <Route path="auditlog" element={<AuditLog/>}/>
          <Route path="settings" element={<Settings/>}/>
        </Route>
        <Route path='/member/' element={<SidebarLayout role="member" />}>
          <Route path='dailydigest' element={<MemberDashboard />} />
          <Route path='article/:id' element={<MemberDashboard />} />
          <Route path="askagent" element={<AskAgentChart/>}/>
          <Route path="membersettings" element={<MemberSettings/>}/>
          <Route path="alertpreferences" element={<Alertpreferences/>}/>
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
