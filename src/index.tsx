import React, { useState } from "react";
import ReactDOM from "react-dom";
import "./index.css";
import { type } from "os";

type SquareType = string | null;

type SquareProps = {
  value: SquareType;
  onClick: () => void;
};

type BoardProps = {
  squares: SquareType[];
  onClick: (i: number) => void;
};

const BoardValue = {
  PLAYER1: "X",
  PLAYER2: "O",
};

// ます目を表すクラス
const Square: React.FC<SquareProps> = ({ value, onClick }) => {
  return (
    <button className="square" onClick={onClick}>
      {value}
    </button>
  );
};

// ゲーム全体を表示するクラス
const Board: React.FC<BoardProps> = ({squares, onClick}) => {
  const renderSquare = (i: number) => {
    return <Square value={squares[i]} onClick={() => onClick(i)} />;
  };
  return (
    <div>
      <div className="board-row">
        {renderSquare(0)}
        {renderSquare(1)}
        {renderSquare(2)}
      </div>
      <div className="board-row">
        {renderSquare(3)}
        {renderSquare(4)}
        {renderSquare(5)}
      </div>
      <div className="board-row">
        {renderSquare(6)}
        {renderSquare(7)}
        {renderSquare(8)}
      </div>
    </div>
  );
};

type HistoryData = {
  squares: SquareType[];
};

type History = HistoryData[];

const Game = () => {
  const [history, setHistory] = useState<History>([
    {
      squares: Array<SquareType>(9).fill(null),
    },
  ]);
  const [stepNumber, setStepNumber] = useState(0);
  const [xIsNext, setXIsNext] = useState(true);

  const handleClick = (i: number) => {
    const history1 = history.slice(0, stepNumber + 1);
    const current = history1[history1.length - 1];
    const squares = current.squares.slice();
    if (calculateWinner(squares) || squares[i]) {
      return;
    }
    squares[i] = xIsNext ? BoardValue.PLAYER1 : BoardValue.PLAYER2;
    setHistory(history.concat([{ squares: squares }]));
    setXIsNext(!xIsNext);
    setStepNumber(history.length);
  };

  const jumpTo = (step: number) => {
    setStepNumber(step);
    setXIsNext(step % 2 === 0);
  };

  const history2 = history;
  const current = history2[stepNumber];
  const winner = calculateWinner(current.squares);

  const moves = history.map((step, move) => {
    const desc = move ? `Go to move #${move}` : "Go to game start";
    return (
      <li key={move}>
        <button onClick={() => jumpTo(move)}>{desc}</button>
      </li>
    );
  });

  const status = winner
    ? `Winner: ${winner}`
    : `Next player: ${xIsNext ? BoardValue.PLAYER1 : BoardValue.PLAYER2}`;

  return (
    <div className="game">
      <div className="game-board">
        <Board
          squares={current.squares}
          onClick={(i: number) => handleClick(i)}
        />
      </div>
      <div className="game-info">
        <div>{status}</div>
        <ol>{moves}</ol>
      </div>
    </div>
  );
};

function calculateWinner(squares: SquareType[]): SquareType {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  return null;
}

// ========================================

ReactDOM.render(<Game />, document.getElementById("root"));
