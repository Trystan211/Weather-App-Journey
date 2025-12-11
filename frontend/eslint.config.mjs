import vueTs from "@vue/eslint-config-typescript";
export default [
  { ignores: ["dist", "node_modules"] },
  ...vueTs(),
];
