<script setup>
/**
 * TOverflowing - Intelligent Content Overflow Handler
 * 
 * This component handles content that may overflow a page by using an incremental
 * rendering strategy. Instead of rendering all items at once and checking if they fit,
 * it adds items ONE AT A TIME and measures after each addition.
 * 
 * ALGORITHM:
 * 1. Start with empty items array (if isOverflowing=true)
 * 2. Add first item from props.value
 * 3. Measure container height
 * 4. If height > available space - overflowOffset:
 *    - Remove the last item (it doesn't fit)
 *    - Emit overflow event with the index of items that DO fit
 * 5. If height <= available space:
 *    - Add next item and repeat from step 3
 * 6. Continue until all items fit or overflow detected
 * 
 * WHY INCREMENTAL:
 * - More accurate: We know exactly which item causes overflow
 * - Cleaner: Avoids complex logic to split items after rendering
 * - Predictable: Each page knows exactly what items it contains
 * 
 * OVERFLOW OFFSET:
 * The overflowOffset parameter provides a safety margin (in px) to prevent items
 * from being cut off at page boundaries due to rounding or spacing issues.
 */
import { onMounted, useTemplateRef, ref } from 'vue';

const props = defineProps({
  value: {
    type: Array,
    required: true,
  },
  startIndex: {
    type: Number,
    required: true,
  },
  contentHeight: {
    type: Number, // in px
    required: true,
  },
  contentWidth: {
    type: Number, // in px
    required: true,
  },
  convertPixel: {
    type: Function,
    required: true,
  },
  convertMm: {
    type: Function,
    required: true,
  },
  overflowOffset: {
    type: Number, // in px
    default: 0,
  },
  isOverflowing: {
    type: Boolean
  }
});

const emit = defineEmits(['overflow']);

const sizingcontainer = useTemplateRef('sizingcontainer');
const items = ref([]);
const itemIndex = ref(props.startIndex);
const containerstyle = ref({});

if (!props.isOverflowing) {
  items.value = [...props.value];
}

/**
 * Called after each item is mounted to the DOM
 * Checks if the newly added item causes overflow and handles accordingly
 */
function onItemMounted() {
  if (props.isOverflowing) {
    const h = sizingcontainer.value.offsetHeight;

    // Check if container exceeded available space (minus safety offset)
    if (h > props.contentHeight - props.overflowOffset) {
      // Last item caused overflow - remove it
      items.value.pop();
      // Set minimum height to fill the page
      containerstyle.value = { 'min-height': `${props.contentHeight}px` };

      // Notify parent that overflow occurred at this index
      // Parent (TPrintPages) will create a new page starting from this index
      emit('overflow', { index: itemIndex.value - 1 });
      return;
    }
    
    // Current items fit - try adding next item if available
    if (props.value.length > itemIndex.value) {
      items.value.push(props.value[itemIndex.value]);
      itemIndex.value += 1;
    } else {
      // All items fit on this page
      containerstyle.value = { 'min-height': `${props.contentHeight}px` };
      emit('overflow', { index: itemIndex.value });
    }
  }
}

onMounted(() => {
  if (props.isOverflowing && props.value.length > itemIndex.value) {
    items.value.push(props.value[itemIndex.value]);
    itemIndex.value += 1;
  }
  if (!props.isOverflowing || !props.value?.length || props.value?.length <= 0) {
    containerstyle.value = { 'min-height': `${props.contentHeight}px` };

    emit('overflow', { index: Number.POSITIVE_INFINITY });
  }
});

</script>
<template>
  <div
    ref="sizingcontainer"
    :style="containerstyle"
  >
    <slot
      :content-height="props.contentHeight"
      :content-width="props.contentWidth"
      :convert-pixel="props.convertPixel"
      :convert-mm="props.convertMm"
      :start-index="props.startIndex"
      :items="items"
      :item-index="itemIndex"
      :on-item-mounted="onItemMounted"
    />
  </div>
</template>
