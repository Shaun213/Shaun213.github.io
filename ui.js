const UI = {
    update(game) {
        document.getElementById('fps').innerText = `FPS: ${Math.round(game.fps)}`;
        document.getElementById('cash').innerText = `💰 $${Math.floor(game.mc)}`;
        document.getElementById('weapon').innerText = `🔫 ${game.player.weapon.name}`;
        
        const hpBar = document.getElementById('hp-fill');
        hpBar.style.width = `${game.player.hp}%`;
        
        // Airstrike Alert
        const air = document.getElementById('air-indicator');
        air.style.display = game.streak >= 15 ? 'block' : 'none';
    },

    showShop() {
        const menu = document.getElementById('shop-ui');
        menu.style.display = menu.style.display === 'none' ? 'block' : 'none';
    }
};
