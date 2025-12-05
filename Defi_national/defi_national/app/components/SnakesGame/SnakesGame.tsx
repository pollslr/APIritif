'use client';

import { useState, useEffect } from "react";
import SnakeBoard from "./SnakesBoard";
import GameOverModal from "./GameOverModal";
import PausedModal from "./PausedModal";

import "./styles.css";

export const HIGH_SCORE_KEY = "high-score";

export default function SnakesGame() {
  const [score, setScore] = useState(0);
  const [isGameOver, setIsGameOver] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [justStarted, setJustStarted] = useState(true);
  const [highScore, setHighScore] = useState(0);

  // Gérer localStorage côté client uniquement
  useEffect(() => {
    if (typeof window !== 'undefined') {
      if (localStorage.getItem(HIGH_SCORE_KEY) === null) {
        localStorage.setItem(HIGH_SCORE_KEY, "0");
      }
      setHighScore(Number(localStorage.getItem(HIGH_SCORE_KEY)));
    }
  }, []);

  const handleBodyClick = () => {
    if (justStarted) {
      setIsPlaying(true);
      setJustStarted(false);
      setScore(0);
      return;
    }

    !isGameOver && setIsPlaying(!isPlaying);
  };

  return (
      <div id="snakes-game-container" onClick={handleBodyClick}>
        <h1 id="game-title">Snake Game</h1>
        <p className="high-score">High Score: {highScore}</p>

        {justStarted ? (
            <p className="new-game-hint">Click anywhere to start</p>
        ) : (
            <>
              <p className="score">
                <span>Score</span>
                <span>{score}</span>
              </p>
              <p className="pause-hint">
                <strong>PAUSE:</strong> Click Anywhere or Press <kbd>esc</kbd>
              </p>
            </>
        )}

        {!isGameOver && !justStarted && (
            <SnakeBoard
                isPlaying={isPlaying}
                setIsPlaying={setIsPlaying}
                externalScore={score}
                setScore={setScore}
                setIsGameOver={setIsGameOver}
            />
        )}

        {isGameOver && (
            <GameOverModal
                setIsGameOver={setIsGameOver}
                setIsPlaying={setIsPlaying}
                finalScore={score}
                setJustStarted={setJustStarted}
                setScore={setScore}
            />
        )}

        {justStarted
            ? ""
            : !isGameOver &&
            !isPlaying && <PausedModal setIsPlaying={setIsPlaying} />}
      </div>
  );
}