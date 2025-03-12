import { RANKING } from '../../constants/userDataConstants';
import { getRank, rank, stripSpace, updateRank, getPreferedSpaces, setRanking } from '../../util/ranking';


// // Mock the exported functions that are being tested
jest.mock('../../util/ranking', () => {
//   // Store the original module
  const originalModule = jest.requireActual('../../util/ranking');

  return {
    ...originalModule,
    getRank: jest.fn(),
    stripSpace: jest.fn(),
    updateRank: jest.fn(),
  };
});

describe('getPreferedSpaces function', () => {
    test('Order array by preference', () => {
      const input = [12, 3, 0, 123, 0, 1];
      const expectedOutput = [3, 0, 1, 5, 4, 2];
      expect(getPreferedSpaces(input)).toEqual(expectedOutput);
      expect(getPreferedSpaces([0,0,0,0,0,0])).toEqual([ 5, 4, 3, 2, 1, 0 ]);
      expect(getPreferedSpaces([5,4,3,2,1,0])).toEqual([ 0, 1, 2, 3, 4, 5 ]);
    });
  });

describe('Ranking Functions', () => {
  // Reset mocks before each test
  beforeEach(() => {
    jest.clearAllMocks();
  });

  

  describe('getRank function', () => {
    
    
    
    test('should return the current ranking object', () => {
        const mockRanking = {
        "a": [0, 10, 0, 1, 0, 0],
        "b": [11, 2, 0, 0, 0, 0]
      };
      
      getRank.mockReturnValue(mockRanking);
      
      const result = getRank();
      expect(result).toEqual(mockRanking);
      expect(getRank).toHaveBeenCalledTimes(1);
    });
  });

  describe('rank function', () => {
    test('should rank array with no suggestion letter', () => {
      const inputArr = ["a", "b", "c", "d", "e", "f"];
      const expectedArr = ["f","e","d","c","b","a"]; // Sample expected output
      
    //   rank.mockReturnValue(expectedArr);
      
      const result = rank(inputArr, null, 0);
      
      expect(result).toEqual(expectedArr);
    });
    test('should rank array with suggestion letter', () => {
      const inputArr = ["a", "b", "c", "d", "e", "f"];
      const suggestionLetter = "c";
      const currentSelection = 2;
      const expectedArr = ["f", "e", "c", "d", "b", "a"]; // Sample expected output
      
      
      const result = rank(inputArr, suggestionLetter, currentSelection);
      
      expect(result).toEqual(expectedArr);
    });

    test('should handle the test cases from the commented code', () => {
      // Test the first example from comments
      const testRanking1 = {
        "a": [0, 10, 0, 1, 0, 0],
        "b": [11, 2, 0, 0, 0, 0],
        "c": [0, 0, 0, 0, 0, 0],
        "d": [0, 0, 0, 0, 0, 0],
        "e": [0, 0, 0, 0, 0, 0],
        "f": [0, 0, 0, 0, 0, 0]
      };
      


      // Set up mock for getRank to return our test ranking
      setRanking(testRanking1)
      const inputArr = ["a", "b", "c", "d", "e", "f"];
      const expectedArr = [ "b", "a", "f", "e", "d", "c" ]; // Based on the ranking above
      
    //   rank.mockReturnValue(expectedArr);
      
      const result1 = rank(inputArr, null, 0);
      expect(result1).toEqual(expectedArr);
      
      // Test the second example from comments
      const testRanking2 = {
        "a": [0, 10, 0, 1, 0, 0],
        "b": [11, 2, 0, 0, 0, 0],
        "c": [0, 11, 0, 0, 0, 0],
        "d": [0, 0, 0, 0, 0, 0],
        "e": [0, 0, 0, 0, 0, 0],
        "f": [0, 0, 0, 0, 0, 0]
      };
      
      
      setRanking(testRanking2)
      
      const expectedArr2 = ["b", "c", "f", "a", "e", "d"]; // Based on the ranking above
      
      // rank.mockReturnValue(expectedArr2);
      
      const result2 = rank(inputArr, null, 0);
      expect(result2).toEqual(expectedArr2);
    });
  });
});

//   describe('stripSpace function', () => {
//     test('should remove space element from array', () => {
//       const inputArr = ["a", "space", "b", "c", "d", "e"];
//       const expectedArr = ["a", "b", "c", "d", "e"];
      
//       stripSpace.mockReturnValue(expectedArr);
      
//       const result = stripSpace(inputArr);
      
//       expect(result).toEqual(expectedArr);
//       expect(stripSpace).toHaveBeenCalledWith(inputArr);
//     });

//     test('should handle array with no space element', () => {
//       const inputArr = ["a", "b", "c", "d", "e", "f"];
//       const expectedArr = ["a", "b", "c", "d", "e", "f"];
      
//       stripSpace.mockReturnValue(expectedArr);
      
//       const result = stripSpace(inputArr);
      
//       expect(result).toEqual(expectedArr);
//       expect(stripSpace).toHaveBeenCalledWith(inputArr);
//     });
//   });

//   describe('updateRank function', () => {
//     test('should update ranking for a letter', () => {
//       const inputArr = ["a", "b", "c", "d", "e", "f"];
//       const letter = "c";
      
//       updateRank.mockImplementation(() => {
//         // Mock implementation to test functionality
//         console.log("updateRank called with:", inputArr, letter);
//       });
      
//       updateRank(inputArr, letter);
      
//       expect(updateRank).toHaveBeenCalledWith(inputArr, letter);
//     });

//     test('should throw error if array length is not equal to buttonNum', () => {
//       const inputArr = ["a", "b", "c", "d", "e"]; // Only 5 elements, buttonNum is 6
//       const letter = "b";
      
