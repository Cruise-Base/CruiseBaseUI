# Environment Variables

You need to set the following environment variable in your Netlify deployment:

## Netlify Environment Variables

Go to your Netlify site settings > Build & deploy > Environment variables and add:

- **Key**: `VITE_API_BASE_URL`
- **Value**: `https://cruisebaseapi-production.up.railway.app/`

This ensures the production build uses the correct API URL.
