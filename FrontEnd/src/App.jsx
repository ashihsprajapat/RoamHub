import './App.css'
import { Route, Routes } from 'react-router-dom';
import Home from './Features/Listing/Pages/home';
import ProfileShow from './Features/Profile/Pages/profilesShow';
import HostPage from './pages/HostPage';

import { Toaster } from 'react-hot-toast';
import { useLocation } from 'react-router-dom'
import Navbar from './components/Common/Navbar';
import Footer from './components/Common/Footer';
import VerifyEmail from './Features/Auth/Pages/VerifyEmail';
import Authentication from './Features/Auth/Pages/Authentication';
import CreateListing from './Features/Listing/Pages/CreateListing';
import AllListing from './Features/Listing/Pages/AllListing';
import AllListingProfile from './Features/Listing/Pages/AllListing.profile';
import EditListing from './Features/Listing/Pages/EditListing';
import AllBookingListingProfile from './Features/Booking/Page/AllBookingListingProfile';
import SelectedListing from './Features/Listing/Pages/SelectedListing';
import SelectListingDashboard from './Features/Listing/Pages/SelectListingDashboard';

function App() {

  const current = useLocation();
  console.log()

  return (
    <>
      {
        !current.pathname.includes("profile") && <Navbar />
      }



      <Routes>


        <Route path="/" element={<Home />} />
        <Route path="/verify-email" element={<VerifyEmail />} />
        <Route path="/auth" element={<Authentication />} />



        <Route path="/become-a-host" element={< CreateListing />} />

        <Route path="/listings" element={< AllListing />} />

        <Route path="/host/homes" element={<HostPage />} />

        <Route path="/profile/:id" element={<ProfileShow />} >
          <Route path="all-listings" element={<AllListingProfile />} />
          <Route path="all-booking" element={<AllBookingListingProfile />} />
          <Route path=":list_id" element={<SelectListingDashboard />} />
        </Route>

        <Route path="/edit/:id" element={<EditListing />} />

        <Route path="/:id" element={<SelectedListing />} />


      </Routes>

      <Toaster
        position="bottom-left"
        reverseOrder={false}
      />
      <Footer />
    </>
  )
}

export default App
