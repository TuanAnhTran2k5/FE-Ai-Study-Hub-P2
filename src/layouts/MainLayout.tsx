import Footer from '@/components/Footer'
import Header from '@/components/Header'
import { Outlet } from 'react-router-dom'

function MainLayout() {
  return (
   <div>
    <Header />
    <main>  
        {/* Main content goes here */}
        <Outlet />
    </main>
    <Footer />
   </div>
  )
}

export default MainLayout
