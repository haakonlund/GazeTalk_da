import { globalCursorPosition } from '../../singleton/cursorSingleton';
import { getLastSentence } from '../../util/textUtils';
import { matchCase } from '../../util/textUtils';
import { getWordBoundaries } from '../../util/textUtils';
import { getCurrentLine } from '../../util/textUtils';
import { getCharDistance } from '../../util/textUtils';
import { calcCursorDistance } from '../../util/textUtils';
import { deleteWordAtCursor } from '../../util/textUtils';
import { deleteSentence } from '../../util/textUtils';
import { deleteSection } from '../../util/textUtils';

describe('getLastSentence', () => {
  beforeEach(() => {
    globalCursorPosition.value = 0;
  });

  test('returns 0 for an empty text', () => {
    const text = "";
    globalCursorPosition.value = 0;
    expect(getLastSentence(text)).toBe(0);
  });

  test('returns 0 when there is no period in the text', () => {
    const text = "Hello";
    globalCursorPosition.value = 5; 
    expect(getLastSentence(text)).toBe(0);
  });

  test('returns 0 for a single sentence when the cursor is before the period', () => {
    const text = "Hello world.";
    globalCursorPosition.value = 11;
    expect(getLastSentence(text)).toBe(0);
  });

  test('returns the start index of the last sentence when there are multiple sentences', () => {
    const text = "Hello world. I have a dog.";
    globalCursorPosition.value = text.length;
    expect(getLastSentence(text)).toBe(26);
  });
  test('Checking other symbols than "."', () => {
    const text1 = "Hello world. I have a dog!";
    const text2 = "Hello world. I have a dog?";
    globalCursorPosition.value = text1.length;
    expect(getLastSentence(text1)).toBe(26);
    globalCursorPosition.value = text2.length;
    expect(getLastSentence(text2)).toBe(26);
  });
});

describe('getLastSentence', () => {
    // Ensure that our globalCursorPosition is defined.
    beforeEach(() => {
      globalCursorPosition.value = 0;
    });
  
    test('returns 0 for an empty text', () => {
      const text = "";
      globalCursorPosition.value = 0;
      expect(getLastSentence(text)).toBe(0);
    });
  
    test('returns 0 when there is no period in the text', () => {
      const text = "Hello";
      globalCursorPosition.value = 5; 
      expect(getLastSentence(text)).toBe(0);
    });
  
    test('returns 0 for a single sentence when the cursor is before the period', () => {
      const text = "Hello world.";
      globalCursorPosition.value = 11;
      expect(getLastSentence(text)).toBe(0);
    });
  
    test('returns the start index of the last sentence when there are multiple sentences', () => {
      const text = "Hello world. I have a dog.";
      globalCursorPosition.value = text.length;
      expect(getLastSentence(text)).toBe(26);
    });
    test('Checking other symbols than "."', () => {
      const text1 = "Hello world. I have a dog!";
      const text2 = "Hello world. I have a dog! Why do I have a dog?";
      globalCursorPosition.value = text1.length;
      expect(getLastSentence(text1)).toBe(26);
      globalCursorPosition.value = text2.length;
      expect(getLastSentence(text2)).toBe(47);
    });
  });

describe('matchCase', () => {
    test('returns suggestion unchanged if existingWord is empty', () => {
        expect(matchCase("Hello")).toBe("Hello");
        expect(matchCase("WORLD", "")).toBe("WORLD");
    });

    test('capitalizes suggestion if the existingWord starts with an uppercase letter', () => {
        expect(matchCase("hello", "World")).toBe("Hello");
        expect(matchCase("Hello", "World")).toBe("Hello");
    });

    test('returns suggestion in lower case if the existingWord starts with a lowercase letter', () => {
        expect(matchCase("HELLO", "apple")).toBe("hello");
        expect(matchCase("HeLLo", "banana")).toBe("hello");
    });

    test('handles non-alphabetic characters gracefully', () => {
        //expect(matchCase("Hello", "123")).toBe("hello");
        expect(matchCase("WORLD", null)).toBe("WORLD");
    });
});

