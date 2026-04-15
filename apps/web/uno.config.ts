import { defineConfig, presetWind4 } from 'unocss'

export default defineConfig({
  presets: [presetWind4()],
  theme: {
    colors: {
      // Semantic colors (mapped to CSS variables in index.css)
      bg: 'var(--color-bg)',
      'bg-subtle': 'var(--color-bg-subtle)',
      surface: 'var(--color-surface)',
      'surface-raised': 'var(--color-surface-raised)',
      border: 'var(--color-border)',
      'border-strong': 'var(--color-border-strong)',
      text: 'var(--color-text)',
      'text-muted': 'var(--color-text-muted)',
      'text-subtle': 'var(--color-text-subtle)',
      // Status colors
      primary: 'var(--color-primary)',
      success: 'var(--color-success)',
      warning: 'var(--color-warning)',
      error: 'var(--color-error)',
      info: 'var(--color-info)',
    },
  },
  shortcuts: {
    // Buttons
    'btn': 'inline-flex items-center justify-center gap-2 font-medium rounded-lg transition-colors duration-200 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed',
    'btn-sm': 'btn px-3 py-1.5 text-xs',
    'btn-md': 'btn px-4 py-2 text-sm',
    'btn-lg': 'btn px-5 py-2.5 text-base',
    'btn-primary': 'btn-md bg-primary text-white hover:opacity-90',
    'btn-secondary': 'btn-md bg-surface-raised text-text border border-border hover:bg-surface',
    'btn-ghost': 'btn-md text-text-muted hover:text-text hover:bg-surface-raised',
    'btn-danger': 'btn-md bg-error text-white hover:opacity-90',
    // Cards
    'card': 'bg-surface rounded-xl border border-border',
    // Forms
    'field': 'w-full px-3 py-2 rounded-lg bg-surface border border-border text-text text-sm placeholder:text-text-subtle focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors duration-150',
    'label': 'block text-sm font-medium text-text mb-1.5',
    'field-error': 'mt-1 text-xs text-error',
    'field-helper': 'mt-1 text-xs text-text-muted',
    // Text utilities
    'text-muted': 'text-text-muted',
    'text-subtle': 'text-text-subtle',
    // Background utilities
    'bg-subtle': 'bg-bg-subtle',
  },
})
