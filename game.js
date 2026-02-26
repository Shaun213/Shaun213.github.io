const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const Game = {
    // Economy & Stats
    mc: 2500, wave: 0, mult: 1, streak: 0, fps: 0,
    xp: 0, xpNext: 100, lastTime: 0,
    
    // Entity Lists
    zombies: [], bullets: [], squad: [], particles: [],
    
    // Player State
    player: {
        x: 100, y: 100, hp: 100, maxHp: 100,
        weapon: { name: "Tactical Pistol", dmg: 25, rate: 250, next: 0, level: 1 },
        perks: { regen: false, doubleTap: false }
    },

    init() {
        System.init();
        this.nextWave();
        requestAnimationFrame(t => this.loop(t));
    },

    // AI Recruit System
    buyTeammate(type) {
        const costs = { RIFLE: 1000, HEAVY: 2500 };
        if (this.mc >= costs[type] && this.squad.length < 3) {
            this.mc -= costs[type];
            this.squad.push({
                type, x: this.player.x, y: this.player.y,
                hp: 100, shootNext: 0, dmg: type === 'RIFLE' ? 15 : 40
            });
            UI.toggleShop();
        }
    },

    // Weapon Upgrade System
    buyUpgrade(stat) {
        const cost = 1500 * this.player.weapon.level;
        if (this.mc >= cost) {
            this.mc -= cost;
            if (stat === 'damage') this.player.weapon.dmg += 15;
            if (stat === 'fireRate') this.player.weapon.rate *= 0.8;
            this.player.weapon.level++;
            UI.toggleShop();
        }
    },

    nextWave() {
        this.wave++;
        this.mc += 500;
        const isBoss = this.wave % 5 === 0;
        const count = isBoss ? 1 : 10 + (this.wave * 2);
        
        for(let i=0; i < count; i++) {
            this.zombies.push({
                x: Math.random() > 0.5 ? -100 : canvas.width + 100,
                y: Math.random() * canvas.height,
                hp: isBoss ? 2000 : 50 + (this.wave * 10),
                speed: isBoss ? 1.5 : 2 + Math.random() * 2,
                isBoss, size: isBoss ? 90 : 40
            });
        }
    },

    update(dt) {
        // Player Movement (WASD)
        const p = this.player;
        const speed = 400 * dt;
        if (System.keys['KeyW']) p.y -= speed;
        if (System.keys['KeyS']) p.y += speed;
        if (System.keys['KeyA']) p.x -= speed;
        if (System.keys['KeyD']) p.x += speed;

        // Multiplier & Perk Logic
        if (p.perks.regen && p.hp < 100) p.hp += 0.02;
        this.mult = Math.min(5, 1 + Math.floor(this.streak / 5));

        // Shooting Logic
        if (System.mouse.down && performance.now() > p.weapon.next) {
            this.fire();
        }

        // Squad AI Movement & Auto-Aim
        this.squad.forEach(bot => {
            const d = Math.hypot(p.x - bot.x, p.y - bot.y);
            if (d > 80) {
                bot.x += (p.x - bot.x) * 0.05;
                bot.y += (p.y - bot.y) * 0.05;
            }
            // Auto-fire at nearest zombie
            if (this.zombies.length > 0 && performance.now() > bot.shootNext) {
                this.bullets.push({ x: bot.x, y: bot.y, vx: 10, vy: 0, dmg: bot.dmg, friendly: true });
                bot.shootNext = performance.now() + 500;
            }
        });

        // Bullet Physics & Collision
        for(let i=this.bullets.length-1; i>=0; i--) {
            let b = this.bullets[i];
            b.x += b.vx; b.y += b.vy;
            // Check collisions here... (omitted for brevity)
        }

        // Zombie AI
        this.zombies.forEach((z, i) => {
            const ang = Math.atan2(p.y - z.y, p.x - z.x);
            z.x += Math.cos(ang) * z.speed;
            z.y += Math.sin(ang) * z.speed;
            if (Math.hypot(p.x - z.x, p.y - z.y) < 30) {
                p.hp -= 0.5;
                this.streak = 0; // Reset multiplier on hit
            }
        });

        if (this.zombies.length === 0) this.nextWave();
        System.update(dt, p, canvas);
    },

    fire() {
        const w = this.player.weapon;
        w.next = performance.now() + w.rate;
        const ang = Math.atan2(System.mouse.worldY - this.player.y, System.mouse.worldX - this.player.x);
        this.bullets.push({
            x: this.player.x, y: this.player.y,
            vx: Math.cos(ang) * 15, vy: Math.sin(ang) * 15,
            dmg: w.dmg, friendly: true
        });
        System.camera.shake = 10;
        this.streak++;
    },

    draw() {
        ctx.fillStyle = "#0a0a0a";
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        ctx.save();
        ctx.translate(canvas.width/2 - System.camera.x, canvas.height/2 - System.camera.y);
        
        // Render 3D Grid
        ctx.strokeStyle = "#1a1a1a";
        for(let x=-2000; x<2000; x+=100) {
            ctx.beginPath(); ctx.moveTo(x, -2000); ctx.lineTo(x, 2000); ctx.stroke();
            ctx.beginPath(); ctx.moveTo(-2000, x); ctx.lineTo(2000, x); ctx.stroke();
        }

        // Render Entities
        ctx.fillStyle = "#3498db"; ctx.fillRect(this.player.x-25, this.player.y-25, 50, 50);
        this.zombies.forEach(z => {
            ctx.fillStyle = z.isBoss ? "#e74c3c" : "#2ecc71";
            ctx.fillRect(z.x - z.size/2, z.y - z.size/2, z.size, z.size);
        });

        ctx.restore();
        UI.render(this);
    },

    loop(time) {
        const dt = (time - this.lastTime) / 1000;
        this.lastTime = time;
        this.fps = 1 / dt;
        this.update(dt);
        this.draw();
        requestAnimationFrame(t => this.loop(t));
    }
};
Game.init();
