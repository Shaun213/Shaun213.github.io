const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const Game = {
    mc: 1000, streak: 0, fps: 0,
    player: { x: 0, y: 0, hp: 100, weapon: { name: 'Pistol', dmg: 20, rate: 15 } },
    zombies: [], bullets: [], squad: [],
    lastTime: performance.now(),

    init() {
        System.init();
        this.loop();
    },

    buyTeammate(type) {
        if (this.mc >= 1500 && this.squad.length < 3) {
            this.mc -= 1500;
            this.squad.push({ x: this.player.x, y: this.player.y, type: type, cd: 0 });
        }
    },

    loop() {
        const now = performance.now();
        const dt = (now - this.lastTime) / 1000;
        this.fps = 1 / dt;
        this.lastTime = now;

        this.update(dt);
        this.draw();
        requestAnimationFrame(() => this.loop());
    },

    update(dt) {
        // 1. Movement (WASD)
        const speed = 300 * dt;
        if (System.keys['KeyW']) this.player.y -= speed;
        if (System.keys['KeyS']) this.player.y += speed;
        if (System.keys['KeyA']) this.player.x -= speed;
        if (System.keys['KeyD']) this.player.x += speed;

        // 2. Camera Update
        System.update(dt, this.player);

        // 3. AI Teammate Logic
        this.squad.forEach((bot, i) => {
            // Follow player with Roblox "Leash" logic
            let dist = Math.hypot(this.player.x - bot.x, this.player.y - bot.y);
            if (dist > 100) {
                bot.x += (this.player.x - bot.x) * 2 * dt;
                bot.y += (this.player.y - bot.y) * 2 * dt;
            }
            // Auto-Shoot
            bot.cd--;
            if(this.zombies[0] && bot.cd <= 0) {
                this.bullets.push({x: bot.x, y: bot.y, tx: this.zombies[0].x, ty: this.zombies[0].y});
                bot.cd = 30;
            }
        });

        // 4. Zombie Spawning
        if (Math.random() < 0.02) {
            this.zombies.push({
                x: this.player.x + (Math.random() - 0.5) * 1000,
                y: this.player.y + (Math.random() - 0.5) * 1000,
                hp: 50
            });
        }

        UI.update(this);
    },

    draw() {
        ctx.fillStyle = '#1e1e1e'; // Dark background
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        ctx.save();
        // CAMERA CENTER LOGIC
        ctx.translate(canvas.width/2 - System.camera.x, canvas.height/2 - System.camera.y);
        if(System.shake > 0) ctx.translate(Math.random()*5, Math.random()*5);

        // Draw Grid (Roblox floor feel)
        ctx.strokeStyle = '#333';
        for(let i=-2000; i<2000; i+=100) {
            ctx.beginPath(); ctx.moveTo(i, -2000); ctx.lineTo(i, 2000); ctx.stroke();
            ctx.beginPath(); ctx.moveTo(-2000, i); ctx.lineTo(2000, i); ctx.stroke();
        }

        // Draw Player (Cartoonish Box)
        ctx.fillStyle = '#00a2ff';
        ctx.fillRect(this.player.x - 25, this.player.y - 25, 50, 50);

        // Draw Squad
        this.squad.forEach(b => {
            ctx.fillStyle = '#ffcc00';
            ctx.fillRect(b.x - 20, b.y - 20, 40, 40);
        });

        // Draw Zombies
        this.zombies.forEach(z => {
            ctx.fillStyle = '#44ff44';
            ctx.fillRect(z.x - 20, z.y - 20, 40, 40);
        });

        ctx.restore();
    }
};

Game.init();
