import {
  GAME_SIZE,
  CELL_STATES,
  DEFAULT_ALIVE_PAIRS,
  RENDER_INTERVAL
} from "./constants";

export class Model {
  constructor(callback) {
    this.callback = callback;
    this.width = GAME_SIZE;
    this.height = GAME_SIZE;
    this.raf = null;
  }

  init() {
    this.state = Array.from(new Array(this.height), () =>
      Array.from(new Array(this.width), () => CELL_STATES.NONE)
    );
    DEFAULT_ALIVE_PAIRS.forEach(([x, y]) => {
      this.state[y][x] = CELL_STATES.ALIVE;
    });
    this.updated();
  }

  run(date = new Date().getTime()) {
    this.raf = requestAnimationFrame(() => {
      const currentTime = new Date().getTime();
      if (currentTime - date > RENDER_INTERVAL) {
        let nextStep = Array.from(new Array(this.height), () =>
          Array.from(new Array(this.width), () => CELL_STATES.NONE)
        );

        for (let i = 0; i < this.width; i++) {
          for (let j = 0; j < this.width; j++) {
            const nbAlive = this.aliveNeighbours(i, j);
            // Implement Game of life logic

            // si la cellule est vivante...
            if (this.isCellAlive(i, j)) {
              // et qu'elle possède 2 ou 3 voisins vivants...
              if (nbAlive === 3 || nbAlive === 2) {
                // alors elle reste en vie
                nextStep[i][j] = CELL_STATES.ALIVE;
              }
              // sinon...
              else {
                // la cellule meurt
                nextStep[i][j] = CELL_STATES.DEAD;
              }
            }
            // si la cellule est morte..
            else {
              // et qu'elle possède 3 voisins vivants...
              if (nbAlive === 3) {
                // alors elle naît
                nextStep[i][j] = CELL_STATES.ALIVE;
              }
            }
          }
        }

        // on met à jour l'état de la cellule
        this.state = nextStep;

        this.updated();
        this.run(currentTime);
      } else {
        this.run(date);
      }
    });
  }

  stop() {
    cancelAnimationFrame(this.raf);
    this.raf = null;
  }

  reset() {
    this.stop();
    this.init();
    this.updated();
  }

  isCellAlive(x, y) {
    return x >= 0 &&
      y >= 0 &&
      y < this.height &&
      x < this.height &&
      this.state[y][x] === CELL_STATES.ALIVE
      ? 1
      : 0;
  }
  aliveNeighbours(x, y) {
    let number = 0;

    // Si la cellule en bas à gauche de la cellule courante est vivante...
    if (this.isCellAlive(x - 1, y - 1)) {
      // on incrémente le compteur de voisins vivants
      number++;
    }
    // Si la cellule à gauche de la cellule courante est vivante...
    if (this.isCellAlive(x - 1, y)) {
      // on incrémente le compteur de voisins vivants
      number++;
    }
    // Si la cellule en haut à gauche de la cellule courante est vivante...
    if (this.isCellAlive(x - 1, y + 1)) {
      // on incrémente le compteur de voisins vivants
      number++;
    }
    // Si la cellule en dessous de la cellule courante est vivante...
    if (this.isCellAlive(x, y - 1)) {
      // on incrémente le compteur de voisins vivants
      number++;
    }
    // Si la cellule en haut de la cellule courante est vivante...
    if (this.isCellAlive(x, y + 1)) {
      // on incrémente le compteur de voisins vivants
      number++;
    }
    // Si la cellule en bas à droite de la cellule courante est vivante...
    if (this.isCellAlive(x + 1, y - 1)) {
      // on incrémente le compteur de voisins vivants
      number++;
    }
    // Si la cellule à gauche de la cellule courante est vivante...
    if (this.isCellAlive(x + 1, y)) {
      // on incrémente le compteur de voisins vivants
      number++;
    }
    // Si la cellule en haut à droite de la cellule courante est vivante...
    if (this.isCellAlive(x + 1, y + 1)) {
      // on incrémente le compteur de voisins vivants
      number++;
    }

    // on retourne le nombre de voisins vivants de la cellule courante
    return number;
  }

  updated() {
    // TODO update the view
    this.callback(this);
  }
}
