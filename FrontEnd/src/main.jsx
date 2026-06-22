
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BrowserRouter } from 'react-router-dom';
import { AppContextProvider } from './context/AppContext';
import { AuthProvider } from './Features/Auth/Context/AuthContext.jsx';
import { ListingProvider } from './Features/Listing/Context/ListingContext.jsx';
import { ReviewProvider } from './Features/Reviews/Context/ReviewsContext.jsx';
import { BookingProvider } from './Features/Booking/Context/BookingContext.jsx';

createRoot(document.getElementById('root')).render(

  <BrowserRouter>
    <AppContextProvider>
      <AuthProvider>
        <ReviewProvider>
          <BookingProvider>

            <ListingProvider>



              <App />


            </ListingProvider>

          </BookingProvider>
        </ReviewProvider>
      </AuthProvider>
    </AppContextProvider>
  </BrowserRouter>

)
