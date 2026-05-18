/** @type {import('jest').Config} */
module.exports = {
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/src/setupTests.ts'],
  rootDir: '.',
  testRegex: '/src/.*\\.test\\.(ts|tsx)$',
  testPathIgnorePatterns: ['/node_modules/', '/.claude/', '/dist/'],
  modulePathIgnorePatterns: ['<rootDir>/.claude/'],
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json'],
  moduleNameMapper: {
    '\\.(css|less|scss|sass)$': '<rootDir>/test/styleMock.cjs',
    '\\.(jpg|jpeg|png|gif|svg|webp)$': '<rootDir>/test/fileMock.cjs',
    '\\.md\\?raw$': '<rootDir>/test/fileMock.cjs',
  },
  transform: {
    '^.+\\.(t|j)sx?$': [
      '@swc/jest',
      {
        jsc: {
          parser: { syntax: 'typescript', tsx: true },
          transform: { react: { runtime: 'automatic' } },
          target: 'es2022',
        },
        module: { type: 'commonjs' },
      },
    ],
  },
  transformIgnorePatterns: [
    '/node_modules/(?!(react-markdown|remark-.*|micromark.*|decode-named-character-reference|character-entities|mdast-.*|unist-.*|vfile.*|unified|bail|is-plain-obj|trough|comma-separated-tokens|space-separated-tokens|property-information|hast-util-.*|html-url-attributes|trim-lines|zwitch|ccount|escape-string-regexp|estree-util-.*|longest-streak|markdown-table|devlop)/)',
  ],
}
