import type { Component } from 'vue'

/**
 * Page size options for print documents
 */
export type PageSize = 'A2' | 'A3' | 'A4' | 'A5' | 'A6'

/**
 * Page orientation options
 */
export type PageOrientation = 'portrait' | 'landscape'

/**
 * Page definition for TPrintPages component
 */
export interface PageDefinition {
  /** Unique identifier matching content key */
  key: string
  /** Vue component to render for this page */
  component: Component
  /** Enable overflow handling for dynamic page creation */
  overflowing?: boolean
  /** Safety margin in millimeters to prevent content cutoff */
  overflowOffset?: number
}

/**
 * Content data structure for TPrintPages
 * Keys must match PageDefinition keys
 */
export interface ContentData {
  [key: string]: any | any[]
}

/**
 * Pixel-to-millimeter conversion measurement result
 */
export interface MeasurementResult {
  /** Number of pixels per millimeter */
  mmInPixels: number
}

/**
 * Component dimension measurement result
 */
export interface SizeResult {
  /** Width in pixels */
  w: number
  /** Height in pixels */
  h: number
}

/**
 * Overflow event payload
 */
export interface OverflowResult {
  /** Index in content array where overflow occurred */
  index: number
}

/**
 * Conversion functions provided to child components
 */
export interface ConversionFunctions {
  /** Convert pixels to millimeters */
  convertPixel: (px: number) => number
  /** Convert millimeters to pixels */
  convertMm: (mm: number) => number
}

/**
 * Props provided to page slot components
 */
export interface PageSlotProps extends ConversionFunctions {
  /** Available content height in pixels */
  contentHeight: number
  /** Available content width in pixels */
  contentWidth: number
}

/**
 * Props provided to TOverflowing slot components
 */
export interface OverflowSlotProps extends PageSlotProps {
  /** Starting index in the items array */
  startIndex: number
  /** Array of items to render on current page */
  items: any[]
  /** Current item index */
  itemIndex: number
  /** Callback to invoke when item is mounted */
  onItemMounted: () => void
}
