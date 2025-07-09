/**
 * Since the ecosystem hasn't fully migrated to ESLint's new FlatConfig system yet,
 * we "need" to type some of the plugins manually :(
 */

declare module 'eslint-plugin-jsx-a11y' {
  import type { Linter, Rule } from 'eslint'

  export const flatConfigs: {
    recommended: { rules: Linter.RulesRecord }
    strict: { rules: Linter.RulesRecord }
  }
  export const rules: Record<string, Rule.RuleModule>
}

declare module '@next/eslint-plugin-next' {
  import type { Linter, Rule } from 'eslint'

  export const flatConfig: {
    recommended: { rules: Linter.RulesRecord }
    coreWebVitals: { rules: Linter.RulesRecord }
  }
  export const rules: Record<string, Rule.RuleModule>
}
