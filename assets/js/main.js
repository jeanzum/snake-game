class SnakeGame {
    constructor(canvasId, scoreBoardId){
        this.canvas = document.getElementById(canvasId);
        this.ctx = this.canvas.getContext('2d');
        this.scoreBoard = document.getElementById(scoreBoardId);
        console.log(this.scoreBoard)
        this.gridSize = 20;
        this.gridCount = this.canvas.width / this.gridSize;
        this.levelThrestholds = [5, 15, 30, 50, 75];
        this.snakeColors = ['#4caf50', '#2196f3', '#ffc107', '#9c27b0', '#ff5722']
        this.foodColor = "#ff5722";
        this.foodPulse = 0;
        this.resetGame();
        window.addEventListener('keydown', this.changeDirection.bind(this));
        this.lastRenderTime = 0;
        this.requestAnimation();
    }

    requestAnimation(){
        window.requestAnimationFrame(this.animate.bind(this));
    };


    animate(currentTime){
        const timeSinceLastRender = currentTime - this.lastRenderTime;

        if(timeSinceLastRender > this.gameSpeed){
            this.update();
            this.lastRenderTime = currentTime;
        }

        this.render();
        this.requestAnimation();
    };

    resetGame(){
        this.snake = [{x: 10, y: 10}];
        this.direction = {x: 0, y:0};
        this.food = this.getRandomFoodPosition();
        this.score = 0;
        this.level = 1;
        this.gameSpeed = 200;
        this.updateScoreBoard();
    }

    update(){
        if(this.isGameOver()){
            alert(`Juego Terminado mi papa: ${this.score}`);
            this.resetGame();
            return;
        }

        this.moveSnake();

        if(this.didEatFoot()){
            this.growSnake();
            this.score++;
            this.food = this.getRandomFoodPosition();
            this.checkLeveUp();
        }
    }

    checkLeveUp(){
        if(this.level < 5 && this.score >= this.levelThrestholds[this.level - 1]) {
            this.level++;
            this.gameSpeed = Math.max(50, this.gameSpeed - 25);
            this.updateScoreBoard();
        }
    }

    updateScoreBoard(){
        this.scoreBoard.textContent = `Score: ${this.score} | Level: ${this.level}`; 
    }

    moveSnake(){
        const head = {x: this.snake[0].x + this.direction.x, y: this.snake[0].y + this.direction.y};
        this.snake.unshift(head);
        this.snake.pop();
    }

    didEatFoot(){
        return this.snake[0].x === this.food.x && this.snake[0].y === this.food.y;
    }

    growSnake(){
        const tail = this.snake[this.snake.lenth -1];
        this.snake.push({...tail});

        this.flashEffect();
    }

    isGameOver(){
        const head = this.snake[0];
        const hitWall = head.x < 0 || head.x >= this.gridCount || head.y < 0 || head.y >= this.gridCount;
        const hitSelf = this.snake.slice(1).some(segment => segment.x === head.x && segment.y === head.y);
        return hitWall || hitSelf;
    }

    getRandomFoodPosition(){
        return {
            x: Math.floor(Math.random() * this.gridCount),
            y: Math.floor(Math.random() * this.gridCount)
        };
    }

    changeDirection(event){
        switch(event.key){
            case 'ArrowUp':
                if(this.direction.y === 0) this.direction = {x: 0, y: -1};
                break;
            case 'ArrowDown': 
                if(this.direction.y === 0) this.direction = {x:0, y: 1};
            break;
            case 'ArrowLeft':
                if(this.direction.x === 0) this.direction = {x:-1, y: 0};
            break;
            case 'ArrowRight':
                if(this.direction.x === 0) this.direction = {x: 1, y: 0};
                break;
        }
    }

    flashEffect(){
        const originalBackgroundColor = this.canvas.style.backgroundColor;
        this.canvas.backgroundColor = '#ffffff';
        setTimeout(() => { 
            this.canvas.backgroundColor = originalBackgroundColor
        }, 100)
    }

    render(){ 
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        this.snake.forEach((segment, index) => {
            this.ctx.shadowColor = 'rgba(0,0,0,0.5)';
            this.ctx.shadowBlur = 10;
            this.ctx.fillStyle = this.level == 0 ? 1 : this.snakeColors[this.level -1];
            this.ctx.fillRect(segment.x * this.gridSize, segment.y * this.gridSize, this.gridSize, this.gridSize);

            this.ctx.strokeStyle = '#ffffff';
            this.ctx.strokeRect(segment.x * this.gridSize, segment.y * this.gridSize, this.gridSize, this.gridSize);
        });

        this.foodPulse += 0.05;
        const foodSize =  this.gridSize + Math.sin(this.foodPulse) * 2;
        const offset = (this.gridSize - foodSize) / 2;

        this.ctx.shadowColor = 'rgba(255,87,34, 0.7)';
        this.ctx.shadowBlur = 15;
        this.ctx.fillStyle = this.foodColor;
        this.ctx.fillRect(
            this.food.x * this.gridSize + offset,
            this.food.y * this.gridSize + offset,
            foodSize,
            foodSize
        )
    }
}

const game = new SnakeGame('gameCanvas', 'scoreBoard');