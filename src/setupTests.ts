import '@testing-library/jest-dom'

// jsdom omits scrollTo on elements; GeminiChatPage scrolls the transcript after updates.
HTMLElement.prototype.scrollTo = function scrollTo() {}
