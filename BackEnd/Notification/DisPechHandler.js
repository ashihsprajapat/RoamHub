
import { bookingCencellHandler, bookingCreatedHandler } from './handler/bookingHandler.js';
import { listingCreateHandler, listingUpdateHandler } from './handler/listingHandler.js';
import { OtpHandler } from './handler/otpHandler.js';
import { wellComeHandler,verifyEmailHandler } from './handler/welcomeHandler.js';


export const disPechHandler = async (event) => {
    console.log('event in dispechHandler event value is ', event);

    switch (event?.type) {
        case 'SEND_OTP':
            await OtpHandler(event);
            console.log('OTP sent successfully'); 
            break;  

        case 'WELCOME_EMAIL':
            await wellComeHandler(event);
            console.log('Welcome email sent successfully');
            break;

        case 'VERIFY_EMAIL':
            await verifyEmailHandler(event);
            console.log('Verify email sent successfully');
            break;

        case 'LISTING_CREATED':
            await listingCreateHandler(event);
            console.log('Listing created email sent successfully');
            break;

        case 'LISTING_UPDATED':
            await listingUpdateHandler(event);
            console.log('Listing updated email sent successfully');
            break;

        case 'BOOKING_CONFIRMED':
            await bookingCreatedHandler(event);
            console.log('Booking confirmed email sent successfully');
            break;

        case 'BOOKING_CANCELLED':
            await bookingCencellHandler(event);
            console.log('Booking cancelled email sent successfully');
            break;

        case 'PAYMENT_SUCCESS':
            console.log('Payment success email sent successfully');
            break;

        case 'DELETE_LISTING':
            console.log('Listing deleted email sent successfully');
            break;  

        case 'LISTING_UPDATED':
            console.log('Listing updated email sent successfully');
            break;
            
        default :
            console.log("type is not found ")
    }
}