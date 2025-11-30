<script setup>
import { ref, onMounted } from 'vue';

const props = defineProps({
  pagesize: {
    type: String,
    default: 'A4',
    validator(value) {
      // The value must match one of these strings
      return ['A2', 'A3', 'A4', 'A5', 'A6'].includes(value);
    }
  },
  orientation: {
    type: String,
    default: 'portrait',
    validator(value) {
      // The value must match one of these strings
      return ['portrait', 'landscape'].includes(value);
    },
  },
  pagenumber: {
    type: Number,
    required: true,
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
  defaultOverflowing: {
    type: Boolean,
    default: true,
  },
  debug: {
    type: Boolean
  }
});

const PAGE_SIZE_ENUM = {
  A2: { big: 594, small: 420 },
  A3: { big: 420, small: 297 },
  A4: { big: 297, small: 210 },
  A5: { big: 210, small: 148 },
  A6: { big: 148, small: 105 },
};
const ORIENTATION_ENUM = {
  portrait: { height: 'big', width: 'small' },
  landscape: { height: 'small', width: 'big' },
};

const orient = ORIENTATION_ENUM[props.orientation] ?? ORIENTATION_ENUM.portrait;
const pageSize = PAGE_SIZE_ENUM[props.pagesize] ?? PAGE_SIZE_ENUM.A4;

let hundredMMinPixels = 0;
let maxPageHeight = 0;
let maxPageWidth = 0;
let hasHeader = false;
let hasFooter = false;
const headerSize = ref({ h: 0, w: 0 });
const headerClass = ref({});
const headerStyle = ref({});
const footerSize = ref({ h: 0, w: 0 });
const footerClass = ref({});
const footerStyle = ref({});

const marginHorizontal = ref(0);
const marginVertical = ref(0);
const marginHeader = ref(0);
const marginFooter = ref(0);

const pageMMWidth = ref(pageSize[orient.width]);

const contentMMWidth = ref(0);
const contentMMHeight = ref(0);

const stylePage = ref({});
const styleContent = ref({});

const dimensionSet = ref(false);

function setBpi({ mmInPixels }) {
  hundredMMinPixels = mmInPixels;
  maxPageHeight = Math.floor(pageSize[orient.height] * (hundredMMinPixels / 100));
  maxPageWidth = Math.floor(pageSize[orient.width] * (hundredMMinPixels / 100));

  if (props.debug) {
    console.log(`100 mm in pixels ${hundredMMinPixels}px`);
    console.log(`Page Height ${pageSize[orient.height]}mm / ${maxPageHeight}px`);
    console.log(`Page width ${pageSize[orient.width]}mm / ${maxPageWidth}px`);
  }

  marginHorizontal.value = getMMinPX(props.marginX);
  marginVertical.value = getMMinPX(props.marginY);
  marginHeader.value = getMMinPX(props.marginHeaderY);
  marginFooter.value = getMMinPX(props.marginFooterY);

  stylePage.value = {
    'padding-left': `${marginHorizontal.value}px`,
    'padding-right': `${marginHorizontal.value}px`,
  };

  styleContent.value = {
    'padding-top': `${marginVertical.value}px`,
    'padding-bottom': `${marginVertical.value}px`,
  };
}
function getPXinMM(px) {
  return Math.floor(px / (hundredMMinPixels / 100));
}
function getMMinPX(mm) {
  return Math.ceil(mm * (hundredMMinPixels / 100));
}
function onHeaderSized({ h, w }) {
  hasHeader = true;
  headerSize.value = { h, w };
  headerClass.value = { 'hide-no-print': true, 'do-print': props.defaultOverflowing };
  headerStyle.value = { 'padding-bottom': `${marginHeader.value}px`, 'padding-top': `${marginHeader.value}px` };
}
function onFooterSized({ h, w }) {
  hasFooter = true;
  footerSize.value = { h, w };
  footerClass.value = { 'hide-no-print': true, 'do-print': props.defaultOverflowing };
  footerStyle.value = { 'padding-bottom': `${marginFooter.value}px`, 'padding-top': `${marginFooter.value}px` };
}

function setMeasures() {
  const space = headerSize.value.h + footerSize.value.h + 2;

  const marginX = 2 * getMMinPX(props.marginX);
  let marginY = 2 * getMMinPX(props.marginY);

  // Print preview add padding on top AND at the bottom of the header/footer whatever padding-* style used
  // which is why we multiply by 2, for both header and footer
  if (hasHeader) {
    marginY += 2 * getMMinPX(props.marginHeaderY);
  }
  if (hasFooter) {
    marginY += 2 * getMMinPX(props.marginFooterY);
  }

  contentMMWidth.value = maxPageWidth - marginX;
  contentMMHeight.value = maxPageHeight - (space + marginY);

  if (props.debug) {
    contentMMHeight.value -= 2; // for debug border size
    console.log(`header height on measurement: ${headerSize.value.h}px / ${getPXinMM(headerSize.value.h)}mm with margin ${props.marginHeaderY}mm`);
    console.log(`footer height on measurement: ${footerSize.value.h}px / ${getPXinMM(footerSize.value.h)}mm with margin ${props.marginFooterY}mm`);
    console.log(`total space: ${headerSize.value.h + footerSize.value.h}px / ${space}mm`);
    console.log(`Content margins: ${2 * getMMinPX(props.marginY)} + ${2 * getMMinPX(props.marginHeaderY)} + ${2 * getMMinPX(props.marginFooterY)} = ${marginY}px `);
    console.log(`Content height: ${contentMMHeight.value}px`);
  }

  dimensionSet.value = true;
}

onMounted(() => {
  setMeasures();
});

</script>
<template>
  <pbi-measurer
    length="100"
    @measure-done="setBpi"
  />
  <table>
    <thead>
      <div
        :style="{ 'padding-top': `${marginHeader}px`, width: `${pageMMWidth}mm` }"
        :class="headerClass"
      >
        <size-aware-component
          v-if="$slots.header"
          @sized="onHeaderSized"
        >
          <slot name="header" />
        </size-aware-component>
      </div>
    </thead>
    <tfoot>
      <div
        :class="footerClass"
        :style="{ 'padding-bottom': `${marginFooter}px`, width: `${pageMMWidth}mm` }"
      >
        <size-aware-component
          v-if="$slots.footer"
          @sized="onFooterSized"
        >
          <slot name="footer" />
        </size-aware-component>
      </div>
    </tfoot>
    <tbody v-if="dimensionSet">
      <tr>
        <td>
          <template
            v-for="p in Number(props.pagenumber)"
            :key="p"
          >
            <div
              :style="{ width: `${maxPageWidth}px`, 'background-color': '#fff', 'break-before': 'page', ...stylePage }"
            >
              <div
                :class="{ 'no-print': props.defaultOverflowing }"
                :style="headerStyle"
              >
                <slot name="header" />
              </div>
              <div
                :style="props.debug ? { border: '1px solid black', ...styleContent } : { 'min-height': `${contentMMHeight}px`, ...styleContent}"
              >
                <slot
                  :name="`page-${p}`"
                  :content-height="contentMMHeight"
                  :content-width="contentMMWidth"
                  :convert-pixel="getPXinMM"
                  :convert-mm="getMMinPX"
                />
              </div>
              <div
                :class="{ 'no-print': props.defaultOverflowing }"
                :style="footerStyle"
              >
                <slot name="footer" />
              </div>
            </div>
            <div
              style="width:100%; height: 8px"
              class="no-print"
            />
          </template>
        </td>
      </tr>
    </tbody>
  </table>
</template>
<style>
body {
  -webkit-print-color-adjust: exact !important;
  print-color-adjust: exact !important;
}
.hide-no-print {
  display: none !important;
}
@media print {

  .no-print,
  .no-print * {
    display: none !important;
  }

  .do-print,
  .do-print * {
    display: block !important;
  }

}
</style>
