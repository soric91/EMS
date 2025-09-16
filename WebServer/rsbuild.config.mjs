import { defineConfig } from '@rsbuild/core';
import { pluginReact } from '@rsbuild/plugin-react';

export default defineConfig({
  plugins: [pluginReact()],

  html: {
    title: 'EMS - Employee Management System',
    favicon: 'src/Asset/icons/activity.svg',
  },

  source: {
    define: {
      'process.env.PUBLIC_URL_API': JSON.stringify(process.env.PUBLIC_URL_API || 'http://localhost:8000'),
    },
  },
});
