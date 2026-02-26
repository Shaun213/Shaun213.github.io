const UI = {
    render(game) {
        // FPS & Stats
        document.getElementById('fps').innerText = `FPS: ${System.fps}`;
        document.getElementById('mc').innerText = `MC: $${game.mc}`;
        document.getElementById('wave').innerText = `WAVE: ${game.wave}`;
        document.getElementById('mult').innerText = `X${game.multiplier}`;
        
        // Health Bar
        const hb = document.getElementById('hp-inner');
        hb.style.width = `${game.hp}%`;
        hb.style.background = game.hp < 30 ? '#ff0000' : '#00ff00';

        // Airstrike Indicator
        document.getElementById('airstrike-btn').style.opacity = game.killsSinceDeath >= 15 ? '1' : '0.3';
    },

    toggleShop() {
        const s = document.getElementById('shop');
        s.style.display = s.style.display === 'none' ? 'grid' : 'none';
    }
};
