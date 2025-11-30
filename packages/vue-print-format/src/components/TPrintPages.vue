<script setup>
/**
 * TPrintPages - Multi-Page Print Document Orchestrator
 * 
 * This component manages multi-page documents where content may overflow across pages.
 * It works with TOverflowing to dynamically create pages as needed.
 * 
 * HOW IT WORKS:
 * 1. Starts with initial pages configuration from props.pages
 * 2. Renders first page with TOverflowing
 * 3. When TOverflowing detects overflow, onPageOverflow is called
 * 4. A new page is dynamically inserted into the pages array with:
 *    - Same component as the overflowing page
 *    - startIndex set to where overflow occurred
 * 5. Process continues with newly inserted page
 * 6. Repeats until all content is rendered across pages
 * 
 * EXAMPLE:
 * If a page configured to show 'assets' can only fit items 0-4,
 * a new page is inserted to show items 5+ with the same component.
 * This continues until all assets are displayed.
 */
import { ref } from 'vue';

const props = defineProps({
  pages: {
    type: Array,
    required: true,
  },
  content: {
    type: Object,
    required: true,
  },
  orientation: {
    type: String,
    default: 'portrait',
    validator(value) {
      // The value must match one of these strings
      return ['portrait', 'landscape'].includes(value);
    },
  },
  pagesize: {
    type: String,
    default: 'A4',
    validator(value) {
      // The value must match one of these strings
      return ['A2', 'A3', 'A4', 'A5', 'A6'].includes(value);
    }
  },
  marginX: {
    type: Number, // in mm
    default: 0,
  },
  marginY: {
    type: Number, // in mm
    default: 0,
  },
  marginHeaderY: {
    type: Number, // in mm
    default: 0,
  },
  marginFooterY: {
    type: Number, // in mm
    default: 0,
  },
  debug: {
    type: Boolean
  }
});

const emit = defineEmits(['complete']);

if (!props.pages || !Array.isArray(props.pages)) throw new Error('Pages array is mandatory');
if (!props.content) throw new Error('Content is mandatory');

const componentList = {};

const nbOfPages = ref(props.pages.length);
const truePages = ref([]);

const refPages = props.pages.map((p, i) => {
  if (!p.key) throw new Error(`Missing key for page index ${i}`);
  if (!p.component) throw new Error(`Page component is missing for key ${p.key}`);
  if (!props.content[p.key]) throw new Error(`Content is missing key ${p.key}`);

  const { component, ...PageInfo } = p;

  componentList[p.key] = component;

  return {
    startIndex: 0,
    value: (content) => Array.isArray(content[p.key]) ? content[p.key] : [content[p.key]],
    isOverflowing: false,
    overflowOffset: 0,
    ...PageInfo,
  };
});

/**
 * Handles overflow from a page by creating a new page if needed
 * 
 * @param {number} pageIndex - The index of the page that overflowed
 * @param {number} itemsIndex - The index in the content array where overflow occurred
 * 
 * DYNAMIC PAGE CREATION:
 * When a page overflows, we insert a new page immediately after it using splice().
 * The new page:
 * - Uses the same component and configuration
 * - Starts at the itemsIndex where the previous page overflowed
 * - Will itself be checked for overflow, potentially creating more pages
 * 
 * This creates a chain reaction that continues until all content is paginated.
 */
function onPageOverflow({ pageIndex, itemsIndex }) {
  const page = refPages[pageIndex];
  const value = page.value(props.content);
  
  if (itemsIndex < value.length) {
    refPages.splice(pageIndex + 1, 0, {
      ...page,
      startIndex: itemsIndex,
    });
    nbOfPages.value += 1;
  }
  
  if (pageIndex < refPages.length - 1) {
    truePages.value.push(refPages[pageIndex + 1]);
  } else {
    
    emit('complete');
  }
}

truePages.value.push(refPages[0]);

</script>
<template>
  <base-print-document
    :pagenumber="nbOfPages"
    :pagesize="props.pagesize"
    :orientation="props.orientation"
    :margin-x="props.marginX"
    :margin-y="props.marginY"
    :margin-header-y="props.marginHeaderY"
    :margin-footer-y="props.marginFooterY"
    :default-overflowing="false"
    :debug="props.debug"
  >
    <template #header>
      <slot name="header" />
    </template>
    <template #footer>
      <slot name="footer" />
    </template>
    <template
      v-for="(page, index) in truePages"
      :key="`t-print-page-${index}-${page.key}`"
      #[`page-${index+1}`]="pageProps"
    >
      <t-overflowing
        v-bind="pageProps"
        :value="page.value(props.content)"
        :start-index="page.startIndex"
        :overflow-offset="page.overflowOffset"
        :is-overflowing="page.overflowing"
        @overflow="({ index: currentIndex }) => onPageOverflow({ pageIndex: index, itemsIndex: currentIndex })"
      >
        <template #default="overFlowProps">
          <component
            v-bind="overFlowProps"
            :is="componentList[page.key]"
            :value="page.value(props.content)"
            :start-index="page.startIndex"
          />
        </template>
      </t-overflowing>
    </template>
  </base-print-document>
</template>
