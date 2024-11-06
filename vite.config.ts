export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
  server: {
    port: process.env.PORT || 3000, // default to 3000 if PORT is not set
    host: '0.0.0.0', // allow access from external IPs (useful for Render)
  },
});
