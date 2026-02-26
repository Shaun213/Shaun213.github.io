const System = {
    camera: { x: 0, y: 0, shake: 0 },
    mouse: { x: 0, y: 0, worldX: 0, worldY: 0, down: false },
    keys: {},

    init() {
        window.addEventListener('keydown', e => this.keys[e.code] = true);
        window.addEventListener('keyup', e => this.keys[e.code] = false);
        window.addEventListener('mousemove', e => { this.mouse.x = e.clientX; this.mouse.y = e.clientY; });
        window.addEventListener('mousedown', () => this.mouse.down = true);
        window.addEventListener('mouseup', () => this.mouse.down = false);
    },

    update(dt, player, canvas) {
        // Smooth Glide Camera
        this.camera.x += (player.x - canvas.width/2 - this.camera.x) * 0.1;
        this.camera.y += (player.y - canvas.height/2 - this.camera.y) * 0.1;
        this.mouse.worldX = this.mouse.x + this.camera.x;
        this.mouse.worldY = this.mouse.y + this.camera.y;
        if(this.camera.shake > 0) this.camera.shake *= 0.9;
    }
};
