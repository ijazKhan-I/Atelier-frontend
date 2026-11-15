# Atelier Frontend

Next.js storefront for Atelier. Talks to the Django REST API in `atelier-django`.

## Setup

```bash
cp .env.example .env.local
npm install
npm run dev
```

`.env.local`:

```env
NEXT_PUBLIC_API_URL=http://localhost:8000
```

Start the API first (see `../atelier-django/README.md`), then open [http://localhost:3000](http://localhost:3000).
