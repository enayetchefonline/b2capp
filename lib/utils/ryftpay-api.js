import axios from 'axios';

// demo
// const secretKey =
//   'sk_sandbox_BCooMvk/mbpRZL9viUwxSbv3OQd+4/EcKaoOHamKqPDBA7sA6U5JqjETcXOn0ab4';
// const publicKey =
//   'pk_sandbox_/EwboiCDSmKDoNDyEELdvG+UXWAiiljgZB55CVs/FVMrZfzC5f98fm60qkVDJ8Zj';

// const sessionUrl = 'https://sandbox-api.ryftpay.com/v1/payment-sessions';
// const paymentUrl =
//   'https://sandbox-api.ryftpay.com/v1/payment-sessions/attempt-payment';

// live
const secretKey =
  'sk_hJ7KRMffD9zQV0h87VzMTQ9AupwJRdvb3OuC2CxBbncAAICMGZjeqdKF7UIbAihA';
const publicKey =
  'pk_MvGLGNuwuIEpVfTmmuQlhmcjz3/GSNkdJ+NO9fxKZWGs60tDTO+EkRgKyY5H4beZ';

const sessionUrl = 'https://api.ryftpay.com/v1/payment-sessions';
const paymentUrl =
  'https://api.ryftpay.com/v1/payment-sessions/attempt-payment';

// Common function for API requests
function ryftpayRequest(url, key, dataBody) {
  return axios({
    method: 'POST',
    url: url,
    data: dataBody,
    headers: {
      'Content-Type': 'application/json',
      Authorization: key,
    },
    params: {
      language_code: 'en',
    },
  });
}

// For requests with the secret key
export function getRyftpay(data) {
  return ryftpayRequest(sessionUrl, secretKey, data);
}

// For requests with the public key
export function getRyftpayPublic(data) {
  return ryftpayRequest(paymentUrl, publicKey, data);
}

export function ryftpayPaymentSuccess(transactionId, dataBody) {
  return axios({
    method: 'POST',
    url:
      'http://smartrestaurantsolutions.com/mobileapi-v2/v2/barclayTrigger.php/3/' +
      transactionId,
    data: dataBody,
    headers: {
      'Content-Type': 'application/json',
    },
    params: {
      language_code: 'en',
    },
  });
}