describe('getWordBoundaries', () => {
    test('returns boundaries for empty text', () => {
        const text = "";
        const cursorPosition = 0;
        expect(getWordBoundaries(text, cursorPosition)).toEqual({ x0: 0, x1: 0 });
    });

    test('returns boundaries for a word in the middle of text', () => {
        const text = "Hello world";
        const cursorPosition = 2;
        expect(getWordBoundaries(text, cursorPosition)).toEqual({ x0: 0, x1: 5 });
    });

    test('returns boundaries for a word when cursor is at the beginning of the word', () => {
        const text = "Hello world";
        const cursorPosition = 6;
        expect(getWordBoundaries(text, cursorPosition)).toEqual({ x0: 6, x1: 11 });
    });

    test('returns boundaries when cursor is on a whitespace character', () => {
        const text = "Hello world";
        const cursorPosition = 5;
        expect(getWordBoundaries(text, cursorPosition)).toEqual({ x0: 0, x1: 5 });
    });

    test('returns boundaries when cursor is at the start of the text', () => {
        const text = "Hello world";
        const cursorPosition = 0;
        expect(getWordBoundaries(text, cursorPosition)).toEqual({ x0: 0, x1: 5 });
    });

    test('handles multiple consecutive whitespace characters', () => {
        const text = "Hello   world";
        const cursorPosition = 7;
        expect(getWordBoundaries(text, cursorPosition)).toEqual({ x0: 7, x1: 7 });
    });
});
describe('getCurrentLine', () => {
    test('returns 0 when currentLines is empty', () => {
      // When there are no lines, you might want to decide on a default (here we return 0).
      expect(getCurrentLine([], 0)).toBe(0);
    });
  
    test('returns 0 for a single-line text regardless of cursor position within that line', () => {
      const lines = ["Hello world"];
      expect(getCurrentLine(lines, 0)).toBe(0);
      expect(getCurrentLine(lines, 5)).toBe(0);
      expect(getCurrentLine(lines, lines[0].length)).toBe(0);
    });
  
    test('returns correct line index for multi-line text', () => {
      const lines = ["Hello", "world", "this is", "a test"];
  
      // Line 0: positions 0-5 (6 characters: indexes 0 to 5, where index 5 is the newline)
      // Line 1: positions 6-11
      // Line 2: positions 12-19
      // Line 3: positions 20 to 20 + 6 - 1 = 25
  
      // Test positions in line 0:
      expect(getCurrentLine(lines, 0)).toBe(0);
      expect(getCurrentLine(lines, 3)).toBe(0);
      expect(getCurrentLine(lines, 5)).toBe(0);
      
      // Test a position at the very start of line 1:
      expect(getCurrentLine(lines, 6)).toBe(1);
      expect(getCurrentLine(lines, 8)).toBe(1);
      expect(getCurrentLine(lines, 11)).toBe(1);
  
      // Test a position in line 2:
      expect(getCurrentLine(lines, 12)).toBe(2);
      expect(getCurrentLine(lines, 15)).toBe(2);
      expect(getCurrentLine(lines, 19)).toBe(2);
  
      // Test a position in line 3:
      expect(getCurrentLine(lines, 20)).toBe(3);
      expect(getCurrentLine(lines, 23)).toBe(3);
      expect(getCurrentLine(lines, 25)).toBe(3);
    });
});
describe('getCharDistance', () => {
    test('returns 0 when line is 0', () => {
      const lines = ["Hello", "world"];
      expect(getCharDistance(lines, 0)).toBe(0);
    });
  
    test('calculates correct distance for a single previous line', () => {
      const lines = ["Hello", "world"];
      const expected = "Hello".length + 1;
      expect(getCharDistance(lines, 1)).toBe(expected);
    });
  
    test('calculates correct distance for multiple previous lines', () => {
      const lines = ["Hello", "world", "this is"];
      const expected = "Hello".length + "world".length + 2;
      expect(getCharDistance(lines, 2)).toBe(expected);
      const expected3 = "Hello".length + "world".length + "this is".length + 3;
      expect(getCharDistance(lines, 3)).toBe(expected3);
    });
  
    test('handles empty lines correctly', () => {
      const lines = ["", "", "test"];
      expect(getCharDistance(lines, 0)).toBe(0);
      expect(getCharDistance(lines, 1)).toBe(1);
      expect(getCharDistance(lines, 2)).toBe(2);
    });
});
describe('calcCursorDistance', () => {
  test('returns 0 when cursor is at the beginning of the first line', () => {
    const textValue = "Hello\nWorld";
    const currentLines = textValue.split("\n");
    const input = { selectionStart: 0 };
    expect(calcCursorDistance(textValue, input, currentLines)).toBe(0);
  });

  test('returns the correct distance when the cursor is in the middle of the first line', () => {
    const textValue = "Hello\nWorld";
    const currentLines = textValue.split("\n");
    const input = { selectionStart: 3 };
    expect(calcCursorDistance(textValue, input, currentLines)).toBe(3);
  });

  test('returns 0 when the cursor is at the beginning of the second line', () => {
    const textValue = "Hello\nWorld";
    const currentLines = textValue.split("\n");
    const input = { selectionStart: 6 };
    expect(calcCursorDistance(textValue, input, currentLines)).toBe(0);
  });

  test('returns the correct distance when the cursor is in the middle of the second line', () => {
    const textValue = "Hello\nWorld";
    const currentLines = textValue.split("\n");
    const input = { selectionStart: 8 };
    expect(calcCursorDistance(textValue, input, currentLines)).toBe(2);
  });
});

