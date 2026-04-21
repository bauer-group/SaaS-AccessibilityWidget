# @bauer-group/bfsg-widget-vue

Vue 3 Wrapper.

```vue
<script setup lang="ts">
import { BFSGWidget } from '@bauer-group/bfsg-widget-vue';
</script>

<template>
  <BFSGWidget
    loader-src="/bfsg-widget/bfsg-widget-loader.min.js"
    css-href="/bfsg-widget/bfsg-widget.min.css"
    :config="{ position: 'bottom-right', locale: 'auto' }"
  />
</template>
```

MIT © BAUER GROUP
