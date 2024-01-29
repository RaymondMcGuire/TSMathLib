import eslintConfigPrettier from "eslint-config-prettier";
import eslintPluginPrettier from "eslint-plugin-prettier";

export default [
	eslintConfigPrettier,
	eslintPluginPrettier.configs["recommended-flat"]
];
