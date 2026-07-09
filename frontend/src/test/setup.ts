import "@testing-library/jest-dom";

// jsdom no implementa scrollIntoView — lo necesitan componentes que hacen
// auto-scroll (p.ej. Dashboard.tsx en cada mensaje nuevo del chat).
Element.prototype.scrollIntoView = () => {};

Object.defineProperty(window, "matchMedia", {
  writable: true,
  value: (query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: () => {},
    removeListener: () => {},
    addEventListener: () => {},
    removeEventListener: () => {},
    dispatchEvent: () => {},
  }),
});
