import Snake from "./Snake";
import teteImg from "../../assets/tete.png";
import corpsImg from "../../assets/corps.png";

type Cell = "snake" | "food" | null;

// Charger les images
const tete = new Image();
const corps = new Image();

tete.src = teteImg;
corps.src = corpsImg;

// Variable pour tracker si les images sont chargées
let imagesLoaded = false;

// Charger les images de manière asynchrone
const loadImages = () => {
  return Promise.all([
    new Promise<void>((resolve) => {
      if (tete.complete && tete.naturalWidth !== 0) {
        resolve();
      } else {
        tete.onload = () => resolve();
        tete.onerror = () => {
          console.error("Erreur chargement tete.png");
          resolve();
        };
      }
    }),
    new Promise<void>((resolve) => {
      if (corps.complete && corps.naturalWidth !== 0) {
        resolve();
      } else {
        corps.onload = () => resolve();
        corps.onerror = () => {
          console.error("Erreur chargement corps.png");
          resolve();
        };
      }
    })
  ]).then(() => {
    imagesLoaded = true;
    console.log("Images chargées avec succès");
  });
};

// Lancer le chargement
loadImages();

export interface Coordinate {
  row: number;
  col: number;
}

export class SnakeGameEngine {
  private context: CanvasRenderingContext2D;
  private boardSidesLength: number;
  private numOfRowsAndCols: number;
  private _gameBoard: Cell[][];
  private _foodCoordinate: Coordinate;

  private readonly staggerFrame: number;
  private currentFrameCount: number;

  private externalScore: number;
  private setScore: React.Dispatch<React.SetStateAction<number>>;
  private setIsGameOver: React.Dispatch<React.SetStateAction<boolean>>;

  private internalPlayState: boolean;

  snake: Snake;

  constructor(
      context: CanvasRenderingContext2D,
      boardSidesLength: number,
      externalScore: number,
      setScore: React.Dispatch<React.SetStateAction<number>>,
      setIsGameOver: React.Dispatch<React.SetStateAction<boolean>>,
      isPlaying: boolean
  ) {
    this.context = context;

    this.snake = new Snake();
    this._foodCoordinate = { row: -1, col: -1 };

    this.boardSidesLength = boardSidesLength;
    this.numOfRowsAndCols = 26;

    this._gameBoard = [];

    this.externalScore = externalScore;
    this.setScore = setScore;
    this.setIsGameOver = setIsGameOver;

    this.currentFrameCount = 0;
    this.staggerFrame = 8;

    this.internalPlayState = isPlaying;
  }

  get score() {
    if (this.snake.length === 0) return 0;
    return this.snake.length * 10 - this.snake.defaultlength * 10;
  }

  private get gameBoard(): Cell[][] {
    if (this._gameBoard.length === 0) {
      for (let i = 0; i < this.numOfRowsAndCols; i++) {
        const row: Cell[] = new Array(this.numOfRowsAndCols).fill(null);
        this._gameBoard.push(row);
      }
    }
    return this._gameBoard;
  }

  private set gameBoard(newGameBoard: Cell[][]) {
    this._gameBoard = newGameBoard;
  }

  private get foodCoordinate() {
    const isOnSnake = (r: number, c: number) =>
        this.snake.bodyCoordinates.some((s) => s.row === r && s.col === c);

    if (this._foodCoordinate.row < 0 || this._foodCoordinate.col < 0) {
      let row = Math.floor(Math.random() * this.numOfRowsAndCols);
      let col = Math.floor(Math.random() * this.numOfRowsAndCols);

      while (isOnSnake(row, col)) {
        row = Math.floor(Math.random() * this.numOfRowsAndCols);
        col = Math.floor(Math.random() * this.numOfRowsAndCols);
      }

      this._foodCoordinate = { row, col };
    }

    return this._foodCoordinate;
  }

  private set foodCoordinate(newCoord: Coordinate) {
    const isOnSnake = (r: number, c: number) =>
        this.snake.bodyCoordinates.some((s) => s.row === r && s.col === c);

    if (newCoord.row < 0 || newCoord.col < 0) {
      let row = Math.floor(Math.random() * this.numOfRowsAndCols);
      let col = Math.floor(Math.random() * this.numOfRowsAndCols);

      while (isOnSnake(row, col)) {
        row = Math.floor(Math.random() * this.numOfRowsAndCols);
        col = Math.floor(Math.random() * this.numOfRowsAndCols);
      }

      this._foodCoordinate = { row, col };
    } else {
      this._foodCoordinate = newCoord;
    }
  }

  // ----[ GRID BACKGROUND ]-----------------------------

  private generateGrid() {
    const cellSize = this.boardSidesLength / this.numOfRowsAndCols;

    for (let row = 0; row < this.numOfRowsAndCols; row++) {
      for (let col = 0; col < this.numOfRowsAndCols; col++) {
        this.context.fillStyle = "white";
        this.context.fillRect(col * cellSize, row * cellSize, cellSize, cellSize);
      }
    }
  }

