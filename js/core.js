/**
 * core.js — pure logic for human-fast-reader
 * No DOM, no side-effects. All functions are pure.
 */

/**
 * Split text into an array of words, filtering empty strings.
 * @param {string} text
 * @returns {string[]}
 */
function parseWords(text) {
  return text.split(/\s+/).filter(w => w.length > 0);
}

/**
 * Clamp WPM to the valid range [50, 1000].
 * @param {number} wpm
 * @returns {number}
 */
function clampWpm(wpm) {
  return Math.max(50, Math.min(1000, wpm));
}

/**
 * Convert WPM to milliseconds per word.
 * @param {number} wpm
 * @returns {number}
 */
function wpmToMs(wpm) {
  return Math.round(60000 / wpm);
}

/**
 * Build the initial reader state for a word array.
 * @param {string[]} words
 * @returns {{ words: string[], pos: number, paused: boolean }}
 */
function buildIndex(words) {
  return { words: words.slice(), pos: 0, paused: true };
}

/**
 * Advance the reader position by one word (clamped at end).
 * Does NOT mutate the input state.
 * @param {{ words: string[], pos: number, paused: boolean }} state
 * @returns {{ words: string[], pos: number, paused: boolean }}
 */
function advance(state) {
  return Object.assign({}, state, {
    pos: Math.min(state.pos + 1, state.words.length - 1),
  });
}

/**
 * Return the word at the current position.
 * @param {{ words: string[], pos: number }} state
 * @returns {string}
 */
function currentWord(state) {
  return state.words[state.pos];
}
