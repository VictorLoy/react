import '../styles/globals.css'
import type { AppProps } from 'next/app'
import { AuthContextProvider } from '../context/AuthContext'
import BookingsNavBar from '../components/BookingsNavBar'

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <AuthContextProvider>
        <Component {...pageProps} />
    </AuthContextProvider>
  )
  
}

export default MyApp
