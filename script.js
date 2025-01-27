
const roadArea = document.querySelector('.road');
let player = { step: 5, health: 3, score: 0, timer: 60, start: false };
let keys = { ArrowUp: false, ArrowDown: false, ArrowRight: false, ArrowLeft: false };
const startBtn = document.querySelector(".btn");
const healthBar = document.createElement('div');
const timerDisplay = document.createElement('div');
healthBar.className = "health-bar";
timerDisplay.className = "timer-display";
roadArea.appendChild(healthBar);
roadArea.appendChild(timerDisplay);
let gameInterval;

document.addEventListener('keydown', keyDown);
document.addEventListener('keyup', keyUp);

function keyDown(event) {
    keys[event.key] = true;
}

function keyUp(event) {
    keys[event.key] = false;
}

function updateTimer() {
    if (!player.start) return;
    player.timer--;
    timerDisplay.innerHTML = `Time: ${player.timer}s`;
    if (player.timer <= 0) {
        displayGameOverMessage("Time's up! 🕒 Final Score: " + player.score + " 🚗 Play again to improve your skills!");
    }
}

function updateHealth() {
    healthBar.innerHTML = `Health: ${player.health}`;
    if (player.health <= 0) {
        displayGameOverMessage("Oh no! You ran out of health! 💔 Final Score: " + player.score + " 🚗 Better luck next time!");
    }
}

function displayGameOverMessage(message) {
    alert(message);
    clearInterval(gameInterval);
    player.start = false;
    location.reload();
}

function moveLines() {
    document.querySelectorAll('.lines').forEach(line => {
        line.y += player.step;
        if (line.y >= 700) line.y -= 750;
        line.style.top = line.y + 'px';
    });
}

function moveObstacles(playerCar) {
    document.querySelectorAll('.obstacles').forEach(obstacle => {
        obstacle.y += player.step;
        if (obstacle.y >= 700) obstacle.y = -200;
        obstacle.style.top = obstacle.y + 'px';
        let obstacleRect = obstacle.getBoundingClientRect();
        let playerRect = playerCar.getBoundingClientRect();
        if (collisionDetected(playerRect, obstacleRect)) {
            player.health--;
            updateHealth();
        }
    });
}

function moveEnemies(playerCar) {
    document.querySelectorAll('.enemies').forEach(enemy => {
        enemy.y += player.step;
        if (enemy.y >= 700) enemy.y = -200;
        enemy.style.top = enemy.y + 'px';
        let enemyRect = enemy.getBoundingClientRect();
        let playerRect = playerCar.getBoundingClientRect();
        if (collisionDetected(playerRect, enemyRect)) {
            player.health--;
            updateHealth();
        }
    });
}

function movePowerUps(playerCar) {
    document.querySelectorAll('.power-up').forEach(powerUp => {
        powerUp.y += player.step;
        if (powerUp.y >= 700) powerUp.y = -200;
        powerUp.style.top = powerUp.y + 'px';
        let powerUpRect = powerUp.getBoundingClientRect();
        let playerRect = playerCar.getBoundingClientRect();
        if (collisionDetected(playerRect, powerUpRect)) {
            player.score += 5;
            startBtn.innerHTML = "Score: " + player.score;
            powerUp.remove();
        }
    });
}

function playArea() {
    if (player.start) {
        let playerCar = document.querySelector('.car');
        let road = roadArea.getBoundingClientRect();
        moveLines();
        moveEnemies(playerCar);
        moveObstacles(playerCar);
        movePowerUps(playerCar);
        if (keys.ArrowUp && player.y > road.top + 80) player.y -= player.step;
        if (keys.ArrowDown && player.y < road.bottom - 150) player.y += player.step;
        if (keys.ArrowLeft && player.x > 0) player.x -= player.step;
        if (keys.ArrowRight && player.x < road.width - 50) player.x += player.step;
        playerCar.style.top = player.y + 'px';
        playerCar.style.left = player.x + 'px';
        window.requestAnimationFrame(playArea);
    }
}

function init() {
    roadArea.innerHTML = ""; // Clear previous elements
    player.start = true;
    player.health = 3;
    player.score = 0;
    player.timer = 60;
    gameInterval = setInterval(updateTimer, 1000);
    updateHealth();

    for (let i = 0; i < 5; i++) {
        let line = document.createElement('div');
        line.setAttribute('class', 'lines');
        line.y = i * 150;
        line.style.top = line.y + 'px';
        roadArea.appendChild(line);
    }

    let playerCar = document.createElement('div');
    playerCar.setAttribute('class', 'car');
    roadArea.appendChild(playerCar);
    playerCar.style.left = "175px"; // Ensure player car is positioned correctly
    playerCar.style.top = "500px"; // Ensure player car is visible
    player.x = 175;
    player.y = 500;

    for (let i = 0; i < 3; i++) {
        let enemy = document.createElement('div');
        enemy.setAttribute('class', 'enemies');
        enemy.y = i * -300;
        enemy.style.top = enemy.y + 'px';
        enemy.style.left = Math.random() * 350 + 'px'; // Randomize enemy position
        roadArea.appendChild(enemy);
    }

    for (let i = 0; i < 2; i++) {
        let obstacle = document.createElement('div');
        obstacle.setAttribute('class', 'obstacles');
        obstacle.y = i * -350;
        obstacle.style.top = obstacle.y + 'px';
        obstacle.style.left = Math.random() * 350 + 'px'; // Randomize obstacle position
        roadArea.appendChild(obstacle);
    }

    for (let i = 0; i < 2; i++) {
        let powerUp = document.createElement('div');
        powerUp.setAttribute('class', 'power-up');
        powerUp.y = i * -400;
        powerUp.style.top = powerUp.y + 'px';
        powerUp.style.left = Math.random() * 350 + 'px'; // Randomize power-up position
        roadArea.appendChild(powerUp);
    }

    window.requestAnimationFrame(playArea);
}

function startgame() {
    if (!player.start) {
        init();
        startBtn.innerHTML = "Game Started!";
    }
}

function collisionDetected(rect1, rect2) {
    return !(rect1.bottom < rect2.top || rect1.top > rect2.bottom || rect1.left > rect2.right || rect1.right < rect2.left);
}
