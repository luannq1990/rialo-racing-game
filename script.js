const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

canvas.width = 800;
canvas.height = 400;

// Load images
const playerImg = new Image();
playerImg.src = "assets/player.png";

const obstacleImg = new Image();
obstacleImg.src = "assets/obstacle.png";

const bgImg = new Image();
bgImg.src = "assets/background.jpg";

// Player
const player = {
  x: 100,
  y: canvas.height - 120,
  width: 60,
  height: 60,
  dy: 0,
  gravity: 0.6,
  jumpPower: -12,
  grounded: false
};

// Movement
document.addEventListener("keydown", (e) => {
  if (e.key === " " || e.key === "ArrowUp") {
    if (player.grounded) {
      player.dy = player.jumpPower;
      player.grounded = false;
    }
  }
});

// Obstacles
let obstacles = [];
let gameSpeed = 4;
let score = 0;

// Background scroll
let bgX = 0;

// Spawn obstacle
function spawnObstacle() {
  obstacles.push({
    x: canvas.width,
    y: canvas.height - 80,
    width: 50,
    height: 50
  });
}

// Collision
function isColliding(a, b) {
  return (
    a.x < b.x + b.width &&
    a.x + a.width > b.x &&
    a.y < b.y + b.height &&
    a.y + a.height > b.y
  );
}

let frame = 0;
function update() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Background scroll
  bgX -= gameSpeed / 2;
  if (bgX <= -canvas.width) bgX = 0;
  ctx.drawImage(bgImg, bgX, 0, canvas.width, canvas.height);
  ctx.drawImage(bgImg, bgX + canvas.width, 0, canvas.width, canvas.height);

  // Player physics
  player.y += player.dy;
  player.dy += player.gravity;

  if (player.y + player.height >= canvas.height - 20) {
    player.y = canvas.height - player.height - 20;
    player.dy = 0;
    player.grounded = true;
  }

  ctx.drawImage(playerImg, player.x, player.y, player.width, player.height);

  // Obstacles
  for (let i = 0; i < obstacles.length; i++) {
    let obs = obstacles[i];
    obs.x -= gameSpeed;
    ctx.drawImage(obstacleImg, obs.x, obs.y, obs.width, obs.height);

    if (isColliding(player, obs)) {
      alert("Game Over! Score: " + score);
      document.location.reload();
    }
  }

  // Remove passed obstacles
  obstacles = obstacles.filter(obs => obs.x + obs.width > 0);

  // Spawn new obstacles
  if (frame % 120 === 0) {
    spawnObstacle();
    score++;
    gameSpeed += 0.2; // tốc độ tăng dần
  }

  // Score
  ctx.fillStyle = "white";
  ctx.font = "20px Arial";
  ctx.fillText("Score: " + score, 10, 30);

  frame++;
  requestAnimationFrame(update);
}

update();
