import { globalCursorPosition } from '../../singleton/cursorSingleton';
import { getPreviousSection } from '../../util/cursorUtils';
import { getNextWord } from '../../util/cursorUtils';
import { getNextSentence } from '../../util/cursorUtils';
import { getNextSection } from '../../util/cursorUtils';
import { getPreviousWord } from '../../util/cursorUtils';
import { getPreviousSentence } from '../../util/cursorUtils';


describe('getPreviousSection', () => {
    beforeEach(() => {
      globalCursorPosition.value = 0;
    });
  
    test('Gets the first sentence when there is no previous sentence and cursor position is 0', () => {
      const text = "Hello world";
      expect(getPreviousSection(text)).toBe(0);
    });
    test('Gets the first sentence when there is no previous sentence and cursor position is at the end', () => {
      const text = "Hello world";
      globalCursorPosition.value = text.length + 1;
      expect(getPreviousSection(text)).toBe(0);
    });
});

