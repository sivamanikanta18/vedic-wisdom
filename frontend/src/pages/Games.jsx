import React, { useEffect, useMemo, useRef, useState } from "react";
import "./Games.css";
import { gamesAPI } from "../utils/api";

const DEFAULT_WORDS = [
  "KRISHNA",
  "GOVINDA",
  "GOPALA",
  "HARI",
  "RAMA",
  "RADHA",
  "MADHAVA",
  "NARAYANA"
];

const ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

const randomInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

const keyOf = (x, y) => `${y}-${x}`;

const sign = (n) => (n === 0 ? 0 : n > 0 ? 1 : -1);

function getLineCells(start, end, size) {
  if (!start || !end) return [];
  const dx = end.x - start.x;
  const dy = end.y - start.y;

  const ax = Math.abs(dx);
  const ay = Math.abs(dy);

  const isHorizontal = dy === 0 && dx !== 0;
  const isVertical = dx === 0 && dy !== 0;
  const isDiagonal = dx !== 0 && dy !== 0 && ax === ay;

  if (!isHorizontal && !isVertical && !isDiagonal) {
    return [start];
  }

  const stepX = sign(dx);
  const stepY = sign(dy);
  const len = Math.max(ax, ay);

  const cells = [];
  for (let i = 0; i <= len; i += 1) {
    const x = start.x + stepX * i;
    const y = start.y + stepY * i;
    if (x < 0 || x >= size || y < 0 || y >= size) break;
    cells.push({ x, y });
  }
  return cells;
}

function wordFromCells(cells, grid) {
  if (!cells?.length) return "";
  let out = "";
  for (const c of cells) {
    out += grid?.[c.y]?.[c.x] || "";
  }
  return out;
}

function reverseString(s) {
  return (s || "").split("").reverse().join("");
}

function createEmptyGrid(size) {
  return Array.from({ length: size }, () => Array.from({ length: size }, () => ""));
}

function placeWord(grid, word) {
  const size = grid.length;
  const directions = [
    { dx: 1, dy: 0 },
    { dx: 0, dy: 1 },
    { dx: 1, dy: 1 },
    { dx: -1, dy: 1 }
  ];

  const w = word.toUpperCase();

  for (let attempt = 0; attempt < 200; attempt += 1) {
    const dir = directions[randomInt(0, directions.length - 1)];

    const startX = randomInt(0, size - 1);
    const startY = randomInt(0, size - 1);

    const endX = startX + dir.dx * (w.length - 1);
    const endY = startY + dir.dy * (w.length - 1);

    if (endX < 0 || endX >= size || endY < 0 || endY >= size) continue;

    let canPlace = true;
    for (let i = 0; i < w.length; i += 1) {
      const x = startX + dir.dx * i;
      const y = startY + dir.dy * i;
      const existing = grid[y][x];
      if (existing && existing !== w[i]) {
        canPlace = false;
        break;
      }
    }

    if (!canPlace) continue;

    for (let i = 0; i < w.length; i += 1) {
      const x = startX + dir.dx * i;
      const y = startY + dir.dy * i;
      grid[y][x] = w[i];
    }

    return true;
  }

  return false;
}

function generatePuzzle(words, size) {
  const grid = createEmptyGrid(size);
  const placed = [];

  const sorted = [...words].map(w => w.toUpperCase()).sort((a, b) => b.length - a.length);
  for (const w of sorted) {
    if (placeWord(grid, w)) placed.push(w);
  }

  for (let y = 0; y < size; y += 1) {
    for (let x = 0; x < size; x += 1) {
      if (!grid[y][x]) {
        grid[y][x] = ALPHABET[randomInt(0, ALPHABET.length - 1)];
      }
    }
  }

  return { grid, words: placed };
}

const formatMs = (ms) => {
  if (ms === null || ms === undefined) return "-";
  const totalSeconds = Math.floor(ms / 1000);
  const m = Math.floor(totalSeconds / 60);
  const s = totalSeconds % 60;
  return `${m}m ${s}s`;
};

