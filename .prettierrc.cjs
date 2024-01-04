module.exports = {
  tabWidth: 2,
  semi: true,
  importOrder: ["^@core/(.*)$", "<THIRD_PARTY_MODULES>", "^@ui/(.*)$", "^[./]"],
  plugins: ["@ianvs/prettier-plugin-sort-imports"],
};
