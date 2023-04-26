import React, { useState } from 'react';
import './App.css';

function newPuzzle() {
    return [
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0]
    ];
}

function possible(arr, y, x, num) {
    for (let i = 0; i < 9; i++) {
        if (arr[y][i] === num)
            return false;
    }
    for (let i = 0; i < 9; i++) {
        if (arr[i][x] === num)
            return false;
    }
    var x0 = Math.floor(x / 3) * 3;
    var y0 = Math.floor(y / 3) * 3;
    for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
            if (arr[y0 + j][x0 + i] === num)
                return false;
        }
    }
    return true;
}


function randomNum(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min; // You can remove the Math.floor if you don't want it to be an integer
}

function printGrid(arr) {
    let result = "";
    for (let x = 0; x < 9; x++) {
        for (let y = 0; y < 9; y++) {
            result += arr[y][x] + " ";
        }
        result += "\n";
    }
    console.log(result);
}


function App() {

    const [selected, setSelected] = useState({ row: -1, column: -1 });
    const [grid, setGrid] = useState(newPuzzle());
    const [puzzle, setPuzzle] = useState(getDeepCopy(grid));
    const [infoText, setInfoText] = useState("Click create to create a new puzzle!");
    const numToColor = {
        0: 'rgb(42,42,42)',
        1: 'red',
        2: 'orange',
        3: 'yellow',
        4: 'green',
        5: 'blue',
        6: 'indigo',
        7: 'violet',
        8: 'white',
        9: 'black'
    };

    function getDeepCopy(arr) {
        return JSON.parse(JSON.stringify(arr));
    }

    function handlePaletteClick(number) {
        //console.log("scrolling over " + row + " " + column);
        if (selected.row === -1) return;
        if (number === 0) {

        } else if (!possible(puzzle, selected.row, selected.column, number)) {
            setInfoText("That color can't go there.");
            return;
        }

        var tempGrid = getDeepCopy(puzzle);
        tempGrid[selected.row][selected.column] = number;
        setPuzzle(tempGrid);
    }


    function handleCellClick(row, column) {
        //alert("selected: row: " + selected.row + ", column: " + selected.column);
        if (grid[row][column] !== 0) {
            setInfoText("Can't edit that one.");
            return;
        }
        setSelected({ row: row, column: column });
        setInfoText("You got this.")
    }

    function solve(arr, printedOneSolution) {
        if (printedOneSolution.bool)
            return;
        for (let y = 0; y < 9; y++) {
            for (let x = 0; x < 9; x++) {
                if (arr[y][x] === 0) {
                    for (let n = 1; n < 10; n++) {
                        if (possible(arr, y, x, n)) {
                            arr[y][x] = n;
                            solve(arr, printedOneSolution);
                            arr[y][x] = 0;
                        }
                    }
                    return;
                }
            }
        }
        printedOneSolution.bool = true;
        // printGrid(arr);
        setPuzzle(getDeepCopy(arr));

    }


    function generatePuzzle() {
        let a = newPuzzle();

        // sets three diagonal squares of 9 numbers all to random numbers
        for (let x = 0; x < 3; x++) {
            for (let y = 0; y < 3; y++) {
                while (true) {
                    let trying = randomNum(1, 9);
                    if (possible(a, y, x, trying)) {
                        a[y][x] = trying;
                        break;
                    }
                }
            }
        }
        for (let x = 3; x < 6; x++) {
            for (let y = 3; y < 6; y++) {
                while (true) {
                    let trying = randomNum(1, 9);
                    if (possible(a, y, x, trying)) {
                        a[y][x] = trying;
                        break;
                    }
                }
            }
        }
        for (let x = 6; x < 9; x++) {
            for (let y = 6; y < 9; y++) {
                while (true) {
                    let trying = randomNum(1, 9);
                    if (possible(a, y, x, trying)) {
                        a[y][x] = trying;
                        break;
                    }
                }
            }
        }

        // printf("generated diagonal matrices:\n");
        // printGrid(a);

        let bool = { created: false };
        generatePuzzleHelper(a, bool); // solves the puzzle, then removes a maximum of 54 numbers from it, then prints the puzzle!
    }

    function generatePuzzleHelper(arr, bool) {
        if (bool.created)
            return;
        for (let y = 0; y < 9; y++) {
            for (let x = 0; x < 9; x++) {
                if (arr[y][x] === 0) {
                    for (let n = 1; n < 10; n++) {
                        if (possible(arr, y, x, n)) {
                            arr[y][x] = n;
                            generatePuzzleHelper(arr, bool);
                            arr[y][x] = 0;
                        }
                    }
                    return;
                }
            }
        }
        bool.created = true;
        // printf("Puzzle solved:\n");
        // printGrid(arr);
        let times = 0;
        let maxTimes = 40 + randomNum(0, 14);
        setInfoText("Created puzzle with " + (81 - maxTimes) + " cells filled.");
        while (times <= maxTimes) {
            // printf("Grid with %d numbers removed:\n", times);
            // printGrid(arr);
            // printf("\n");
            let x = randomNum(0, 8);
            let y = randomNum(0, 8);
            if (arr[y][x] === 0)
                continue;

            let temp = arr[y][x];
            arr[y][x] = 0;

            let b = newPuzzle();
            for (let x0 = 0; x0 < 9; x0++) {
                for (let y0 = 0; y0 < 9; y0++) {
                    b[y0][x0] = arr[y0][x0];
                }
            }

            let int = { solutions: 0 };
            solutionCounter(b, int);
            // printf("solutions: %d\n", solutions);
            if (int.solutions !== 1) {
                arr[y][x] = temp;
                continue;
            }
            times++;
        }
        // printGrid(arr);
        setPuzzle(getDeepCopy(arr));
        setGrid(getDeepCopy(arr));
    }

    function solutionCounter(arr, int) {
        if (int.solutions >= 2)
            return;
        for (let y = 0; y < 9; y++) {
            for (let x = 0; x < 9; x++) {
                if (arr[y][x] === 0) {
                    for (let n = 1; n < 10; n++) {
                        if (possible(arr, y, x, n)) {
                            arr[y][x] = n;
                            solutionCounter(arr, int);
                            arr[y][x] = 0;
                        }
                    }
                    return;
                }
            }
        }
        int.solutions += 1;
    }


    // function to create sudoku 
    function createSudoku() {
        setSelected({ row: -1, column: -1 });
        generatePuzzle();
    }

    // function to solve sudoku
    function solveSudoku() {
        setInfoText("Solved puzzle.")
        let printed = { bool: false };
        solve(getDeepCopy(puzzle), printed);
    }

    // function to reset sudoku
    function resetSudoku() {
        setPuzzle(getDeepCopy(grid));
        let filled = true;
        for (let x = 0; x < 9; x++) {
            for (let y = 0; y < 9; y++) {
                if (grid[y][x] === 0) filled = false;
            }
        }
        if (filled === true) {
            setInfoText("Click create to generate a new puzzle.");
        } else {
            setInfoText("Puzzle reset.");
        }
    }

    // function to check sudoku
    function checkSudoku() {
        let int = { solutions: 0 };
        let tempGrid = getDeepCopy(puzzle);
        solutionCounter(tempGrid, int);
        if (int.solutions === 0) {
            setInfoText("No solution. Hit reset to try again!");
        } else {
            let filled = true;
            for (let x = 0; x < 9; x++) {
                for (let y = 0; y < 9; y++) {
                    if (puzzle[y][x] === 0) filled = false;
                }
            }
            if (filled === true) {
                setSelected({ row: -1, column: -1 });
                setGrid(getDeepCopy(puzzle));
                setInfoText("Puzzle solved. Click create to generate a new puzzle.")
            } else
                setInfoText("Still solveable! Keep at it.");
        }
    }

    return (
        <div className="App">
            <div className="App-header">
                <h3 className="titleText"> Color Sudoku.</h3>
                <h4 className='infoText'>{infoText}</h4>
                <div className="buttonContainer">
                    <button className="createButton" onClick={createSudoku}>Create</button>
                    <button className="checkButton" onClick={checkSudoku}>Check</button>
                    <button className="solveButton" onClick={solveSudoku}>Solve</button>
                    <button className="resetButton" onClick={resetSudoku}>Reset</button>
                </div>
                <table className="board">
                    <tbody>
                        {
                            [0, 1, 2, 3, 4, 5, 6, 7, 8].map((row, rIndex) => {
                                return <tr key={rIndex} className={(row + 1) % 3 === 0 ? 'bBorder' : ''} >
                                    {
                                        [0, 1, 2, 3, 4, 5, 6, 7, 8].map((column, cIndex) => {
                                            return <td key={rIndex + cIndex} className={(column + 1) % 3 === 0 ? 'rBorder' : ''} >
                                                <div className="cell" style={{ backgroundColor: numToColor[puzzle[row][column]], borderColor: (selected.row === row && selected.column === column) ? 'white' : (grid[row][column] !== 0) ? numToColor[puzzle[row][column]] : 'rgb(30,30,30)' }} onClick={() => { handleCellClick(row, column) }} ></div>
                                            </td>
                                        })
                                    }
                                </tr>
                            })
                        }
                    </tbody>
                </table>

                <h4 className='paletteText' > Select a cell above and choose its color below:</h4>
                <table className='palette'>
                    <tbody>
                        <tr>
                            {
                                [0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((number, numIndex) => {
                                    return <td key={numIndex}>
                                        <div className="cell" style={{ backgroundColor: numToColor[number] }} onClick={() => handlePaletteClick(number)} ></div>
                                    </td>
                                })
                            }
                        </tr>
                    </tbody>
                </table>
                {/* create buttons  */}
            </div>
        </div>
    );
}

export default App;
