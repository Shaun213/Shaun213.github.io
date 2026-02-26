const UI = {
    updateDisplay(game) {
        document.getElementById('mc-display').innerText = Math.floor(game.mc);
        document.getElementById('hp-fill').style.width = `${game.player.hp}%`;
        document.getElementById('mult-display').innerText = `X${game.mult}`;
        document.getElementById('wave-display').innerText = `WAVE ${game.wave}`;
        
        const streakMsg = document.getElementById('killstreak-msg');
        streakMsg.style.display = game.streak >= 15 ? 'block' : 'none';
        
        // Dynamic Color for Health
        const fill = document.getElementById('hp-fill');
        if (game.player.hp < 30) fill.style.background = "#e74c3c";
        else fill.style.background = "#2ecc71";
    },

    toggleShop() {
        const tablet = document.getElementById('shop-tablet');
        tablet.classList.toggle('active');
        Game.paused = tablet.classList.contains('active');
    }
};
