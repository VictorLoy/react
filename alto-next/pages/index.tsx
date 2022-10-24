import type { NextPage } from 'next'
import BookingsNavBar from '../components/BookingsNavBar'
import BookingsView from '../components/BookingsView'
import ProtectedRoute from '../components/ProtectedRoute'

const Home: NextPage = () => {

  return (
    <ProtectedRoute>
      <BookingsNavBar>
        <BookingsView/>
      </BookingsNavBar>
    </ProtectedRoute>
  )
}

export default Home