describe('deleteWordAtCursor', () => {
  test('deletes a word when the cursor is in the middle of the word', () => {
    const text = "Hello world";
    const cursorPosition = 8; 
    const { newText, newCursorPosition } = deleteWordAtCursor(text, cursorPosition);
    expect(newText).toBe("Hello ");
    expect(newCursorPosition).toBe(6);
  });

  test('deletes the entire word when the cursor is at the beginning of the word', () => {
    const text = "Hello world";
    const cursorPosition = 6;
    const { newText, newCursorPosition } = deleteWordAtCursor(text, cursorPosition);
    expect(newText).toBe("Hello ");
    expect(newCursorPosition).toBe(6);
  });

  test('deletes the entire word when the cursor is at the end of the word', () => {
    const text = "Hello world";
    const cursorPosition = 11;
    const { newText, newCursorPosition } = deleteWordAtCursor(text, cursorPosition);
    expect(newText).toBe("Hello ");
    expect(newCursorPosition).toBe(6);
  });

  test('returns the original text and cursor position when there is no word (cursor in whitespace)', () => {
    const text = "Hello  world";
    const cursorPosition = 6;
    const { newText, newCursorPosition } = deleteWordAtCursor(text, cursorPosition);
    expect(newText).toBe(text);
    expect(newCursorPosition).toBe(cursorPosition);
  });
});

describe('deleteSentence', () => {
  test('deletes sentence even without sentence delimiter', () => {
    const text = "Hello world";
    const cursorPosition = 11;
    const { newText, newCursorPosition } = deleteSentence(text, cursorPosition);
    expect(newText).toBe("");
    expect(newCursorPosition).toBe(0);
  });

  test('deletes the last sentence when the cursor is at the end', () => {
    const text = "Hello world. I have a dog.";
    const cursorPosition = text.length;
    const { newText, newCursorPosition } = deleteSentence(text, cursorPosition);
    expect(newText).toBe("Hello world.");
    expect(newCursorPosition).toBe("Hello world.".length);
  });

  test('deletes the sentence when the cursor is in the middle of the last sentence', () => {
    const text = "Hello world. I have a dog.";
    const cursorPosition = 18;
    const { newText, newCursorPosition } = deleteSentence(text, cursorPosition);
    expect(newText).toBe("Hello world.");
    expect(newCursorPosition).toBe("Hello world.".length);
  });

  test('handles multiple sentence delimiters correctly', () => {
    const text = "Hello world. How are you? I am fine!";
    const cursorPosition = text.length;
    const expectedText = "Hello world. How are you?";
    const { newText, newCursorPosition } = deleteSentence(text, cursorPosition);
    expect(newText).toBe(expectedText);
    expect(newCursorPosition).toBe(expectedText.length);
  });
});