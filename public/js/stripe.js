const stripe = Stripe(
  'pk_test_51NJMVqGaukpZSgNLp1fty2hLrCTdk8H4OzR18isrDjQrp7fmlWxNrotnGgLdznsWU0RFEPm9hlmbiccmezC9qIPS00JTydMpv6'
);

import axios from 'axios';
import { showAlert } from './alert';

export const bookTour = async (tourId) => {
  try {
    //1) Get session from API
    const session = await axios(
      `http://127.0.0.1:3000/api/v1/bookings/checkout-session/${tourId}`
    );
    console.log(session);
    //2) create checkout form + charge credit card
    await stripe.redirectToCheckout({
      sessionId: session.data.session.id,
    });
  } catch (err) {
    console.log(err);
    showAlert('error', err);
  }
};
