import { defineConfig } from '@rsbuild/core';
import { pluginReact } from '@rsbuild/plugin-react';

export default defineConfig({
  plugins: [pluginReact()],

  html: {
    title: 'EMS - Employee Management System',
    favicon: 'src/Asset/icons/activity.svg',
  },

  
});
