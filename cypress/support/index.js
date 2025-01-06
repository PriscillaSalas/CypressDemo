import './commands'
Cypress.on('uncaught:exception', (err, runnable) => {
  if (err.message.includes('parámetro(s) de la API no válido(s)')) {
    return false;
  }
  return true;
});