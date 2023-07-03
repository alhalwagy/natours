/* eslint-disable */
import axios from 'axios';
import { showAlert } from './alert';
export const signup = async (email, password, passwordConfirm, name) => {
  try {
    const res = await axios({
      method: 'POST',
      url: '/api/v1/users/signup',
      data: {
        email,
        password,
        passwordConfirm,
        name,
      },
    });

    if (res.data.status === 'success') {
      showAlert('success', 'Account Created!!');
      window.setTimeout(() => {
        location.assign('/');
      }, 1500);
    }
  } catch (err) {
    showAlert('error', err.response.data.message);
  }
};

// export const logout = async () => {
//   try {
//     const res = await axios({
//       method: 'GET',
//       url: '/api/v1/users/logout',
//     });
//     if ((res.data.status = 'success')) {
//       location.assign('/');
//     }
//   } catch (err) {
//     showAlert('error', 'Error logging out! Try again.');
//   }
// };
