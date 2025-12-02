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
    }
    return JSON.parse(resText);
  } catch (e) {
    console.error("Something went wrong: ", e);
    throw e;
  }
}
