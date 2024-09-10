const readline = require("readline");

class Matrix {
  constructor(matrix) {
    this.matrix = matrix;
  }

  printField() {
    for (let i = 0; i < this.matrix.length; i++) {
      let row = "";
      for (let j = 0; j < this.matrix[i].length; j++) {
        row += this.matrix[i][j] + " ";
      }
      console.log(row);
    }
  }
}

class Algorithm {
  constructor(matrix) {
    this.matrix = matrix;
    this.length = matrix.length;
    this.visited = [];

    for (let i = 0; i < this.length; i++) {
      this.visited[i] = new Array(this.length).fill(false);
    }
  }

  areaToDelete(x, y) {
    const selectedSymbol = this.matrix[x][y];
    const queue = [[x, y]];
    const arrayToDelete = [];

    while (queue.length > 0) {
      const [currentX, currentY] = queue.shift();

      if (this.visited[currentX][currentY]) continue;

      this.visited[currentX][currentY] = true;
      arrayToDelete.push([currentX, currentY]);

      const directions = [
        [-1, 0],
        [1, 0],
        [0, -1],
        [0, 1],
      ];

      directions.forEach(([dx, dy]) => {
        const newX = currentX + dx;
        const newY = currentY + dy;

        if (
          this.isValidCoordinate(newX, newY) &&
          !this.visited[newX][newY] &&
          this.matrix[newX][newY] === selectedSymbol
        ) {
          queue.push([newX, newY]);
        }
      });
    }

    this.deleteElemets(arrayToDelete);
  }

  deleteElemets(arrayToDelete) {
    for (const [x, y] of arrayToDelete) {
      this.matrix[x][y] = " ";
    }
  }

  isValidCoordinate(x, y) {
    return x >= 0 && x < this.length && y >= 0 && y < this.length;
  }
}

class UserInteraction {
  constructor(matrix) {
    this.matrix = new Matrix(matrix);
    this.algorithm = new Algorithm(matrix);
    this.inputOutputInterface = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });
  }

  question(prompt) {
    return new Promise((resolve) =>
      this.inputOutputInterface.question(prompt, resolve)
    );
  }

  async execute() {
    console.log("\nДана матриця:\n");
    this.matrix.printField();

    const [x, y] = await this.getUserCoordinates();

    if (!this.algorithm.isValidCoordinate(x, y)) {
      console.error(
        "Невірні координати. Будь ласка, введіть дійсні числа в межах поля."
      );
      return;
    }

    console.log(`\nВи вибрали цей символ ${this.algorithm.matrix[x][y]}\n`);

    this.algorithm.areaToDelete(x, y);
    console.log("\nОновлене поле:\n");
    this.matrix.printField();
  }

  async getUserCoordinates() {
    console.log("\nВведіть координати елементу (x y):");

    const xInput = await this.question("x: ");
    const yInput = await this.question("y: ");

    this.inputOutputInterface.close();

    const x = parseInt(xInput.trim(), 10) - 1;
    const y = parseInt(yInput.trim(), 10) - 1;

    return [x, y];
  }
}

const field = [
  ["♠", "♠", "♣", "♢", "♣", "♣"],
  ["♠", "♠", "♣", "♢", "♢", "♢"],
  ["♠", "♣", "♣", "♢", "♢", "♢"],
  ["♠", "♣", "♣", "♣", "♣", "♢"],
  ["♡", "♣", "♣", "♣", "♡", "♡"],
  ["♡", "♡", "♣", "♣", "♢", "♣"],
  ["♡", "♡", "♡", "♠", "♠", "♣"],
];

const userInteraction = new UserInteraction(field);
userInteraction.execute();
