"use client";

import { validateWord } from "@/actions/wordle";
import { Score, Status } from "@/types/wordle";
import { useReducer, useState } from "react";

export const MAX_GUESS = 6;
export const WORD_LENGTH = 5;

type WordleState = {
  guesses: string[];
  scores: Score[][];
  currentGuess: string;
  status: Status;
};

type Action =
  | { type: "TYPE"; letter: string }
  | { type: "DELETE" }
  | { type: "ADD_GUESS"; word: string; score: Score[] }
  | { type: "SET_STATUS"; status: Status }
  | { type: "RESET" };

const initialState: WordleState = {
  guesses: [],
  scores: [],
  currentGuess: "",
  status: "playing",
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

    case "RESET":
      return initialState;

    default:
      return state;
  }
}

export function useWordle() {
  const [state, dispatch] = useReducer(reducer, initialState);

  const [toast, setToast] = useState<string | null>(null);

  function showError(msg: string) {
    setToast(msg);

    setTimeout(() => {
      setToast(null);
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
      console.log("Data returned: ", data);

      dispatch({
        type: "ADD_GUESS",
        word: currentGuess,
        score: data.score,
      });
    } catch {
      showError("Oops! Something went wrong while checking your guess");
    }
  }

  function onKey(k: string) {
    if (state.status !== "playing") {
      return;
    }

    if (k === "ENTER") {
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
    onKey,
    resetGame: () => dispatch({ type: "RESET" }),
  };
}
