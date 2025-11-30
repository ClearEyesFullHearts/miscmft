# @miscmft/vue-print-format

A sophisticated set of Vue 3 components for creating print-ready, multi-page documents with automatic pagination and overflow handling.

## Features

✨ **Automatic Pagination** - Content automatically flows across multiple pages  
🎯 **Smart Overflow Detection** - Incrementally renders content to prevent page breaks mid-item  
📏 **Accurate Measurements** - Pixel-to-millimeter conversion for precise page layouts  
🖨️ **Print Optimized** - Handles browser print preview quirks (Chrome, Firefox, Edge)  
📐 **Multiple Page Sizes** - Support for A2, A3, A4, A5, A6 in portrait or landscape  
🎨 **Headers & Footers** - Repeating headers and footers on every page  
🔧 **Customizable Margins** - Fine-grained control over page margins  
🐛 **Debug Mode** - Visual borders for layout debugging  

## Installation

```bash
# npm
npm install @miscmft/vue-print-format

# yarn
yarn add @miscmft/vue-print-format

# pnpm
pnpm add @miscmft/vue-print-format
```

### Peer Dependencies

```json
{
  "vue": "^3.5.0"
}
```

## Quick Start

```vue
<template>
  <TPrintPages
    :pages="pages"
    :content="content"
    :margin-x="5"
    :margin-y="2"
  >
    <template #header>
      <div>Document Header</div>
    </template>
    <template #footer>
      <div>Page Footer</div>
    </template>
  </TPrintPages>
</template>

<script setup>
import { TPrintPages } from '@miscmft/vue-print-format'
import MyContentComponent from './MyContentComponent.vue'

const pages = [
  { key: 'content', component: MyContentComponent }
]

const content = {
  content: 'Your content here'
}
</script>
```

## Components

### TPrintPages

The main orchestrator component that manages multi-page documents with automatic overflow handling.

**Props:**

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `pages` | `Array` | *required* | Array of page definitions with `key` and `component` |
| `content` | `Object` | *required* | Content object with keys matching page definitions |
| `pagesize` | `String` | `'A4'` | Page size: 'A2', 'A3', 'A4', 'A5', 'A6' |
| `orientation` | `String` | `'portrait'` | Orientation: 'portrait' or 'landscape' |
| `marginX` | `Number` | `0` | Horizontal margins in millimeters |
| `marginY` | `Number` | `0` | Vertical margins in millimeters |
| `marginHeaderY` | `Number` | `0` | Header margin in millimeters |
| `marginFooterY` | `Number` | `0` | Footer margin in millimeters |
| `debug` | `Boolean` | `false` | Show visual borders for debugging |

**Events:**

| Event | Payload | Description |
|-------|---------|-------------|
| `complete` | - | Emitted when all pages are rendered |

**Slots:**

| Slot | Props | Description |
|------|-------|-------------|
| `header` | - | Content repeated at top of every page |
| `footer` | - | Content repeated at bottom of every page |

**Page Definition Structure:**

```typescript
interface PageDefinition {
  key: string                    // Unique identifier matching content key
  component: Component           // Vue component to render
  overflowing?: boolean         // Enable overflow handling (default: false)
  overflowOffset?: number       // Safety margin in px (default: 0)
}
```

### BasePrintDocument

Low-level component for precise page layout control. Use TPrintPages for most cases.

**Props:**

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `pagenumber` | `Number` | *required* | Total number of pages |
| `pagesize` | `String` | `'A4'` | Page size |
| `orientation` | `String` | `'portrait'` | Page orientation |
| `marginX` | `Number` | `0` | Horizontal margins (mm) |
| `marginY` | `Number` | `0` | Vertical margins (mm) |
| `marginHeaderY` | `Number` | `0` | Header margin (mm) |
| `marginFooterY` | `Number` | `0` | Footer margin (mm) |
| `defaultOverflowing` | `Boolean` | `true` | Use browser's native table header/footer overflow (true) or manual per-page management (false) |
| `debug` | `Boolean` | `false` | Debug mode |

**Slots:**

Dynamic slots `page-1`, `page-2`, etc., each with props:
- `contentHeight`: Available height in px
- `contentWidth`: Available width in px
- `convertPixel`: Function to convert pixels to mm
- `convertMm`: Function to convert mm to pixels

### TOverflowing

Handles content overflow with incremental rendering. Used internally by TPrintPages.

**Props:**

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `value` | `Array` | ✓ | Array of items to render |
| `startIndex` | `Number` | ✓ | Starting index in array |
| `contentHeight` | `Number` | ✓ | Available height (px) |
| `contentWidth` | `Number` | ✓ | Available width (px) |
| `convertPixel` | `Function` | ✓ | Pixel to mm converter |
| `convertMm` | `Function` | ✓ | Mm to pixel converter |
| `overflowOffset` | `Number` | `0` | Safety margin (px) |
| `isOverflowing` | `Boolean` | `false` | Enable overflow detection |

**Events:**

| Event | Payload | Description |
|-------|---------|-------------|
| `overflow` | `{ index: number }` | Emitted when overflow detected |

### PbiMeasurer

Calculates browser-specific pixel-to-millimeter conversion ratio. Used internally.

**Props:**

| Prop | Type | Description |
|------|------|-------------|
| `length` | `Number` | Reference length in mm (usually 100) |

**Events:**

