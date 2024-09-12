
const canvas = document.querySelector("#canvas");
const scoreElement = document.querySelector(".scoreElement");
const modalElement = document.querySelector("#modalElement");
const bigScore = document.querySelector('#bigScore');
const btnStart = document.querySelector('.btn-start');
// modalElement.style.display = "none";
canvas.width = innerWidth;
canvas.height = innerHeight;
const context = canvas.getContext("2d");
// step1:create classes
let speed = 0.5;
class Enemy {
  constructor(x, y, radius, color, velocity) {
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.color = color;
    this.velocity = velocity;
  }
  draw () {
    context.beginPath();
    context.arc(this.x, this.y, this.radius, Math.PI * 2, false);
    //context.fill style picks the color
    context.fillStyle = this.color;
    //fill is a function to fill the chosen color
    context.fill();
  }
  update () {
    this.draw();
    this.x += this.velocity.x * speed;
    this.y += this.velocity.y * speed;

  }

}

class Player {
  constructor(x, y, radius, color) {
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.color = color;
  }
  draw () {
    context.beginPath();
    context.arc(this.x, this.y, this.radius, Math.PI * 2, false);
    context.fillStyle = this.color;
    context.fill();
  }
}

class Projectile {
  constructor(x, y, radius, color, velocity) {
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.color = color;
    this.velocity = velocity;
  }
  draw () {
    context.beginPath();
    context.arc(this.x, this.y, this.radius, Math.PI * 2, false);
    context.fillStyle = this.color;
    context.fill();

  }
  update () {
    this.draw();
    this.x += this.velocity.x;
    this.y += this.velocity.y;
  }

}
const friction = 0.99;
class Particle {
  constructor(x, y, radius, color, velocity) {
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.color = color;
    this.velocity = velocity;
    this.alpha = 1;

  }
  draw () {
    context.save();
    context.globalAlpha = this.alpha;
    context.beginPath();
    context.arc(this.x, this.y, this.radius, Math.PI * 2, false);
    context.fillStyle = this.color;
    context.fill();
    context.restore();

  }
  update () {
    this.draw();
    this.velocity.x *= friction;
    this.velocity.y *= friction;
    this.x += this.velocity.x;
    this.y += this.velocity.y;
    this.alpha -= 0.01;
  }

}
let player = new Player(canvas.width / 2, canvas.height / 2, 30, "blue");
let projectiles = [];
let enemies = [];
let particles = [];
let score = 0;
addEventListener("click", (event) => {
  const angle = Math.atan2(event.clientY - canvas.height / 2, event.clientX - canvas.width / 2)
  const velocity = { x: Math.cos(angle) * 4, y: Math.sin(angle) * 4 };
  projectiles.push(new Projectile(canvas.width / 2, canvas.height / 2, 5, "white ", velocity));



})

function enemiesGenerator () {
  setInterval(() => {
    const radius = Math.random() * (30 - 5) + 5;
    let x, y;
    color = `hsl(${Math.random() * 360},50%,50%)`
    if (Math.random() < 0.5) {
      x = Math.random() > 0.5 ? 0 - radius : canvas.width + radius;
      y = canvas.height * Math.random();
    } else {
      x = Math.random() * canvas.width;
      y = Math.random() > 0.5 ? 0 - radius : canvas.height + radius;
    }
    const angle = Math.atan2(canvas.height / 2 - y, canvas.width / 2 - x);
    const velocity = { x: Math.cos(angle), y: Math.sin(angle) };
    if (score > 500) {
      speed += 0.1;
    }

    enemies.push(new Enemy(x, y, radius, color, velocity));
  }, 3000);

}
let animateId;
function animate () {
  animateId = requestAnimationFrame(animate);
  context.fillStyle = "rgba(0,0,0,0.1)";
  context.fillRect(0, 0, canvas.width, canvas.height);
  player.draw();
  particles.forEach((particle, particleIndex) => {
    if (particle.alpha <= 0) {
      particles.splice(particleIndex, 1);
    }
    else {
      particle.update();

    }
  })
  projectiles.forEach((projectile, projectileIndex) => {
    projectile.update();
    if (projectile.x + projectile.radius < 0 || projectile.x - projectile.radius > canvas.width || projectile.y + projectile.radius < 0 || projectile.y - projectile.radius > canvas.height) {
      projectiles.splice(projectileIndex, 1);
    }
  });
  enemies.forEach((enemy, index) => {
    enemy.update();
    //bad scenario
    const distAnimePlayer = Math.hypot(player.x - enemy.x, player.y - enemy.y);
    if (distAnimePlayer - player.radius - enemy.radius < 1) {
      cancelAnimationFrame(animateId);
      bigScore.innerHTML = score;
      modalElement.style.display = "flex";
    }
    projectiles.forEach((projectile, projectileIndex) => {
      const dist = Math.hypot(projectile.x - enemy.x, projectile.y - enemy.y);
      //happy scenario
      if (dist - enemy.radius - projectile.radius < 1) {
        //generate particles
        for (let i = 0; i < enemy.radius; i++) {
          particles.push(new Particle(projectile.x, projectile.y, 3, enemy.color, { x: (Math.random() - 0.5) * Math.random() * 9, y: (Math.random() - 0.5) * Math.random() * 9 }));
        }

        if (enemy.radius - 10 > 5) {
          score += 100;
          scoreElement.innerHTML = score;
          enemy.radius -= 10;
          setTimeout(() => {
            projectiles.splice(projectileIndex, 1);
          }
            , 0)
        }
        else {
          score += 200;
          scoreElement.innerHTML = score;
          setTimeout(() => {
            enemies.splice(index, 1);
            projectiles.splice(projectileIndex, 1);
          }
            , 0)

        }

      }
    })

  })
}
const init = () => {
  enemies = [];
  projectiles = [];
  particles = [];
  speed = 0.5;

}
btnStart.addEventListener("click", () => {
  init();
  animate();
  enemiesGenerator();
  modalElement.style.display = "none";
  score = 0;
  scoreElement.innerHTML = score;
})


