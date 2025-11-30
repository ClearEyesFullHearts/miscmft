<script setup>
import { onMounted, useTemplateRef, ref } from 'vue';

const emit = defineEmits(['sized']);

const theComp = useTemplateRef("theComp");
const sizing = ref(true);

onMounted(() => {
  const w = theComp.value.offsetWidth;
  const h = theComp.value.offsetHeight;

  sizing.value = false;
  emit('sized', { w, h });
});
</script>
<template>
  <div
    v-if="sizing"
    v-bind="$attrs"
    ref="theComp"
  >
    <slot />
  </div>
  <slot v-else />
</template>