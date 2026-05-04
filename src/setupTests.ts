import '@testing-library/jest-dom/vitest'

// jsdom omits scrollTo on elements; GeminiChatPage scrolls the transcript after updates.
HTMLElement.prototype.scrollTo = function scrollTo() {}
