import { getLastSentence } from '../../util/textUtils';
import {globalCursorPosition} from '../../singleton/cursorSingleton';

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