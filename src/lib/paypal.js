import axios from 'axios';

export async function getAccessToken() {
  const auth = Buffer.from(`${process.env.PAYPAL_CLIENT_ID}:${process.env.PAYPAL_CLIENT_SECRET}`).toString('base64');

  try {
    const response = await axios.post(
      'https://api-m.sandbox.paypal.com/v1/oauth2/token',
      'grant_type=client_credentials',
      {
        headers: {
          'Authorization': `Basic ${auth}`,
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      }
    );

    return response.data.access_token;
  } catch (error) {
    console.error('Error getting PayPal access token:', error.response?.data || error.message);
    throw new Error('Failed to get access token');
  }
}

export async function createOrder(orderId, amount) {
  const accessToken = await getAccessToken();

  const newAmount = amount * 0.25

  try {
    const response = await axios.post(
      'https://api-m.sandbox.paypal.com/v2/checkout/orders',
      {
        intent: 'CAPTURE',
        purchase_units: [
          {
            reference_id: orderId.toString(),
            amount: {
              currency_code: 'USD', // หรือ MYR หากคุณต้องการ
              value: newAmount.toFixed(2),
            },
          },
        ],
        application_context: {
          shipping_preference: 'NO_SHIPPING', // หรือ 'SET_PROVIDED_ADDRESS' ถ้าต้องการที่อยู่จัดส่ง
          return_url: 'http://localhost:3000/cart/complete',
          cancel_url: 'http://localhost:3000/cart',
        }
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`,
        },
      }
    );

    return response.data;
  } catch (error) {
    console.error('PayPal API Error:', error.response?.data || error.message);
    throw new Error('Failed to create PayPal order');
  }
}

