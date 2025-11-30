// Export all components
export { default as TPrintPages } from './components/TPrintPages.vue'
export { default as BasePrintDocument } from './components/BasePrintDocument.vue'
export { default as TOverflowing } from './components/TOverflowing.vue'
export { default as PbiMeasurer } from './components/PbiMeasurer.vue'
export { default as SizeAwareComponent } from './components/SizeAwareComponent.vue'

// Export all types
export type {
  PageSize,
  PageOrientation,
  PageDefinition,
  ContentData,
  MeasurementResult,
  SizeResult,
  OverflowResult,
  ConversionFunctions,
  PageSlotProps,
  OverflowSlotProps
} from './types'

// Default export with all components
import TPrintPages from './components/TPrintPages.vue'
import BasePrintDocument from './components/BasePrintDocument.vue'
import TOverflowing from './components/TOverflowing.vue'
import PbiMeasurer from './components/PbiMeasurer.vue'
import SizeAwareComponent from './components/SizeAwareComponent.vue'

export default {
  TPrintPages,
  BasePrintDocument,
  TOverflowing,
  PbiMeasurer,
  SizeAwareComponent
}
