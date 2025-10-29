import axios from 'axios';

// demo
// const apiKey = 'sk_prod_KAYAAAAAAAAiZDf1iT6qiH4IUGkVeZHjLS60VXWq/xcfJP1uA7rc9Q';
// const sessionUrl = 'https://sandbox-pgw.myguava.com/order';
// const paymentUrl = 'https://sandbox-pgw.myguava.com/order';

// live
const apiKey = 'sk_prod_dgAAAAAAAAAafQ1QOsbbEuRnEPS90imKg4TBJau6q7f0xsupkD91Ew';
const sessionUrl = 'https://api-pgw.myguava.com/order';
const paymentUrl = 'https://api-pgw.myguava.com/order';

function myguavapayRequest(url, key, dataBody) {
	return axios({
		method: 'POST',
		url: url,
		data: dataBody,
		headers: {
			'Content-Type': 'application/json',
			Authorization: `Bearer ${key}`,
		},
		params: {
			language_code: 'en',
		},
	});
}

function myguavapayGetRequest(url, key, dataBody) {
	return axios({
		method: 'GET',
		url: `${url}/${dataBody}?transactions-included=true`,
		headers: {
			'Content-Type': 'application/json',
			Authorization: `Bearer ${key}`,
		},
		params: {
			language_code: 'en',
		},
	});
}

export function getmyguavapay(data) {
	return myguavapayRequest(sessionUrl, apiKey, data);
}
export function getmyguavapayPublic(data) {
	return myguavapayGetRequest(paymentUrl, apiKey, data);
}
export function myguavapayPaymentSuccess(transactionId, dataBody) {
	return axios({
		method: 'POST',
		url: `http://smartrestaurantsolutions.com/mobileapi-v2/v2/barclayTrigger.php/3/${transactionId}`,
		data: dataBody,
		headers: {
			'Content-Type': 'application/json',
		},
		params: {
			language_code: 'en',
		},
	});
}

export function myguavapayPaymentUpdate(transactionId, orderRef) {
	return axios({
		method: 'GET', // Consider changing to POST or PUT if it's an update operation
		url: `http://smartrestaurantsolutions.com/mobileapi-v2/v2/barclayTrigger.php/4/${transactionId}/${orderRef}`,
		headers: {
			'Content-Type': 'application/json',
		},
		params: {
			language_code: 'en',
		},
	});
}
