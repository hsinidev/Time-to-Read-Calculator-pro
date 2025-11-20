
/**
 * Counts the number of words in a given string.
 * A word is defined as a sequence of non-whitespace characters.
 * @param text The input string.
 * @returns The total number of words.
 */
export const countWords = (text: string): number => {
  if (!text || text.trim() === '') {
    return 0;
  }
  // This regex splits by any whitespace character (spaces, tabs, newlines)
  // and filters out any empty strings that might result from multiple spaces.
  return text.trim().split(/\s+/).length;
};

/**
 * Calculates the estimated reading time for a given word count and reading speed.
 * @param wordCount The total number of words.
 * @param wpm The reading speed in words per minute.
 * @returns An object containing the reading time in minutes and seconds.
 */
export const calculateReadingTime = (wordCount: number, wpm: number): { minutes: number; seconds: number } => {
  if (wpm <= 0 || wordCount <= 0) {
    return { minutes: 0, seconds: 0 };
  }

  const totalSeconds = (wordCount / wpm) * 60;
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = Math.round(totalSeconds % 60);

  if (minutes > 0 && seconds === 60) {
      return { minutes: minutes + 1, seconds: 0 };
  }

  return { minutes, seconds };
};
