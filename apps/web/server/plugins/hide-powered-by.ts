// Odpověď neprozrazuje použitý framework; útočník tak nezíská přesnou informaci pro cílený útok.
export default defineNitroPlugin((nitroApp) => {
  nitroApp.hooks.hook('beforeResponse', (event) => {
    removeResponseHeader(event, 'x-powered-by')
  })
})
