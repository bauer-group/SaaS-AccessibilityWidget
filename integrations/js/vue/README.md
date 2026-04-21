# @bauer-group/accessibility-widget-vue

Vue 3 Wrapper.

```vue
<script setup lang="ts">
import { AccessibilityWidget } from '@bauer-group/accessibility-widget-vue';
</script>

<template>
  <AccessibilityWidget
    loader-src="/accessibility-widget/accessibility-widget-loader.min.js"
    css-href="/accessibility-widget/accessibility-widget.min.css"
    :config="{ position: 'bottom-right', locale: 'auto' }"
  />
</template>
```

MIT © BAUER GROUP
