import '@testing-library/jest-dom/vitest'

// jsdom has no matchMedia; react-data-table-component uses it for responsive columns.
if (!window.matchMedia) {
  window.matchMedia = (query) => ({
    matches: false,
    media: query,
    onchange: null,
    addEventListener: () => {},
    removeEventListener: () => {},
    addListener: () => {},
    removeListener: () => {},
    dispatchEvent: () => false,
  })
}

// Nor ResizeObserver, which the data table uses to track its width.
if (!window.ResizeObserver) {
  window.ResizeObserver = class {
    observe() {}

    unobserve() {}

    disconnect() {}
  }
}
