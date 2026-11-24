# Galaxia Shop

Tienda web preparada para Vercel + Neon PostgreSQL y futura integración como Telegram Mini App.

## Stack
- React + TypeScript + Vite
- Vercel Functions (API)
- Neon PostgreSQL con `@neondatabase/serverless`
- Telegram Bot API (webhook base)

## Desarrollo
```bash
npm install
npm run dev
```

## Variables de entorno
La API detecta `GALAXIA_SHOP_DATABASE_URL`, `DATABASE_URL`, `POSTGRES_URL` o `GALAXIA_SHOP_POSTGRES_URL`. Para el webhook: `TELEGRAM_WEBHOOK_SECRET`. El token del bot se añadirá cuando se implemente el registro del webhook; no se debe guardar en el repositorio.

## Base de datos
Revisa y ejecuta manualmente `db/schema.sql` en el proyecto Neon Galaxia-Shop. No se ejecuta automáticamente para evitar cambios accidentales en datos existentes.

## Endpoints
- `GET /api/health` comprueba la conexión a Neon.
- `GET /api/products` devuelve productos activos.
- `POST /api/telegram/webhook` recibe actualizaciones de Telegram y valida el secreto si está configurado.

## Despliegue
El proyecto principal de Vercel es `galaxia-shop-bot-9a1z`. Esta base se trabaja primero en `feature/galaxia-shop-foundation`; no se publica en producción desde esta rama.