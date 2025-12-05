import Snake from "./Snake";

type Cell = "snake" | "food" | null;

// Charger les images uniquement côté client
let tete: HTMLImageElement | null = null;
let corps: HTMLImageElement | null = null;
let queue: HTMLImageElement | null = null;
let imagesLoaded = false;

const loadImages = () => {
  // Vérifier qu'on est côté client
  if (typeof window === "undefined") return Promise.resolve();

  tete = new Image();
  corps = new Image();
  queue = new Image();

  tete.src = "img/tete.png";
  corps.src = "img/corps.png";
  queue.src = "img/queue.png";

  return Promise.all([
    new Promise<void>((resolve) => {
      if (tete && tete.complete && tete.naturalWidth !== 0) resolve();
      else if (tete) {
        tete.onload = () => resolve();
        tete.onerror = () => { console.error("Erreur chargement tete.png"); resolve(); };
      } else {
        resolve();
      }
    }),
    new Promise<void>((resolve) => {
      if (corps && corps.complete && corps.naturalWidth !== 0) resolve();
      else if (corps) {
        corps.onload = () => resolve();
        corps.onerror = () => { console.error("Erreur chargement corps.png"); resolve(); };
      } else {
        resolve();
      }
    }),
    new Promise<void>((resolve) => {
      if (queue && queue.complete && queue.naturalWidth !== 0) resolve();
      else if (queue) {
        queue.onload = () => resolve();
        queue.onerror = () => { console.error("Erreur chargement queue.png"); resolve(); };
      } else {
        resolve();
      }
    })
  ]).then(() => {
    imagesLoaded = true;
    console.log("Images chargées avec succès");
  });
};

// Charger les images uniquement côté client
if (typeof window !== "undefined") {
  loadImages();
}

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

  private animationId: number | null = null;
  private isRunning: boolean = false;

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

  start() {
    if (this.isRunning) return;
    this.internalPlayState = true;
    this.isRunning = true;
    this.currentFrameCount = 0;
    this.animationId = requestAnimationFrame(() => this.animate(this.internalPlayState));
  }

  stop() {
    this.internalPlayState = false;
    this.isRunning = false;
    if (this.animationId != null) {
      cancelAnimationFrame(this.animationId);
      this.animationId = null;
    }
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

  private generateGrid() {
    const cellSize = this.boardSidesLength / this.numOfRowsAndCols;

    for (let row = 0; row < this.numOfRowsAndCols; row++) {
      for (let col = 0; col < this.numOfRowsAndCols; col++) {
        this.context.fillStyle = "white";
        this.context.fillRect(col * cellSize, row * cellSize, cellSize, cellSize);
      }
    }
  }

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

          const isTail =
              this.snake.tailCoordinate.row === rowIndex &&
              this.snake.tailCoordinate.col === colIndex;

          let img = corps;
          let direction = this.snake.movement;

          if (isHead) {
            img = tete;
            direction = this.snake.movement;
          } else if (isTail) {
            img = queue;
            direction = this.snake.tailDirection;
          }

          if (imagesLoaded && img && img.complete && img.naturalWidth !== 0) {
            // Si c'est la tête ou la queue, appliquer une rotation selon la direction
            if (isHead || isTail) {
              this.context.save();

              // Se déplacer au centre de la cellule
              this.context.translate(x + cellWidth / 2, y + cellHeight / 2);

              // Rotation selon la direction
              switch (direction) {
                case "to right":
                  this.context.rotate(0); // 0°
                  break;
                case "to bottom":
                  this.context.rotate(Math.PI / 2); // 90°
                  break;
                case "to left":
                  this.context.rotate(Math.PI); // 180°
                  break;
                case "to top":
                  this.context.rotate(-Math.PI / 2); // -90°
                  break;
              }

              // Dessiner l'image centrée
              this.context.drawImage(img, -cellWidth / 2, -cellHeight / 2, cellWidth, cellHeight);

              this.context.restore();
            } else {
              // Pour le corps, pas de rotation
              this.context.drawImage(img, x, y, cellWidth, cellHeight);
            }
          } else {
            this.context.fillStyle = isHead ? "#2E7D32" : (isTail ? "#8BC34A" : "#A2C579");
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

  private setFoodOnBoard() {
    const fc = this.foodCoordinate;
    if (fc && fc.row >= 0 && fc.col >= 0) {
      this.gameBoard[fc.row][fc.col] = "food";
    }
  }

  private setSnakeOnBoard() {
    const newBoard: Cell[][] = new Array(this.numOfRowsAndCols)
        .fill(0)
        .map(() => new Array<Cell>(this.numOfRowsAndCols).fill(null));

    this.snake.bodyCoordinates.forEach((p) => {
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

  private renderBoard() {
    this.setSnakeOnBoard();
    this.setFoodOnBoard();

    this.generateGrid();
    this.renderContent();
    this.drawGridLines();
  }

  private snakeIsOutOfBounds() {
    const h = this.snake.headCoordinate;
    const max = this.numOfRowsAndCols - 1;
    const isOut = h.row < 0 || h.row > max || h.col < 0 || h.col > max;
    if (isOut) {
      console.log("🚫 OUT OF BOUNDS:", h, "max:", max);
    }
    return isOut;
  }

  private snakeHitsBody() {
    const body = this.snake.bodyCoordinates.slice(0, -1);
    const head = this.snake.headCoordinate;
    const hits = body.some((b) => b.row === head.row && b.col === head.col);
    if (hits) {
      console.log("💥 HIT BODY!");
      console.log("Head:", head);
      console.log("Body:", body);
      console.log("All coordinates:", this.snake.bodyCoordinates);
      console.log("Food:", this._foodCoordinate);
    }
    return hits;
  }

  private isGameOver() {
    return this.snakeIsOutOfBounds() || this.snakeHitsBody();
  }

  animate(isPlaying: boolean) {
    this.internalPlayState = isPlaying;

    if (this.currentFrameCount < this.staggerFrame) {
      this.currentFrameCount++;
    } else {
      this.currentFrameCount = 0;

      if (this.score !== this.externalScore) this.setScore(this.score);

      // 1) Déplacer le serpent
      this.snake.move(this.foodCoordinate);

      // 2) Mettre à jour la nourriture si mangée AVANT de tester le game over
      if (this.snake.justAte) {
        console.log("🍎 Snake ate! Old food:", this._foodCoordinate);
        this.foodCoordinate = { row: -1, col: -1 };
        console.log("🍎 New food:", this._foodCoordinate);
      }

      // 3) Tester le game over
      if (this.isGameOver()) {
        this.setIsGameOver(true);
        this.stop();
        return;
      }

      // 4) Dessiner
      this.context.clearRect(0, 0, this.boardSidesLength, this.boardSidesLength);
      this.renderBoard();
    }

    if (this.internalPlayState) {
      if (this.animationId != null) {
        cancelAnimationFrame(this.animationId);
        this.animationId = null;
      }
      this.animationId = requestAnimationFrame(() => this.animate(this.internalPlayState));
    } else {
      this.stop();
    }
  }

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