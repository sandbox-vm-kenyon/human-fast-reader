/**
 * core.js — pure logic for human-fast-reader
 * No DOM, no side-effects. All functions are pure.
 */

/** Split text into words, filtering empty strings. */
function parseWords(text) {
  return text.split(/\s+/).filter(w => w.length > 0);
}

/**
 * Split text into words AND record each word's character offset in the original text.
 * Returns { words: string[], offsets: number[] } where offsets[i] is the index of
 * words[i] in the original text string.
 */
function parseWordsWithOffsets(text) {
  const words = [];
  const offsets = [];
  const re = /\S+/g;
  let m;
  while ((m = re.exec(text)) !== null) {
    const w = /^(.)\1+$/.test(m[0]) ? m[0][0] : m[0];
    words.push(w);
    offsets.push(m.index);
  }
  return { words, offsets };
}

/** Clamp WPM to [50, 1000]. */
function clampWpm(wpm) {
  return Math.max(50, Math.min(1000, wpm));
}

/** Milliseconds per word at given WPM. */
function wpmToMs(wpm) {
  return Math.round(60000 / wpm);
}

/** Build initial reader state. */
function buildIndex(words) {
  return { words: words.slice(), pos: 0, paused: true };
}

/** Advance pos by 1, clamped. Does not mutate. */
function advance(state) {
  return Object.assign({}, state, {
    pos: Math.min(state.pos + 1, state.words.length - 1),
  });
}

/** Word at current position. */
function currentWord(state) {
  return state.words[state.pos];
}

/**
 * Pre-process words: split any word longer than hyphenThreshold chars
 * into hyphenated segments of (hyphenThreshold-1) chars + '-'.
 * @param {string[]} words
 * @param {number} hyphenThreshold  — min length to trigger split
 * @returns {string[]}
 */
function splitLongWords(words, hyphenThreshold) {
  const result = [];
  for (const word of words) {
    if (word.length <= hyphenThreshold) {
      result.push(word);
    } else {
      let remaining = word;
      while (remaining.length > hyphenThreshold) {
        result.push(remaining.slice(0, hyphenThreshold - 1) + '-');
        remaining = remaining.slice(hyphenThreshold - 1);
      }
      if (remaining.length > 0) result.push(remaining);
    }
  }
  return result;
}

/**
 * Group words into display chunks respecting maxWords and maxChars.
 * Very long words are pre-split via splitLongWords.
 * A single word always forms at least one chunk (never skipped).
 *
 * @param {string[]} words
 * @param {number} maxWords      — max words per chunk
 * @param {number} maxChars      — max chars per chunk (single word may exceed if shorter than hyphenThreshold)
 * @param {number} hyphenThreshold — words longer than this are split before chunking
 * @returns {string[]}  — array of chunk strings
 */
function buildChunks(words, maxWords, maxChars, hyphenThreshold) {
  const expanded = splitLongWords(words, hyphenThreshold);
  const chunks = [];
  let i = 0;
  while (i < expanded.length) {
    const token = expanded[i];
    // Hyphenated segments always stand alone — never group them
    if (token.endsWith('-')) {
      chunks.push(token);
      i++;
      continue;
    }
    let chunk = token;
    let count = 1;
    while (count < maxWords && i + count < expanded.length) {
      const next = expanded[i + count];
      if (next.endsWith('-')) break; // don't absorb a hyphenated continuation
      const candidate = chunk + ' ' + next;
      if (candidate.length > maxChars) break;
      chunk = candidate;
      count++;
    }
    chunks.push(chunk);
    i += count;
  }
  return chunks;
}

/**
 * Build a cumulative char-offset array for words in scroll mode.
 * offsets[i] = char index (in the full joined text) where words[i] starts.
 * @param {string[]} words
 * @returns {number[]}
 */
function buildWordCharOffsets(words) {
  const offsets = [];
  let pos = 0;
  for (const word of words) {
    offsets.push(pos);
    pos += word.length + 1; // +1 for the space separator
  }
  return offsets;
}

/**
 * Find the word index corresponding to a given char offset using binary search.
 * @param {number[]} offsets  — from buildWordCharOffsets
 * @param {number} charPos
 * @returns {number}  — word index (0-based)
 */
function wordIndexAtChar(offsets, charPos) {
  let lo = 0, hi = offsets.length - 1;
  while (lo < hi) {
    const mid = (lo + hi + 1) >> 1;
    if (offsets[mid] <= charPos) lo = mid;
    else hi = mid - 1;
  }
  return lo;
}

/**
 * Build a context snippet for scrubbing: words around pos, with the
 * current word wrapped in markers so the caller can highlight it.
 * Returns an object with { before, current, after } strings.
 * @param {string[]} words
 * @param {number} pos
 * @param {number} windowWords  — how many words to show on each side
 */
function scrubContext(words, pos, windowWords) {
  const start = Math.max(0, pos - windowWords);
  const end   = Math.min(words.length - 1, pos + windowWords);
  const before  = words.slice(start, pos).join(' ');
  const current = words[pos] || '';
  const after   = words.slice(pos + 1, end + 1).join(' ');
  return { before, current, after };
}
