class Maze {
    constructor(width, height) {
        this.width = width * 2 + 1;
        this.height = height * 2 + 1;
        this.maze = Array(this.height).fill().map(() => Array(this.width).fill(1));
    }

    generate() {
        const carvePassages = (x, y) => {
            this.maze[y][x] = 0;
            const directions = [[0, 1], [1, 0], [0, -1], [-1, 0]];
            directions.sort(() => Math.random() - 0.5);
            for (let [dx, dy] of directions) {
                const nx = x + dx * 2;
                const ny = y + dy * 2;
                if (nx >= 0 && nx < this.width && ny >= 0 && ny < this.height && this.maze[ny][nx] === 1) {
                    this.maze[y + dy][x + dx] = 0;
                    carvePassages(nx, ny);
                }
            }
        };

        carvePassages(1, 1);
        this.maze[1][1] = 2; // Start
        this.maze[this.height - 2][this.width - 2] = 3; // End
    }

    solve() {
        const start = [1, 1];
        const end = [this.width - 2, this.height - 2];
        const queue = [[start, [start]]];
        const visited = new Set([start.toString()]);

        while (queue.length > 0) {
            const [[x, y], path] = queue.shift();
            if (x === end[0] && y === end[1]) {
                return path;
            }

            for (let [dx, dy] of [[0, 1], [1, 0], [0, -1], [-1, 0]]) {
                const nx = x + dx;
                const ny = y + dy;
                if (nx >= 0 && nx < this.width && ny >= 0 && ny < this.height && this.maze[ny][nx] !== 1) {
                    const newPos = [nx, ny];
                    if (!visited.has(newPos.toString())) {
                        queue.push([newPos, [...path, newPos]]);
                        visited.add(newPos.toString());
                    }
                }
            }
        }

        return null;
    }
}

class MazeGUI {
    constructor() {
        this.maze = null;
        this.cellSize = 10;
        this.canvas = document.getElementById('mazeCanvas');
        this.ctx = this.canvas.getContext('2d');

        document.getElementById('generateMaze').addEventListener('click', () => this.createMaze());
        document.getElementById('solveMaze').addEventListener('click', () => this.solveMaze());
    }

    createMaze() {
        const width = parseInt(document.getElementById('width').value);
        const height = parseInt(document.getElementById('height').value);

        if (isNaN(width) || isNaN(height) || width < 5 || height < 5) {
            alert('Lütfen geçerli bir genişlik ve yükseklik girin (minimum 5).');
            return;
        }

        this.maze = new Maze(width, height);
        this.maze.generate();
        this.cellSize = Math.min(800 / this.maze.width, 600 / this.maze.height);
        this.canvas.width = this.maze.width * this.cellSize;
        this.canvas.height = this.maze.height * this.cellSize;
        this.drawMaze();
    }

    drawMaze() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        for (let y = 0; y < this.maze.height; y++) {
            for (let x = 0; x < this.maze.width; x++) {
                const cell = this.maze.maze[y][x];
                this.ctx.fillStyle = cell === 1 ? 'black' : cell === 2 ? 'green' : cell === 3 ? 'red' : 'white';
                this.ctx.fillRect(x * this.cellSize, y * this.cellSize, this.cellSize, this.cellSize);
            }
        }
    }

    solveMaze() {
        if (!this.maze) {
            alert('Önce bir labirent oluşturun.');
            return;
        }

        const solution = this.maze.solve();
        if (solution) {
            this.animateSolution(solution);
        } else {
            alert('Çözüm bulunamadı.');
        }
    }

    animateSolution(solution) {
        let i = 0;
        const drawStep = () => {
            if (i < solution.length) {
                const [x, y] = solution[i];
                this.ctx.fillStyle = 'blue';
                this.ctx.fillRect(x * this.cellSize, y * this.cellSize, this.cellSize, this.cellSize);
                i++;
                setTimeout(drawStep, 50);
            }
        };
        drawStep();
    }
}

new MazeGUI();
