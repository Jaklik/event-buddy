// Lightweight liveness probe for the Docker healthcheck and uptime monitors; renders no page.
export default defineEventHandler(() => ({ status: 'ok' }))
