const UI = {
    update() {
        document.getElementById('mc-val').innerText = Math.floor(State.mc);
        document.getElementById('hp-fill').style.width = State.hp + '%';
        document.getElementById('wave-val').innerText = "WAVE " + State.wave;
    },
    
    screenShake() {
        const cam = Game.camera;
        if (!cam) return;
        const originalPos = cam.position.clone();
        let count = 0;
        const interval = setInterval(() => {
            cam.position.x += (Math.random() - 0.5) * 0.5;
            count++;
            if (count > 5) {
                clearInterval(interval);
                cam.position.copy(originalPos);
            }
        }, 30);
    }
};
