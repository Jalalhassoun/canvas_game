const canvas = document.querySelector("#canvas");
console.log(canvas);
canvas.width = innerWidth;
canvas.height = innerHeight;
const context = canvas.getContext("2d");
console.log(context);
// step1:create classes
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
}
const player = new Player(canvas.width / 2, canvas.height / 2, 30, "blue");
player.draw();
addEventListener("mousemove", (event) => {
  const projectile = new Projectile(event.clientX, event.clientY, 10, "green", 0);
  projectile.draw();

})