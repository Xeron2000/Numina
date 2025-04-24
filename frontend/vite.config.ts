import path from 'path'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import { TanStackRouterVite } from '@tanstack/router-plugin/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), TanStackRouterVite()],
  server: {
    allowedHosts: [
      '.airsight.top',
      'localhost',
      '127.0.0.1'
      // 你可以添加更多主机名，例如：
      // 'your-domain.com',
      // '*.your-domain.com'  // 使用通配符允许所有子域名
    ]
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),

      // fix loading all icon chunks in dev mode
      // https://github.com/tabler/tabler-icons/issues/1233
      '@tabler/icons-react': '@tabler/icons-react/dist/esm/icons/index.mjs',
    },
  },
})
