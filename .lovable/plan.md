## Problem

The published page renders blank because `HorizontalGameCard` throws `Cannot read properties of undefined (reading 'color')`. The lookup `difficultyConfig[difficulty]` returns `undefined` whenever `difficulty` is not exactly `"Easy" | "Medium" | "Hard"` (e.g. `null`, lowercase, or a value like `"Beginner"` coming from the API). The existing `= "Medium"` default only handles `undefined`.

Other props on the same card (`rating`, `monthlyPrice`) call `.toFixed()` directly and will also crash if missing.

## Fix

In `src/components/HorizontalGameCard.tsx`:

1. Resolve difficulty safely:
   ```ts
   const difficultyKey = (['Easy','Medium','Hard'] as const).includes(difficulty as any)
     ? (difficulty as 'Easy'|'Medium'|'Hard')
     : 'Medium';
   const diff = difficultyConfig[difficultyKey];
   ```
   Use `diff.color` / `diff.bgColor` / `diff.bars` in the JSX.

2. Guard numeric renders:
   - `{(rating ?? 0).toFixed(1)}`
   - `£{(monthlyPrice ?? 0).toFixed(2)}`

3. Guard `description.substring` (already defaulted to `""`, leave as-is).

No other files need to change. This restores rendering on both preview and the published site.
