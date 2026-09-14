import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";

const eslintConfig = defineConfig([
  ...nextVitals,
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
  ]),
  {
    // Tato appka je jednorázový živý kvíz s pollingem stavu hry přes REST
    // (žádný websocket/SSE) – "fetch on mount + setInterval" je tu záměrný
    // vzor, ne bug. Nové React Compiler lint pravidla ho označují jako
    // rizikový pro budoucí kompilátorové optimalizace, ale běh appky je
    // ověřený end-to-end (host + hráč, viz test 2026-09-14).
    rules: {
      "react-hooks/purity": "warn",
      "react-hooks/set-state-in-effect": "warn",
    },
  },
]);

export default eslintConfig;