const Games = () => {
  const [best, setBest] = useState({ bestScore: 0, bestTimeMs: null });
  const [loadingBest, setLoadingBest] = useState(true);
  const [error, setError] = useState("");

  const PUZZLE_WORD_COUNT = 8;
  const [puzzleWords, setPuzzleWords] = useState(DEFAULT_WORDS);
  const [puzzleSource, setPuzzleSource] = useState("default");
  const [loadingPuzzle, setLoadingPuzzle] = useState(true);

  const [puzzleId, setPuzzleId] = useState(0);
  const [gridSize] = useState(12);

  const puzzle = useMemo(() => {
    return generatePuzzle(puzzleWords, gridSize);
  }, [puzzleId, gridSize, puzzleWords]);

  const [found, setFound] = useState(() => new Set());
  const [foundCells, setFoundCells] = useState(() => new Set());

  const [isSelecting, setIsSelecting] = useState(false);
  const [selectionStart, setSelectionStart] = useState(null);
  const [selectionEnd, setSelectionEnd] = useState(null);
  const pointerIdRef = useRef(null);

  const savedCompletionRef = useRef(false);

  const [startedAt, setStartedAt] = useState(Date.now());
  const [nowMs, setNowMs] = useState(Date.now());

  const score = found.size;
  const total = puzzle.words.length;

  useEffect(() => {
    let active = true;
    (async () => {
      try {
        setLoadingBest(true);
        const res = await gamesAPI.getKrishnaWordSearchStats();
        if (active && res?.success) {
          setBest(res.stats || { bestScore: 0, bestTimeMs: null });
        }
      } catch (e) {
        if (active) setError(e?.message || "Failed to load game stats");
      } finally {
        if (active) setLoadingBest(false);
      }
    })();

    return () => {
      active = false;
    };
  }, []);

  const fetchPuzzleWords = async () => {
    try {
      setLoadingPuzzle(true);
      const res = await gamesAPI.getKrishnaWordSearchPuzzle({ count: PUZZLE_WORD_COUNT });
      if (res?.success && Array.isArray(res.words) && res.words.length > 0) {
        setPuzzleWords(res.words);
        setPuzzleSource(res.source || "ai");
        return;
      }
      setPuzzleWords(DEFAULT_WORDS);
      setPuzzleSource("default");
    } catch {
      setPuzzleWords(DEFAULT_WORDS);
      setPuzzleSource("default");
    } finally {
      setLoadingPuzzle(false);
    }
  };

  useEffect(() => {
    fetchPuzzleWords().then(() => {
      setPuzzleId((p) => p + 1);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const id = setInterval(() => setNowMs(Date.now()), 300);
    return () => clearInterval(id);
  }, []);

  const selectedCells = useMemo(() => {
    if (!selectionStart || !selectionEnd) return [];
    return getLineCells(selectionStart, selectionEnd, gridSize);
  }, [selectionStart, selectionEnd, gridSize]);

  const selectedWord = useMemo(() => {
    const w = wordFromCells(selectedCells, puzzle.grid);
    if (!w) return "";
    const rev = reverseString(w);
    if (puzzle.words.includes(w)) return w;
    if (puzzle.words.includes(rev)) return rev;
    return w;
  }, [selectedCells, puzzle.grid, puzzle.words]);

  const finalizeSelection = async () => {
    if (!selectionStart || !selectionEnd) return;
    const cells = getLineCells(selectionStart, selectionEnd, gridSize);
    const raw = wordFromCells(cells, puzzle.grid);
    if (!raw || raw.length < 2) return;

    const rev = reverseString(raw);
    const match = puzzle.words.includes(raw) ? raw : puzzle.words.includes(rev) ? rev : null;
    if (!match) return;
    if (found.has(match)) return;

    const nextFound = new Set(found);
    nextFound.add(match);
    setFound(nextFound);

    const nextCells = new Set(foundCells);
    for (const c of cells) nextCells.add(keyOf(c.x, c.y));
    setFoundCells(nextCells);

    const finished = nextFound.size === puzzle.words.length;
    if (finished && !savedCompletionRef.current) {
      savedCompletionRef.current = true;
      const timeMs = Date.now() - startedAt;
      try {
        const res = await gamesAPI.submitKrishnaWordSearchResult({ score: nextFound.size, timeMs });
        if (res?.success && res.stats) {
          setBest(res.stats);
        }
      } catch (e2) {
        setError(e2?.message || "Finished! But failed to save your score.");
      }
    }
  };

  const resetRunState = () => {
    setFound(new Set());
    setFoundCells(new Set());
    setIsSelecting(false);
    setSelectionStart(null);
    setSelectionEnd(null);
    pointerIdRef.current = null;
    savedCompletionRef.current = false;
    setStartedAt(Date.now());
    setNowMs(Date.now());
  };

  const restart = async () => {
    setError("");
    await fetchPuzzleWords();
    resetRunState();
    setPuzzleId((p) => p + 1);
  };

  const onCellPointerDown = (e, x, y) => {
    setError("");
    try {
      e.currentTarget.setPointerCapture(e.pointerId);
    } catch {
      // ignore
    }
    pointerIdRef.current = e.pointerId;
    setIsSelecting(true);
    setSelectionStart({ x, y });
    setSelectionEnd({ x, y });
  };

  const onGridPointerMove = (e) => {
    if (!isSelecting) return;
    if (pointerIdRef.current !== null && e.pointerId !== pointerIdRef.current) return;
    const el = document.elementFromPoint(e.clientX, e.clientY);
    if (!el) return;
    const x = el.getAttribute?.("data-x");
    const y = el.getAttribute?.("data-y");
    if (x === null || y === null) return;
    const nx = Number(x);
    const ny = Number(y);
    if (Number.isNaN(nx) || Number.isNaN(ny)) return;
    setSelectionEnd({ x: nx, y: ny });
  };

  const onGridPointerUp = async (e) => {
    if (pointerIdRef.current !== null && e.pointerId !== pointerIdRef.current) return;
    setIsSelecting(false);
    pointerIdRef.current = null;
    await finalizeSelection();
  };

  const finishNow = async () => {
    setError("");
    const timeMs = Date.now() - startedAt;
    try {
      const res = await gamesAPI.submitKrishnaWordSearchResult({ score, timeMs });
      if (res?.success && res.stats) {
        setBest(res.stats);
      }
    } catch (e2) {
      setError(e2?.message || "Failed to save your score");
    }
  };

  return (
    <div className="games-page">
      <div className="games-container">
        <div className="games-header">
          <h1>🕹️ Spiritual Games</h1>
          <p>Play small games that keep Krishna on your mind.</p>
        </div>

        {error ? <div className="games-error">{error}</div> : null}

        <div className="games-card">
          <div className="games-card-header">
            <div>
              <h2>Find Krishna Names</h2>
              <p className="games-sub">Drag across letters to select a name (straight line). Correct names score points.</p>
              <p className="games-sub">Puzzle source: {loadingPuzzle ? "loading..." : puzzleSource}</p>
            </div>
            <div className="games-actions">
              <button className="games-secondary-btn" onClick={restart}>New Puzzle</button>
              <button className="games-primary-btn" onClick={finishNow}>Save Score</button>
            </div>
          </div>

          <div className="games-stats-row">
            <div className="games-stat">
              <div className="games-stat-label">Score</div>
              <div className="games-stat-value">{score} / {total}</div>
            </div>
            <div className="games-stat">
              <div className="games-stat-label">Time</div>
              <div className="games-stat-value">{formatMs(nowMs - startedAt)}</div>
            </div>
            <div className="games-stat">
              <div className="games-stat-label">Best</div>
              <div className="games-stat-value">
                {loadingBest ? "..." : `${best?.bestScore || 0}/${total} • ${formatMs(best?.bestTimeMs)}`}
              </div>
            </div>
          </div>

          <div className="wordsearch-layout">
            <div className="wordsearch-grid-wrap">
              <div
                className="wordsearch-grid"
                style={{ gridTemplateColumns: `repeat(${gridSize}, 1fr)` }}
                onPointerMove={onGridPointerMove}
                onPointerUp={onGridPointerUp}
                onPointerCancel={onGridPointerUp}
              >
                {puzzle.grid.flatMap((row, y) =>
                  row.map((ch, x) => {
                    const k = keyOf(x, y);
                    const isFound = foundCells.has(k);
                    const isSelected = selectedCells.some(c => c.x === x && c.y === y);
                    const cls = [
                      "wordsearch-cell",
                      isFound ? "found" : "",
                      isSelected ? "selected" : ""
                    ]
                      .filter(Boolean)
                      .join(" ");

                    return (
                      <div
                        key={`${y}-${x}`}
                        className={cls}
                        data-x={x}
                        data-y={y}
                        onPointerDown={(e) => onCellPointerDown(e, x, y)}
                      >
                        {ch}
                      </div>
                    );
                  })
                )}
              </div>

              <div className="wordsearch-selection">
                <div className="wordsearch-selection-label">Selection</div>
                <div className="wordsearch-selection-value">{selectedWord || "-"}</div>
              </div>
            </div>

            <div className="wordsearch-side">
              <div className="wordsearch-words">
                <h3>Names to find</h3>
                <div className="wordsearch-words-list">
                  {puzzle.words.map((w) => (
                    <div
                      key={w}
                      className={found.has(w) ? "wordsearch-word found" : "wordsearch-word"}
                    >
                      {w}
                    </div>
                  ))}
                </div>
              </div>

              {score === total ? (
                <div className="wordsearch-complete">
                  <div className="wordsearch-complete-title">Completed!</div>
                  <div className="wordsearch-complete-sub">Your best score is saved automatically.</div>
                </div>
              ) : null}
            </div>
          </div>
        </div>

        <div className="games-note">
          Tip: You can also use the browser notification permission to get upcoming event reminders.
        </div>
      </div>
    </div>
  );
};

export default Games;
