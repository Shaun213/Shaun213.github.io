const System = {
    camera: { x: 0, y: 0, targetX: 0, targetY: 0, lerp: 0.08, shake: 0 },
    mouse: { x: 0, y: 0, worldX: 0, worldY: 0, down: false },
    keys: {},
    particles: [],

    init() {
        window.addEventListener('keydown', e => this.keys[e.code] = true);
        window.addEventListener('keyup', e => this.keys[e.code] = false);
        window.addEventListener('mousemove', e => {
            this.mouse.x = e.clientX;
            this.mouse.y = e.clientY;
        });
        window.addEventListener('mousedown', () => this.mouse.down = true);
        window.addEventListener('mouseup', () => this.mouse.down = false);
    },

    update(dt, player, canvas) {
        // Smooth Camera Follow (The Roblox Feel)
        this.camera.targetX = player.x - canvas.width / 2;
        this.camera.targetY = player.y - canvas.height / 2;
        this.camera.x += (this.camera.targetX - this.camera.x) * this.camera.lerp;
        this.camera.y += (this.camera.targetY - this.camera.y) * this.camera.lerp;

        // Screen Mouse to World Coordinates
        this.mouse.worldX = this.mouse.x + this.camera.x;
        this.mouse.worldY = this.mouse.y + this.camera.y;

        if (this.camera.shake > 0) this.camera.shake *= 0.9;

        // High-Performance Particles
        for (let i = this.particles.length - 1; i >= 0; i--) {
            let p = this.particles[i];
            p.x += p.vx * dt * 60;
            p.y += p.vy * dt * 60;
            p.life -= dt * 2;
            if (p.life <= 0) this.particles.splice(i, 1);
        }
    },

    spawnJuice(x, y, color, count = 8) {
        for(let i=0; i < count; i++) {
            this.particles.push({
                x, y, vx: (Math.random()-0.5)*12, vy: (Math.random()-0.5)*12,
                life: 1, color: color, size: Math.random()*6 + 2
            });
        }
    }
};
