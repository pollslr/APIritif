import { Coordinate } from "./SnakeGame";

type SnakeMovements = "to right" | "to left" | "to bottom" | "to top";

export default class Snake {
  private movement: SnakeMovements;
  private _bodyCoordinates: Coordinate[];
  private allowMovementChange: boolean;
  justAte: boolean;
  readonly defaultlength: number;

  constructor() {
    this.movement = "to right";
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

  changeMovement(newMove: SnakeMovements) {
    if (!this.allowMovementChange) return;

    const oppositeRows =
        (newMove === "to bottom" && this.movement === "to top") ||
        (newMove === "to top" && this.movement === "to bottom");

    const oppositeColumns =
        (newMove === "to right" && this.movement === "to left") ||
        (newMove === "to left" && this.movement === "to right");

    // Interdire un demi-tour instantané
    if (oppositeRows || oppositeColumns) return;

    this.movement = newMove;
    this.allowMovementChange = false;
  }

  private canEat(nextHead: Coordinate, foodCoord: Coordinate) {
    return nextHead.col === foodCoord.col && nextHead.row === foodCoord.row;
  }

  move(foodCoord: Coordinate) {
    let nextHead: Coordinate = { ...this.headCoordinate };

    switch (this.movement) {
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