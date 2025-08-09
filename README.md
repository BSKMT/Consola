# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.

## API Key auth and optional HMAC signing

Create requests from the console send the following headers:

- x-api-key: API key provided at build-time via Vite env var
- x-request-timestamp: Unix seconds (±5 min)
- x-signature: HMAC-SHA256 over string: METHOD + "\n" + PATH_WITH_QUERY + "\n" + TIMESTAMP + "\n" + JSON.stringify(body || {})

Notes:

- HMAC is added for JSON bodies; it's omitted for multipart FormData uploads.
- The Origin header must be https://console.bskmt.com in production; local dev may be blocked by backend CORS/origin policy.

Setup:

1) Copy .env.example to .env and set:

	VITE_API_BASE_URL=<your backend base, e.g., https://api.bskmt.com/api/v1>
	VITE_API_KEY=<your console API key>

2) The wrapper lives in `src/lib/http.ts` and uses Web Crypto (`src/lib/security/*`) for signing. Use:

- `http.postJson('/events', payload)`
- `http.postFormData('/products', formData)`

Testing checklist:

- From https://console.bskmt.com, perform a signup or create an event/product/team; expect success.
- Replay the same signed request after 10+ minutes; expect rejection when timestamp window is enforced.
- Ensure backend CORS/origin policy includes console.bskmt.com (and localhost:5173 if needed for dev).
