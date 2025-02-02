await fetch(
  'https://thecanvas.altie122.xyz/api/create/hourly',
  {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': `${process.env.CREATE_API_KEY}`,
    },
  }
)