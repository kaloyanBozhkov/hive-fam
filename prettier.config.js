/** @type {import('prettier').Config & import('prettier-plugin-tailwindcss').PluginOptions} */
const config = {
  plugins: ["prettier-plugin-tailwindcss"],
  overrides: [
    {
      files: ["*.js", "*.ts", "*.jsx", "*.tsx"], // Specifies file types
      options: {
        // Add any specific options for js/ts if needed
      },
    },
  ],
};

export default config;
