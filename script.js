const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

canvas.width = 400;
canvas.height = 600;

// Load hình ảnh
const playerImg = new Image();
playerImg.src = "images/player.png";

const obstacleImg = new Image();
obstacleImg.src = "images/obstacle.png";

// Người chơi
let player = {
  x: 180,
  y: 500,
  width: 40,
  height: 40,
  speed: 5
};

// Chướng ngại vật
let obstacles = [];
let frame = 0;
let score = 0;
let speed = 3; // tốc độ ban đầu

// Xử lý phím bấm
let keys = {};
document.addEventListener("keydown", (e) => keys[e.key] = true);
document.addEventListener("keyup", (e) => keys[e.key] = false);

// Vẽ nhân vật
function drawPlayer() {
  ctx.drawImage(playerImg, player.x, player.y, player.width, player.height);
}

// Vẽ chướng ngại vật
function drawObstacles() {
  obstacles.forEach(obs => {
    ctx.drawImage(obstacleImg, obs.x, obs.y, obs.width, obs.height);
  });
}

// Cập nhật vị trí
function update() {
  if (keys["ArrowLeft"] && player.x > 0) player.x -= player.speed;
  if (keys["ArrowRight"] && player.x < canvas.width - player.width) player.x += player.speed;
  if (keys["ArrowUp"] && player.y > 0) player.y -= player.speed;
  if (keys["ArrowDown"] && player.y < canvas.height - player.height) player.y += player.speed;

  // Thêm chướng ngại vật mới
  frame++;
  if (frame % 60 === 0) {
    let obsX = Math.random() * (canvas.width - 40);
    obstacles.push({ x: obsX, y: -40, width: 40, height: 40 });
  }

  // Cập nhật vị trí chướng ngại vật
  obstacles.forEach(obs => {
    obs.y += speed;
  });

  // Xoá chướng ngại vật ngoài màn
  obstacles = obstacles.filter(obs => obs.y < canvas.height);

  // Kiểm tra va chạm
  obstacles.forEach(obs => {
    if (player.x < obs.x + obs.width &&
        player.x + player.width > obs.x &&
        player.y < obs.y + obs.height &&
        player.y + player.height > obs.y) {
      alert("💥 Game Over! Điểm của bạn: " + score);
      document.location.reload();
    }
  });

  // Tăng điểm & tốc độ dần
  if (frame % 30 === 0) {
    score++;
    if (score % 10 === 0) speed += 0.5; // mỗi 10 điểm tăng tốc
  }
}

// Vẽ điểm
function drawScore() {
  ctx.fillStyle = "white";
  ctx.font = "20px Arial";
  ctx.fillText("Điểm: " + score, 10, 30);
}

// Game loop
function gameLoop() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawPlayer();
  drawObstacles();
  drawScore();
  update();
  requestAnimationFrame(gameLoop);
}

// Bắt đầu game khi ảnh đã load
playerImg.onload = () => {
  gameLoop();
};