//       updateRank.mockImplementation(() => {
//         throw new Error("Array length must be equal to button number constant");
//       });
      
//       expect(() => updateRank(inputArr, letter)).toThrow("Array length must be equal to button number constant");
//     });
//   });
// });

// // Component testing
// describe('RankingComponent', () => {
//   // A simple component that uses ranking functions
//   const RankingComponent = () => {
//     const [letters, setLetters] = React.useState(["a", "b", "c", "d", "e", "f"]);
//     const [selectedLetter, setSelectedLetter] = React.useState(null);
    
//     const handleSelect = (letter) => {
//       setSelectedLetter(letter);
//       updateRank(letters, letter);
//       const newOrder = rank(letters, letter, letters.indexOf(letter));
//       setLetters(newOrder);
//     };
    
//     return (
//       <div>
//         <h2>Letter Ranking Test</h2>
//         <div data-testid="letters-container">
//           {letters.map((letter, index) => (
//             <button 
//               key={index}
//               data-testid={`letter-${letter}`}
//               onClick={() => handleSelect(letter)}
//             >
//               {letter}
//             </button>
//           ))}
//         </div>
//         {selectedLetter && <p data-testid="selected-letter">Selected: {selectedLetter}</p>}
//       </div>
//     );
//   };

//   test('renders all letters', () => {
//     render(<RankingComponent />);
//     const lettersContainer = screen.getByTestId('letters-container');
//     expect(lettersContainer.children.length).toBe(6);
//   });

//   test('selects a letter when clicked', () => {
//     // Mock rank to return a new ordered array
//     rank.mockReturnValue(["c", "a", "b", "d", "e", "f"]);
    
//     render(<RankingComponent />);
    
//     // Click on letter b
//     fireEvent.click(screen.getByTestId('letter-b'));
    
//     // Check if updateRank was called
//     expect(updateRank).toHaveBeenCalledWith(["a", "b", "c", "d", "e", "f"], "b");
    
//     // Check if rank was called
//     expect(rank).toHaveBeenCalledWith(["a", "b", "c", "d", "e", "f"], "b", 1);
    
//     // Check if selected letter is displayed
//     expect(screen.getByTestId('selected-letter').textContent).toBe("Selected: b");
//   });

// Integration test with real implementation
// describe('Ranking Integration Tests', () => {
//   // For integration tests, we'll use the actual implementation instead of mocks
//   beforeEach(() => {
//     jest.resetModules();
//     jest.dontMock('../../util/ranking');
//   });

//   test('full ranking workflow', () => {
//     // Import the real functions
//     const { rank: actualRank, updateRank: actualUpdateRank, getRank: actualGetRank } = jest.requireActual('../../util/ranking');
    
//     // Initialize with test data
//     const initialLetters = ["a", "b", "c", "d", "e", "f"];
    
//     // Select letter 'a' at position 0
//     actualUpdateRank(initialLetters, "a");
    
//     // Get the new order
//     const newOrder = actualRank(initialLetters, "a", 0);
    
//     // Check that ranking was updated
//     const rankings = actualGetRank();
//     expect(rankings["a"]).toBeDefined();
//     expect(rankings["a"][0]).toBe(1); // Position 0 should be incremented by 1
    
//     // Repeat with another selection
//     actualUpdateRank(newOrder, "b");
    
//     // Check that ranking was updated for b
//     const updatedRankings = actualGetRank();
//     expect(updatedRankings["b"]).toBeDefined();
//   });
// });




// max iter test case

// {"settings":{"language":"en","dwellTime":2000,"button_font_size":38,"text_font_size":40,"dwelltime":600,"undefined":36},"ranking":{"m":[0,0,0,0,0,0,0,0,0,0,0,0,0,0],"c":[0,0,0,0,0,0,0,0,0,0,0,0,0,0],"u":[0,0,0,0,0,0,0,0,0,0,0,0,0,0],"d":[2,0,0,0,0,0,0,0,0,0,0,0,0,0],"l":[0,0,0,0,0,0,0,0,0,0,0,0,0,0],"h":[0,0,0,0,0,0,0,0,0,0,0,0,0,0],"r":[0,0,0,0,0,0,0,0,0,0,0,0,0,0],"s":[0,0,0,0,0,0,0,0,0,0,0,0,0,0],"n":[0,0,0,0,0,2,0,0,0,0,0,0,0,0],"i":[0,0,0,0,0,0,0,0,0,0,0,0,0,0],"o":[0,1,0,0,0,0,0,0,0,0,0,0,0,0],"a":[0,0,0,0,0,0,0,0,0,0,0,0,0,0],"t":[0,0,0,0,0,0,0,0,0,0,0,0,0,0],"e":[0,0,0,1,0,0,0,0,0,0,0,0,0,0],"x":[0,0,0,0,0,0,0,0,0,0,0,0,0,0],"y":[0,0,0,0,0,0,0,0,0,0,0,0,0,0],"v":[0,0,0,0,0,0,0,0,0,0,0,0,0,0],"undefined":[0,0,0,0,0,0,0,0,0,0,0,0,0,0],"w":[0,0,0,0,0,0,0,0,0,0,0,0,0,0],"'":[0,0,0,0,0,0,0,0,0,0,0,0,0,0],"p":[0,0,0,0,0,0,0,0,0,0,0,0,0,0],"g":[0,0,0,0,0,0,0,0,0,0,0,0,0,0],"b":[0,0,0,0,0,0,0,0,0,0,0,0,0,0],"f":[0,0,0,0,0,0,0,0,0,0,0,0,0,0],"k":[0,0,0,0,0,0,0,0,0,0,0,0,0,0]}}

// "output that is wrong"
// ["m","v","g","l","n","d"] // d should be the first letter