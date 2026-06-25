import ForgotPasswordHero from '@/components/auth/ForgotPasswordHero'
import { Outlet } from 'react-router-dom'


function ForgotPasswordPage() {
  return (
    <>
      {/* Left Hero - 45% */}
      <aside className="min-h-[650px]">
        <ForgotPasswordHero/>
      </aside>

      {/* Right Form Area - 55% */}
      <div className="flex min-h-[650px] items-center justify-center">
        <div className="w-full p-2">
        <Outlet/>
        </div>
      </div>
    </>
  )
}

export default ForgotPasswordPage
