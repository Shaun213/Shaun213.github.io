/* ============================================================
   GAME.JS — 3D Engine and AI Behavior
   ============================================================ */

const GameCore = {
    scene: null, camera: null, renderer: null,
    player: null, squad: [], enemies: [],
    frames: 0, lastFpsUpdate: performance.now(),

    init() {
        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 1000);
        this.renderer = new THREE.WebGLRenderer({ canvas: document.getElementById('world-canvas'), antialias: true });
        this.renderer.setSize(window.innerWidth, window.innerHeight);

        // Lighting
        const sun = new THREE.DirectionalLight(0xffffff, 1);
        sun.position.set(5, 10, 7);
        this.scene.add(sun, new THREE.AmbientLight(0x404040, 2));

        // Player (Elite Soldier)
        this.player = new THREE.Mesh(new THREE.BoxGeometry(1, 2, 1), new THREE.MeshStandardMaterial({color: 0x4b5320}));
        this.player.position.y = 1;
        this.scene.add(this.player);

        this.camera.position.set(0, 15, 12);
        this.camera.lookAt(this.player.position);

        this.spawnEnemies();
        this.animate();
    },

    spawnEnemies() {
        const count = 5 + (State.wave * 3);
        const isBossWave = State.wave % 5 === 0;
        
        for(let i=0; i<count; i++) {
            const size = isBossWave ? 3 : 1; // Juggernaut logic
            const z = new THREE.Mesh(new THREE.BoxGeometry(size, size*2, size), new THREE.MeshStandardMaterial({color: 0x7a9a64}));
            z.position.set(Math.random()*40-20, size, Math.random()*40-20);
            z.userData = { hp: isBossWave ? 1000 : 50 };
            this.enemies.push(z);
            this.scene.add(z);
        }
    },

    buySoldier(type, cost) {
        if (State.mc >= cost) {
            State.mc -= cost;
            const mate = new THREE.Mesh(new THREE.BoxGeometry(0.8, 1.8, 0.8), new THREE.MeshStandardMaterial({color: 0x3498db}));
            mate.userData = { offset: new THREE.Vector3(Math.random()*4-2, 0, 2) };
            this.scene.add(mate);
            this.squad.push(mate);
            UI.toggleShop();
        }
    },

    animate() {
        // FPS Monitoring
        this.frames++;
        const now = performance.now();
        if (now >= this.lastFpsUpdate + 1000) {
            document.getElementById('fps-val').innerText = this.frames;
            this.frames = 0;
            this.lastFpsUpdate = now;
        }

        // Squad AI Movement (Lerping)
        this.squad.forEach(mate => {
            const target = this.player.position.clone().add(mate.userData.offset);
            mate.position.lerp(target, 0.08); // Smoothly follow player
        });

        // Killstreak check
        if (State.streak >= 15) {
            State.streak = 0;
            UI.redAlert();
            UI.screenShake(20);
            this.enemies.forEach(e => e.userData.hp -= 100); // Airstrike Damage
        }

        UI.update();
        this.renderer.render(this.scene, this.camera);
        requestAnimationFrame(() => this.animate());
    },

    start() {
        document.getElementById('start-screen').style.display = 'none';
        this.init();
    }
};
