export default defineEventHandler((event) => {
  setHeader(event, 'Permissions-Policy', 'geolocation=(), microphone=(), camera=()');
});
