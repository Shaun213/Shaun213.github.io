const UI = {
    render(game) {
        document.getElementById('mc-display').innerText = `💰 $${Math.floor(game.mc)}`;
        document.getElementById('wave-num').innerText = `WAVE ${game.wave}`;
        document.getElementById('weapon-txt').innerText = game.player.weapon.name;
        
        // Dynamic Health Bar
        const hp = document.getElementById('hp-fill');
        hp.style.width = `${game.player.hp}%`;
        hp.style.backgroundColor = game.player.hp < 30 ? "#ff4757" : "#2ecc71";

        // Killstreak Alert
        const streak = document.getElementById('streak-ui');
        streak.style.opacity = game.streak >= 15 ? "1" : "0.2";
        
        // FPS Counter
        document.getElementById('fps-counter').innerText = `FPS: ${Math.round(game.fps)}`;
    },

    toggleShop() {
        const shop = document.getElementById('military-shop');
        shop.style.display = shop.style.display === 'none' ? 'block' : 'none';
    }
};