| Event | Payload | Description |
|-------|---------|-------------|
| `measureDone` | `{ mmInPixels: number }` | Conversion ratio calculated |

### SizeAwareComponent

Measures component dimensions. Used internally for headers/footers.

**Events:**

| Event | Payload | Description |
|-------|---------|-------------|
| `sized` | `{ w: number, h: number }` | Component dimensions in pixels |

## Advanced Usage

### Dynamic Page Splitting

Enable overflow handling for content that may span multiple pages:

```javascript
const pages = [
  { 
    key: 'items',
    component: ItemList,
    overflowing: true,     // Enable overflow handling
    overflowOffset: 5      // 5px safety margin
  }
]

const content = {
  items: [
    { id: 1, text: 'Item 1' },
    { id: 2, text: 'Item 2' },
    // ... many more items
  ]
}
```

The system will automatically create additional pages as needed.

### Custom Page Components

Create components that receive overflow props:

```vue
<template>
  <div>
    <div 
      v-for="(item, index) in items" 
      :key="item.id"
      @vue:mounted="onItemMounted"
    >
      {{ item.text }}
    </div>
  </div>
</template>

<script setup>
defineProps({
  items: Array,
  onItemMounted: Function,
  contentHeight: Number,
  contentWidth: Number,
  // ... other props from TOverflowing
})
</script>
```

### Different Paper Sizes

```vue
<TPrintPages
  pagesize="A3"
  orientation="landscape"
  :pages="pages"
  :content="content"
/>
```

### Margin Configuration

```vue
<TPrintPages
  :margin-x="10"           <!-- 10mm left/right -->
  :margin-y="15"           <!-- 15mm top/bottom of content -->
  :margin-header-y="8"     <!-- 8mm around header -->
  :margin-footer-y="8"     <!-- 8mm around footer -->
  :pages="pages"
  :content="content"
/>
```

### Debug Mode

Enable visual borders to troubleshoot layout issues:

```vue
<TPrintPages
  :debug="true"
  :pages="pages"
  :content="content"
/>
```

## CSS Classes

The components provide several CSS classes for controlling print behavior:

### `.no-print`

Hides elements and all their children during print.

```vue
<div class="no-print">
  This won't appear in print output
</div>
```

**Usage:** Apply to screen-only elements like buttons, navigation, or development tools.

### `.hide-no-print`

Hides elements on screen but makes them visible during print (when combined with `.do-print`).

**Usage:** Internal class used by the components for header/footer management.

### `.do-print`

Forces elements and all their children to display during print (only works inside `@media print`).

```vue
<div class="hide-no-print do-print">
  This is hidden on screen but visible in print
</div>
```

**Usage:** Internal class used by the components when `defaultOverflowing=true`.

### Color Preservation

The components automatically add CSS to preserve colors when printing:

```css
body {
  -webkit-print-color-adjust: exact !important;
  print-color-adjust: exact !important;
}
```

This ensures background colors, borders, and other styling are preserved in print output.

## Browser Print Setup

To ensure proper printing, add these CSS rules:

```css
@page {
  size: A4;              /* Match your pagesize prop */
  margin: 0;             /* Components handle margins internally */
}

@media print {
  body {
    margin: 0;
    padding: 0;
  }
}
```

For landscape orientation:

```css
@page {
  size: A4 landscape;
}
```

## Browser Compatibility

Tested and working on:
- ✅ Chrome 90+
- ✅ Firefox 88+
- ✅ Edge 90+
- ✅ Safari 14+ (with minor rendering differences)

### Known Browser Quirks

**Print Preview Margins**: Browsers apply padding to both top and bottom of header/footer elements during print preview, regardless of which CSS padding property is set. This means:
- Setting `padding-top` on headers adds space above AND below
- Setting `padding-bottom` on footers adds space above AND below

This quirk is handled automatically by the components through margin calculations.

**Overflow Modes**: The `defaultOverflowing` prop controls how headers and footers are managed:
- `true` (default): Uses browser's native table `<thead>`/`<tfoot>` for automatic repetition. It is not recommended to use with Chromium browsers, they will crash if a large number of pages need to be split.  
- `false`: Manual per-page header/footer rendering (used by TPrintPages for better control)

## TypeScript Support

Type definitions are included. Full TypeScript support out of the box.

```typescript
import type { PageDefinition, ContentData } from '@miscmft/vue-print-format'

const pages: PageDefinition[] = [
  { key: 'content', component: MyComponent }
]

const content: ContentData = {
  content: 'Your content here'
}
```

## Troubleshooting

### Content is cut off at page boundaries

Increase the `overflowOffset` value:

```javascript
{ key: 'items', component: MyComponent, overflowing: true, overflowOffset: 10 }
```

### Headers/footers not appearing in print

Ensure you're using the `#header` and `#footer` slots, and check your browser's print settings to enable headers/footers.

### Inconsistent page heights

This is normal with overflowing = false - pages are sized based on content and will be split by the print preview. Use `debug` mode to visualize content boundaries.

## How It Works

1. **PbiMeasurer** calculates the browser's pixel-to-millimeter ratio
2. **BasePrintDocument** creates page structures with accurate dimensions
3. **SizeAwareComponent** measures header/footer dimensions
4. **TOverflowing** incrementally adds content, checking for overflow after each item
5. **TPrintPages** orchestrates everything, dynamically creating pages when content overflows

## License

MIT License - see [LICENSE](./LICENSE) file for details.
