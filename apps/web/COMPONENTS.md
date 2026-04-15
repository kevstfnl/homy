# Components Library - Homy Web

Système de composants minimaliste et type-safe, basé sur Ark UI et UnoCSS.

## Architecture

### Configuration UnoCSS

- **Fichier**: `uno.config.ts`
- **Approche**: CSS variables pour le dark mode (pas de `unocss-preset-theme`)
- **Tokens**: Définis dans `src/assets/styles/tokens.css`
- **Shortcuts**: Classes réutilisables pour buttons, cards, forms

### Structure des Composants

```
src/components/
├── buttons/          # Button, ThemeToggle
├── display/         # Badge, Card, Separator, Spinner, Tabs
├── fields/          # Input, Label, Select, Switch, Textarea
├── overlays/        # Dialog, Tooltip, Toast
└── index.ts        # Export centralisé
```

Tous les composants:
- ✅ < 80 lignes de code
- ✅ Pas de props drilling (utilise `splitProps`)
- ✅ Typescript full type-safe
- ✅ Basés sur Ark UI (accessible, headless)
- ✅ Styling via UnoCSS shortcuts ou classes CSS variables

## Composants Disponibles

### Buttons
- **Button**: Variants (primary, secondary, ghost, danger) + sizes (sm, md, lg)
- **ThemeToggle**: Bascule light/dark avec View Transition API

### Display
- **Badge**: Variants avec couleurs de statut
- **Card**: Composé (Card.Header, Card.Content, Card.Footer)
- **Separator**: Ligne horizontale/verticale
- **Spinner**: Loading state avec 3 sizes
- **Tabs**: Onglets avec ArkUI (à personnaliser)

### Fields
- **Input**: Avec label, error, helperText, onChange/onInput
- **Label**: Label simple avec optional required indicator
- **SelectField**: Select natif avec items, onChange callback
- **SwitchField**: Toggle avec ArkUI.Switch
- **Textarea**: Textarea avec rows, onChange/onInput

### Overlays
- **Dialog**: Composé (Dialog.Trigger, Dialog.Content, Dialog.Title, etc.)
- **Tooltip**: Avec ArkUI.Tooltip
- **Toast**: Système de notifications (success, error, warning, info)

## Theme System

### CSS Variables

Light theme (défaut):
```css
--color-bg: #ffffff
--color-surface: #ffffff
--color-text: #0f172a
--color-primary: #6366f1
```

Dark theme (data-theme="dark"):
```css
--color-bg: #0c0e14
--color-surface: #161820
--color-text: #f0f2f8
--color-primary: #6366f1 (inchangé)
```

Géré par `ThemeProvider` avec View Transition API.

## Conventions

### Naming
- Classes CSS: kebab-case (`text-muted`, `bg-primary`)
- Composants: PascalCase (`Button`, `CardHeader`)
- Props: camelCase (`variant`, `onClick`)

### Props Pattern
```typescript
// Toujours destructurer avec splitProps
const [, rest] = splitProps(props, ['usedProps', 'here'])

// Passer le reste avec {...rest}
<button {...rest} />
```

### Styling
- Utiliser les shortcuts: `btn-primary`, `field`, `card`
- Ou les classes CSS variables: `text-primary`, `bg-surface`
- Pour custom: passer `class` prop

## Exemple d'Utilisation

```typescript
import { Button, Input, Card, createToaster } from '../components'

export function MyComponent() {
  const toaster = createToaster()
  const [value, setValue] = createSignal('')

  return (
    <Card>
      <Card.Header>My Form</Card.Header>
      <Card.Content>
        <Input
          label="Name"
          value={value()}
          onChange={(e) => setValue(e.currentTarget.value)}
        />
      </Card.Content>
      <Card.Footer>
        <Button
          variant="primary"
          onClick={() => toaster.success('Saved!', value())}
        >
          Save
        </Button>
      </Card.Footer>
    </Card>
  )
}
```

## Development

### Test des composants
- Page: `src/pages/Dashboard.tsx` (showroom)
- Lancer: `bun dev:web`

### Ajouter un nouveau composant
1. Créer fichier dans le dossier approprié
2. Exporter dans le `index.ts` du dossier
3. Exporter dans `src/components/index.ts`
4. Ajouter exemple dans Dashboard si nécessaire

### Styling personnalisé
Les composants acceptent une prop `class` pour custom styling:
```typescript
<Button class="my-custom-class" />
```

Le CSS de base vient des shortcuts UnoCSS, custom class s'empile dessus.
