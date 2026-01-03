const AudioContext = window.AudioContext || window.webkitAudioContext;
const audioCtx = new AudioContext();

function playBeep(freq, duration) {
  const oscillator = audioCtx.createOscillator();
  const gainNode = audioCtx.createGain();

  oscillator.type = "square"; // Nokia-style
  oscillator.frequency.value = freq;
  gainNode.gain.value = 0.1;

  oscillator.connect(gainNode);
  gainNode.connect(audioCtx.destination);

  oscillator.start();
  oscillator.stop(audioCtx.currentTime + duration);
}

function moveBeep() {
  playBeep(600, 0.03);
}

function eatBeep() {
  playBeep(900, 0.08);
}

function gameOverBeep() {
  playBeep(200, 0.5);
}

// 🔓 Unlock audio (browser requirement)
function unlockAudio() {
  if (audioCtx.state === "suspended") {
    audioCtx.resume();
  }
}

window.onload = () => {
  setTimeout(() => {
    document.getElementById("loading-screen").style.display = "none";
    document.querySelector(".game-container").classList.remove("hidden");
  }, 3000);
};

const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

const box = 15;
let snake = [{ x: 150, y: 150 }];
let food = randomFood();
let direction = "RIGHT";
let score = 0;

document.addEventListener("keydown", keyControl);

function keyControl(e) {
  unlockAudio();

  if (e.key === "ArrowUp" && direction !== "DOWN") direction = "UP";
  if (e.key === "ArrowDown" && direction !== "UP") direction = "DOWN";
  if (e.key === "ArrowLeft" && direction !== "RIGHT") direction = "LEFT";
  if (e.key === "ArrowRight" && direction !== "LEFT") direction = "RIGHT";

  moveBeep();
}

function changeDir(dir) {
  unlockAudio();

  if (dir === "UP" && direction !== "DOWN") direction = "UP";
  if (dir === "DOWN" && direction !== "UP") direction = "DOWN";
  if (dir === "LEFT" && direction !== "RIGHT") direction = "LEFT";
  if (dir === "RIGHT" && direction !== "LEFT") direction = "RIGHT";

  moveBeep();
}

function randomFood() {
  return {
    x: Math.floor(Math.random() * 20) * box,
    y: Math.floor(Math.random() * 20) * box
  };
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Draw snake
  snake.forEach((s, i) => {
    ctx.fillStyle = i === 0 ? "#0f380f" : "#306230";
    ctx.fillRect(s.x, s.y, box, box);
  });

  // Draw food
  ctx.fillStyle = "#0f380f";
  ctx.fillRect(food.x, food.y, box, box);

  let head = { ...snake[0] };

  if (direction === "UP") head.y -= box;
  if (direction === "DOWN") head.y += box;
  if (direction === "LEFT") head.x -= box;
  if (direction === "RIGHT") head.x += box;

  // Game Over
  if (
    head.x < 0 || head.y < 0 ||
    head.x >= canvas.width || head.y >= canvas.height ||
    snake.some((s, i) => i !== 0 && s.x === head.x && s.y === head.y)
  ) {
    gameOverBeep();
    setTimeout(() => {
      alert("Game Over! Score: " + score);
      location.reload();
    }, 500);
    return;
  }

  snake.unshift(head);

  // 🍎 Food eaten
  if (head.x === food.x && head.y === food.y) {
    score++;
    eatBeep();
    document.getElementById("score").innerText = score;
    food = randomFood();
  } else {
    snake.pop();
  }
}

setInterval(draw, 120);
