const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let game = {
    mc: 500, hp: 100, wave: 1, multiplier: 1, killsSinceDeath: 0,
    player: { x: canvas.width/2, y: canvas.height/2, ammo: 30 },
    zombies: [], bullets: [], squad: [], airstrikes: []
};

class Soldier {
    constructor(type, offset) {
        this.type = type;
        this.offset = offset;
        this.x = game.player.x; this.y = game.player.y;
        this.cd = 0;
    }
    update(dt) {
        // Follow Player
        let tx = game.player.x + this.offset.x;
        let ty = game.player.y + this.offset.y;
        this.x += (tx - this.x) * 0.05;
        this.y += (ty - this.y) * 0.05;

        // Auto-Targeting
        let target = game.zombies[0];
        if (target && System.dist(this.x, this.y, target.x, target.y) < 400) {
            if (this.cd <= 0) {
                this.shoot(target);
                this.cd = this.type === 'HEAVY' ? 5 : 20;
            }
        }
        this.cd--;
    }
    shoot(t) {
        game.bullets.push({x: this.x, y: this.y, angle: Math.atan2(t.y - this.y, t.x - this.x), speed: 15, dmg: 10});
    }
}

function spawnZombie() {
    let isBoss = game.wave % 5 === 0 && game.zombies.length === 0;
    game.zombies.push({
        x: Math.random() * canvas.width, y: -50,
        hp: isBoss ? 2000 : 20 * game.wave,
        maxHp: isBoss ? 2000 : 20 * game.wave,
        isBoss: isBoss,
        speed: isBoss ? 0.5 : 1 + Math.random()
    });
}

function loop(time) {
    const dt = System.update(time);
    ctx.fillStyle = '#050505';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Render Squad
    game.squad.forEach(s => {
        s.update(dt);
        ctx.fillStyle = s.type === 'HEAVY' ? '#f1c40f' : '#3498db';
        ctx.fillRect(s.x-15, s.y-15, 30, 30);
    });

    // Update Zombies
    for (let i = game.zombies.length - 1; i >= 0; i--) {
        let z = game.zombies[i];
        let angle = Math.atan2(game.player.y - z.y, game.player.x - z.x);
        z.x += Math.cos(angle) * z.speed;
        z.y += Math.sin(angle) * z.speed;

        // Draw Zombie
        ctx.fillStyle = z.isBoss ? '#e74c3c' : '#2ecc71';
        ctx.fillRect(z.x-10, z.y-10, z.isBoss ? 50 : 20, z.isBoss ? 50 : 20);

        // Damage Player
        if (System.dist(z.x, z.y, game.player.x, game.player.y) < 30) {
            game.hp -= 0.1;
            game.multiplier = 1; // Reset multiplier on hit
        }
    }

    // Draw Particles
    System.particles.forEach(p => {
        ctx.globalAlpha = p.life;
        ctx.fillStyle = p.color;
        ctx.fillRect(p.x, p.y, p.size || 2, p.size || 2);
    });
    ctx.globalAlpha = 1;

    UI.render(game);
    requestAnimationFrame(loop);
}

// Controls & Purchases
window.buySquad = (type) => {
    let prices = {RIFLE: 1000, HEAVY: 2000, MEDIC: 1500};
    if (game.mc >= prices[type] && game.squad.length < 3) {
        game.mc -= prices[type];
        let offset = {x: (game.squad.length + 1) * -40, y: 40};
        game.squad.push(new Soldier(type, offset));
    }
};

System.init();
setInterval(spawnZombie, 2000);
requestAnimationFrame(loop);