  // ----[ DRAW SNAKE + FOOD ]---------------------------

  private renderContent() {
    const cellWidth = this.boardSidesLength / this.numOfRowsAndCols;
    const cellHeight = this.boardSidesLength / this.numOfRowsAndCols;

    this.gameBoard.forEach((row, rowIndex) => {
      row.forEach((cell, colIndex) => {
        const x = colIndex * cellWidth;
        const y = rowIndex * cellHeight;

        if (cell === "snake") {
          const isHead =
              this.snake.headCoordinate.row === rowIndex &&
              this.snake.headCoordinate.col === colIndex;

          const img = isHead ? tete : corps;

          // Dessiner l'image si elle est chargée, sinon utiliser la couleur de fallback
          if (imagesLoaded && img.complete && img.naturalWidth !== 0) {
            this.context.drawImage(img, x, y, cellWidth, cellHeight);
          } else {
            // Couleur de fallback si l'image n'est pas disponible
            this.context.fillStyle = isHead ? "#2E7D32" : "#A2C579";
            this.context.fillRect(x, y, cellWidth, cellHeight);
          }
        }

        if (cell === "food") {
          this.context.fillStyle = "salmon";
          this.context.fillRect(x, y, cellWidth, cellHeight);
        }
      });
    });
  }

  // ----[ UPDATE BOARD STATE ]--------------------------

  private setFoodOnBoard() {
    if (this.snake.justAte) {
      this.foodCoordinate = { row: -1, col: -1 };
    }

    const fc = this.foodCoordinate;
    if (fc && fc.row >= 0 && fc.col >= 0) {
      this.gameBoard[fc.row][fc.col] = "food";
    }
  }

  private setSnakeOnBoard() {
    // Créer un nouveau board pour éviter les mutations
    const newBoard: Cell[][] = new Array(this.numOfRowsAndCols)
        .fill(0)
        .map(() => new Array<Cell>(this.numOfRowsAndCols).fill(null));

    this.snake.bodyCoordinates.forEach((p) => {
      // Vérification des limites
      if (
          p.row >= 0 &&
          p.row < this.numOfRowsAndCols &&
          p.col >= 0 &&
          p.col < this.numOfRowsAndCols
      ) {
        newBoard[p.row][p.col] = "snake";
      }
    });

    this.gameBoard = newBoard;
  }

  // ----[ RENDER BOARD ]--------------------------------

  private renderBoard() {
    this.setSnakeOnBoard();
    this.setFoodOnBoard();

    // Dessiner le fond en premier
    this.generateGrid();

    // Puis dessiner le contenu (snake & food)
    this.renderContent();

    // Enfin dessiner les lignes de la grille par-dessus
    this.drawGridLines();
  }

  // ----[ COLLISIONS ]---------------------------------

  private snakeIsOutOfBounds() {
    const h = this.snake.headCoordinate;
    const max = this.numOfRowsAndCols - 1;
    return h.row < 0 || h.row > max || h.col < 0 || h.col > max;
  }

  private snakeHitsBody() {
    const body = this.snake.bodyCoordinates.slice(0, -1);
    const head = this.snake.headCoordinate;
    return body.some((b) => b.row === head.row && b.col === head.col);
  }

  private isGameOver() {
    return this.snakeIsOutOfBounds() || this.snakeHitsBody();
  }

  // ----[ GAME LOOP ]-----------------------------------

  animate(isPlaying: boolean) {
    this.internalPlayState = isPlaying;

    if (this.currentFrameCount < this.staggerFrame) {
      this.currentFrameCount++;
    } else {
      this.currentFrameCount = 0;

      if (this.score !== this.externalScore) this.setScore(this.score);

      if (this.isGameOver()) {
        this.setIsGameOver(true);
        return;
      }

      this.context.clearRect(0, 0, this.boardSidesLength, this.boardSidesLength);

      this.renderBoard();
      this.snake.move(this.foodCoordinate);
    }

    if (this.internalPlayState) {
      requestAnimationFrame(() => this.animate(this.internalPlayState));
    }
  }

  // ----[ GRID LINES ]---------------------------------

  private drawGridLines() {
    const cellSize = this.boardSidesLength / this.numOfRowsAndCols;
    this.context.strokeStyle = "rgba(0, 0, 0, 0.15)";
    this.context.lineWidth = 1;

    for (let x = 0; x <= this.boardSidesLength; x += cellSize) {
      this.context.beginPath();
      this.context.moveTo(x, 0);
      this.context.lineTo(x, this.boardSidesLength);
      this.context.stroke();
    }

    for (let y = 0; y <= this.boardSidesLength; y += cellSize) {
      this.context.beginPath();
      this.context.moveTo(0, y);
      this.context.lineTo(this.boardSidesLength, y);
      this.context.stroke();
    }
  }
}