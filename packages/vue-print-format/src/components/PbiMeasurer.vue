<script setup>
/**
 * PbiMeasurer - Pixel-per-Millimeter Calculator
 * 
 * PURPOSE:
 * Browsers render CSS millimeters differently based on screen DPI/resolution.
 * This component creates a temporary element with a known size in millimeters,
 * measures its actual pixel size, and calculates the conversion ratio.
 * 
 * LIFECYCLE:
 * 1. Mounts with a div of height = props.length (in mm)
 * 2. Immediately measures the actual pixel height
 * 3. Emits the mmInPixels ratio to parent
 * 4. Hides itself (display=false)
 * 
 * This ratio is used throughout the print components to accurately convert
 * between millimeters (page dimensions) and pixels (DOM measurements).
 */
import { useTemplateRef, ref, onMounted } from 'vue';
const props = defineProps(['length']);

const emit = defineEmits(['measureDone']);

const myMM = useTemplateRef('myMM');
const display = ref(true);

onMounted(() => {
  emit('measureDone', { mmInPixels: myMM.value.offsetHeight });
  display.value = false;
});
</script>
<template>
  <div
    v-if="display"
    ref="myMM"
    :style="{ height: `${props.length}mm`}"
  >
&nbsp;
  </div>
</template>
