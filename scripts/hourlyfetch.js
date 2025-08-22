// This script is used to fetch the hourly snapshot from the Create API
// It is used in the cron job to fetch the snapshot every hour (or the specified interval in `github/workflows/hourly.yml`)
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