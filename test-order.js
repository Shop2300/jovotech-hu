fetch('http://localhost:3000/api/orders', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    firstName: 'Test',
    lastName: 'User',
    email: 'test@example.com',
    phone: '123456789',
    address: 'Test Street 123',
    city: 'Praha',
    postalCode: '11000',
    deliveryMethod: 'zasilkovna',
    paymentMethod: 'card',
    items: [{ productId: 'test', quantity: 1, price: 100 }],
    total: 100,
  }),
})
.then(res => res.json())
.then(data => console.log('Success:', data))
.catch(err => console.error('Error:', err));
