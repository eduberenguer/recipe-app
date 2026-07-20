import "@testing-library/jest-dom";
import "whatwg-fetch";

// jsdom does not implement scrollIntoView; stub it so components that call it
// (e.g. chat auto-scroll) don't crash during render in tests.
window.HTMLElement.prototype.scrollIntoView = jest.fn();
