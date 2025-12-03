"use client";

import { validateWord } from "@/actions/wordle";
import { getScoreBasedColor } from "@/lib/color";
import { KeyState, Score, Status } from "@/types/wordle";
import { useReducer, useState } from "react";

export const MAX_GUESS = 6;
export const WORD_LENGTH = 5;

type WordleState = {
  guesses: string[];
  scores: Score[][];
  currentGuess: string;
  status: Status;
  keyColors: Record<string, KeyState>;
};

type Action =
  | { type: "TYPE"; letter: string }
  | { type: "DELETE" }
  | { type: "ADD_GUESS"; word: string; score: Score[] }
  | { type: "SET_STATUS"; status: Status }
  | { type: "APPLY_KEY_COLORS"; updates: Record<string, KeyState> }
  | { type: "RESET" };

const initialState: WordleState = {
  guesses: [],
  scores: [],
  currentGuess: "",
  status: "playing",
  keyColors: {},
};

const colorRank = {
  "": -1,
  "tile-gray": 0,
  "tile-yellow": 1,
  "tile-green": 2,
};

function reducer(state: WordleState, action: Action): WordleState {
  switch (action.type) {
    case "TYPE":
      return { ...state, currentGuess: state.currentGuess + action.letter };

    case "DELETE":
      return { ...state, currentGuess: state.currentGuess.slice(0, -1) };

    case "ADD_GUESS":
      return {
        ...state,
        guesses: [...state.guesses, action.word],
        scores: [...state.scores, action.score],
        currentGuess: "",
      };

    case "SET_STATUS":
      return { ...state, status: action.status };

    case "APPLY_KEY_COLORS": {
      const updatedKeyColors = { ...state.keyColors };
      for (const [letter, nextColor] of Object.entries(action.updates)) {
        const currentColor = updatedKeyColors[letter]?.color ?? "";
        if (colorRank[nextColor.color] > colorRank[currentColor]) {
          updatedKeyColors[letter] = nextColor;
        }
      }
      return { ...state, keyColors: updatedKeyColors };
    }

    case "RESET":
      return initialState;

    default:
      return state;
  }
}

function computeKeyUpdates(word: string, score: Score[]) {
  const updates: Record<string, KeyState> = {};

  word.split("").forEach((letter, i) => {
    const nextColor = getScoreBasedColor(score[i]);

    const currentColor = updates[letter]?.color ?? "";

    if (colorRank[nextColor] > colorRank[currentColor]) {
      updates[letter] = { color: nextColor };
    }
  });

  return updates;
}

export function useWordle() {
  const [state, dispatch] = useReducer(reducer, initialState);

  const [toast, setToast] = useState<string | null>(null);
  const [shakeRow, setShakeRow] = useState<number | null>(null);

  function showError(msg: string) {
    setToast(msg);
    setShakeRow(state.guesses.length);

    setTimeout(() => {
      setToast(null);
      setShakeRow(null);
    }, 900);
  }

  async function submitGuess() {
    const { currentGuess, guesses } = state;

    if (currentGuess.length !== WORD_LENGTH) {
      return showError("Word must be 5 letters");
    }
    if (guesses.includes(currentGuess)) {
      return showError("Already guessed!");
    }

    try {
      const data = await validateWord(currentGuess);
      if (!data.isvalidword) {
        return showError("Invalid word");
      }

      dispatch({
        type: "ADD_GUESS",
        word: currentGuess,
        score: data.score,
      });
    } catch {
      showError("Oops! Something went wrong while checking your guess");
    }
  }

  function onRowFlipEnd() {
    const index = state.guesses.length - 1;
    if (index < 0) {
      return;
    }

    const word = state.guesses[index];
    const score = state.scores[index];

    dispatch({
      type: "APPLY_KEY_COLORS",
      updates: computeKeyUpdates(word, score),
    });

    const isWin = score.every((s) => s === 2);

    if (isWin) {
      dispatch({ type: "SET_STATUS", status: "win" });
    } else if (state.guesses.length === MAX_GUESS) {
      dispatch({ type: "SET_STATUS", status: "lose" });
    }
  }

  function onKey(k: string) {
    if (state.status !== "playing") {
      return;
    }

    if (k === "ENTER" && !toast) {
      return submitGuess();
    }
    if (k === "DEL" && state.currentGuess.length !== 0) {
      dispatch({ type: "DELETE" });
    }
    if (/^[A-Z]$/.test(k) && state.currentGuess.length !== WORD_LENGTH) {
      dispatch({ type: "TYPE", letter: k });
    }
  }

  return {
    ...state,
    toast,
    shakeRow,
    onKey,
    resetGame: () => dispatch({ type: "RESET" }),
    onRowFlipEnd,
    keyboardColors: Object.fromEntries(
      Object.entries(state.keyColors).map(([k, v]) => [k, v.color])
    ),
  };
}
