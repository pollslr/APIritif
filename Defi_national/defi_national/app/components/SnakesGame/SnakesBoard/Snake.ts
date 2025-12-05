import { Coordinate } from "./SnakeGame";

export type SnakeMovements = "to right" | "to left" | "to bottom" | "to top";

export default class Snake {
  private _movement: SnakeMovements;
  private _bodyCoordinates: Coordinate[];
  private allowMovementChange: boolean;
  justAte: boolean;
  readonly defaultlength: number;

  constructor() {
    this._movement = "to right";
    this.defaultlength = 3;
    this.allowMovementChange = true;
    this.justAte = false;

    // Initialisation du serpent (une seule fois)
    const start: Coordinate = { row: 1, col: 1 };
    this._bodyCoordinates = [];

    for (let i = 0; i < this.defaultlength; i++) {
      this._bodyCoordinates.push({
        row: start.row,
        col: start.col + i
      });
    }
  }

  get length() {
    return this._bodyCoordinates.length;
  }

  get movement() {
    return this._movement;
  }

  get bodyCoordinates() {
    return this._bodyCoordinates;
  }

  private set bodyCoordinates(newSnakeCoords: Coordinate[]) {
    this._bodyCoordinates = newSnakeCoords;
  }

  // La tête est TOUJOURS le dernier élément du tableau
  get headCoordinate(): Coordinate {
    return this._bodyCoordinates[this._bodyCoordinates.length - 1];
  }

  // La queue est TOUJOURS le premier élément du tableau
  get tailCoordinate(): Coordinate {
    return this._bodyCoordinates[0];
  }

  // Direction de la queue (pointe vers le segment suivant)
  get tailDirection(): SnakeMovements {
    if (this._bodyCoordinates.length < 2) return this._movement;

    const tail = this._bodyCoordinates[0];
    const nextSegment = this._bodyCoordinates[1];

    if (nextSegment.col > tail.col) return "to right";
    if (nextSegment.col < tail.col) return "to left";
    if (nextSegment.row > tail.row) return "to bottom";
    if (nextSegment.row < tail.row) return "to top";

    return this._movement;
  }

  changeMovement(newMove: SnakeMovements) {
    if (!this.allowMovementChange) return;

    const oppositeRows =
        (newMove === "to bottom" && this._movement === "to top") ||
        (newMove === "to top" && this._movement === "to bottom");

    const oppositeColumns =
        (newMove === "to right" && this._movement === "to left") ||
        (newMove === "to left" && this._movement === "to right");

    // Interdire un demi-tour instantané
    if (oppositeRows || oppositeColumns) return;

    this._movement = newMove;
    this.allowMovementChange = false;
  }

  private canEat(nextHead: Coordinate, foodCoord: Coordinate) {
    return nextHead.col === foodCoord.col && nextHead.row === foodCoord.row;
  }

  move(foodCoord: Coordinate) {
    let nextHead: Coordinate = { ...this.headCoordinate };

    switch (this._movement) {
      case "to right":
        nextHead.col += 1;
        break;
      case "to left":
        nextHead.col -= 1;
        break;
      case "to top":
        nextHead.row -= 1;
        break;
      case "to bottom":
        nextHead.row += 1;
        break;
    }

    // Nouveau serpent
    let newSnakeCoordinates = [...this._bodyCoordinates];

    if (this.canEat(nextHead, foodCoord)) {
      // Le serpent grandit
      newSnakeCoordinates.push(nextHead);
      this.justAte = true;
    } else {
      // Avancer : retirer la queue, ajouter une tête
      newSnakeCoordinates.shift();
      newSnakeCoordinates.push(nextHead);
      this.justAte = false;
    }

    this.bodyCoordinates = newSnakeCoordinates;
    this.allowMovementChange = true;
  }
}