"use server";

import { Score } from "@/types/wordle";

type ValidateResponse = {
  isvalidword: boolean;
  score: Score[];
};

const WORDLE_URL = process.env.WORDLE_URL;

export async function validateWord(guess: string): Promise<ValidateResponse> {
  try {
    const res = await fetch(`${WORDLE_URL}/api/validate`, {
      method: "POST",
      body: JSON.stringify({ guess }),
    });

    const resText = await res.text();
    if (!res.ok) {
      console.error("Response error: ", resText);
      return tempResponse(guess);
    }
    return JSON.parse(resText);
  } catch (e) {
    console.error("Something went wrong: ", e);
    throw e;
  }
}

function tempResponse(guess: string): ValidateResponse {
  const tempWord = "COURT";

  const score: Score[] = guess.split("").map((char, i) => {
    if (char === tempWord[i]) return 2;
    if (tempWord.includes(char)) return 1;
    return 0;
  });

  return {
    isvalidword: true,
    score,
  };
}
