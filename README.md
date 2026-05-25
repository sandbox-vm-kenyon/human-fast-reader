# Fast Reader

**Live site: https://sandbox-vm-kenyon.github.io/human-fast-reader/**

A mobile-first speed reading web app using RSVP (Rapid Serial Visual Presentation) — one word at a time in a fixed spot so your eyes never move.

---

## How it works

Traditional reading is slowed by **saccades** — the eye movements your eyes make to jump across a line of text. Each saccade takes 20–200 ms and forces a brief pause. RSVP eliminates saccades entirely by presenting words one at a time in a fixed location. Your eyes stay still; only the words change.

Research shows trained readers can reach 600–1000 WPM with good comprehension using RSVP, compared to a typical 200–300 WPM for conventional reading.

- [Wikipedia — Rapid Serial Visual Presentation](https://en.wikipedia.org/wiki/Rapid_serial_visual_presentation)
- [Acklin & Papesh (2017) — Modern Speed-Reading Apps Do Not Foster Reading Comprehension](https://pubmed.ncbi.nlm.nih.gov/29461715/)
- [Key-DeLyria et al. (2019) — RSVP Interacts with Ambiguity During Sentence Comprehension](https://pubmed.ncbi.nlm.nih.gov/30612265/)

---

## Modes

### Fast mode
One chunk at a time in a fixed spot. Leading and trailing words fill the stage on either side, giving peripheral context without breaking the RSVP effect. Tap the stage or press Space to play/pause.

### Page mode
Shows a fixed window of words as traditional flowing text, with your current reading position highlighted. Switches bidirectionally with Fast mode — switching to Page jumps to the page containing your current position; switching back to Fast resumes from the highlighted word. Use this to find your place, re-read a passage, or compare traditional vs. RSVP reading.

---

## Settings

| Setting | Description |
|---|---|
| **WPM** | Calculated words per minute (accounts for word grouping). Start around 200–250. |
| **Size** | Font size of the fast display. |
| **Simple / Advanced / Master** | Presets for word grouping (1w/10c, 3w/10c, 7w/20c). |
| **Max words / Max chars** | Group short words into one chunk (e.g. "and he was"). |
| **Hyphen at** | Split very long words with a hyphen across two chunks. |
| **Show leading & trailing words** | Toggle context words to the left and right of the current chunk. |
| **Scrub bar** | Drag to jump anywhere; context preview appears while dragging. |
| **Download text** | Save the currently loaded text as a .txt file. |

---

## Built-in books

10 public domain classics pre-loaded (Project Gutenberg):

- The Great Gatsby — F. Scott Fitzgerald *(default)*
- Pride & Prejudice — Jane Austen
- Alice's Adventures in Wonderland — Lewis Carroll
- The Picture of Dorian Gray — Oscar Wilde
- Frankenstein — Mary Shelley
- The Adventures of Tom Sawyer — Mark Twain
- Dracula — Bram Stoker
- Moby-Dick — Herman Melville
- Adventures of Sherlock Holmes — Arthur Conan Doyle
- The War of the Worlds — H.G. Wells

---

## Keyboard shortcuts

| Key | Action |
|---|---|
| `Space` | Play / pause (Fast mode) |
| `←` | Back 10 words |
| `→` | Forward 1 word / next page |
| `↑` / `↓` | Speed +50 / −50 |
