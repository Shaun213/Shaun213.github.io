const System = {
    particles: [],
    fps: 0,
    lastTime: 0,
    shake: 0,

    init() {
        this.lastTime = performance.now();
    },

    update(currentTime) {
        const dt = (currentTime - this.lastTime) / 1000;
        this.lastTime = currentTime;
        this.fps = Math.round(1 / dt);
        
        // Particle Physics
        for (let i = this.particles.length - 1; i >= 0; i--) {
            let p = this.particles[i];
            p.x += p.vx; p.y += p.vy;
            p.life -= 0.02;
            if (p.life <= 0) this.particles.splice(i, 1);
        }
        
        if (this.shake > 0) this.shake *= 0.9;
        return dt;
    },

    spawnBlood(x, y, count = 5) {
        for (let i = 0; i < count; i++) {
            this.particles.push({
                x, y, vx: (Math.random() - 0.5) * 6, vy: (Math.random() - 0.5) * 6,
                life: 1.0, color: '#8b0000', size: Math.random() * 4
            });
        }
    },

    dist(x1, y1, x2, y2) {
        return Math.sqrt((x2 - x1)**2 + (y2 - y1)**2);
    }
};
