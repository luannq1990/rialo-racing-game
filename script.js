const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

canvas.width = 800;
canvas.height = 400;

// Load images
const playerImg = new Image();
playerImg.src = "assets/player.png";

const obstacleImg = new Image();
obstacleImg.src = "assets/obstacle.png";

// Player
const player = {
  x: 50,
  y: canvas.height - 100,
  width: 60,
  height: 60,
  speed: 5
};

// Movement
let keys = {};
document.addEventListener("keydown", (e) => keys[e.key] = true);
document.addEventListener("keyup", (e) => keys[e.key] = false);

// Obstacle list
let obstacles = [];
let gameSpeed = 3;
let score = 0;

// Spawn obstacle
function spawnObstacle() {
  obstacles.push({
    x: canvas.width,
    y: canvas.height - 80,
    width: 50,
    height: 50
  });
}

// Collision check
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

  // Draw player
  if (keys["ArrowUp"] && player.y > 0) player.y -= player.speed;
  if (keys["ArrowDown"] && player.y < canvas.height - player.height) player.y += player.speed;
  if (keys["ArrowLeft"] && player.x > 0) player.x -= player.speed;
  if (keys["ArrowRight"] && player.x < canvas.width - player.width) player.x += player.speed;
  ctx.drawImage(playerImg, player.x, player.y, player.width, player.height);

  // Handle obstacles
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
    gameSpeed += 0.2; // tăng tốc độ dần
  }

  // Score
  ctx.fillStyle = "white";
  ctx.font = "20px Arial";
  ctx.fillText("Score: " + score, 10, 30);

  frame++;
  requestAnimationFrame(update);
}

update();
