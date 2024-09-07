console.log(gsap);

const canvas = document.querySelector("#canvas");
// console.log(canvas);
canvas.width = innerWidth;
canvas.height = innerHeight;
const context = canvas.getContext("2d");
// step1:create classes
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
    this.x += this.velocity.x;
    this.y += this.velocity.y;

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
class Particle {
  constructor(x, y, radius, color, velocity) {
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.velocity = velocity;
    this.alpha = 1;

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
const player = new Player(canvas.width / 2, canvas.height / 2, 30, "blue");
const projectiles = [];
const enemies = [];
addEventListener("click", (event) => {
  const angle = Math.atan2(event.clientY - canvas.height / 2, event.clientX - canvas.width / 2)
  const velocity = { x: Math.cos(angle) * 5, y: Math.sin(angle) * 5 };
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


    enemies.push(new Enemy(x, y, radius, color, velocity));
  }, 2000);

}
let animateId;
function animate () {
  animateId = requestAnimationFrame(animate);
  context.fillStyle = "rgba(0,0,0,0.1)";
  context.clearRect(0, 0, canvas.width, canvas.height);
  player.draw();
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
    }
    projectiles.forEach((projectile, projectileIndex) => {
      const dist = Math.hypot(projectile.x - enemy.x, projectile.y - enemy.y);
      //generate particles
      // for (let i = 0; i < enemy.radius; i++) {

      // }
      //happy scenario
      if (dist - enemy.radius - projectile.radius < 1) {
        if (enemy.radius - 10 > 5) {
          enemy.radius -= 10;
          setTimeout(() => {
            projectiles.splice(projectileIndex, 1);
          }
            , 0)
        }
        else {
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
animate();
enemiesGenerator();

