// ui.js
let lastTime = performance.now();
let fps = 0;

// ==========================
// UPDATE HUD
function updateHUD(){
    let now = performance.now();
    let delta = now - lastTime;
    fps = Math.round(1000/delta);
    lastTime = now;

    document.getElementById("fpsCounter").innerText = "FPS: " + fps;
    document.getElementById("moneyDisplay").innerText = "Money: $" + Math.floor(player.money);
    document.getElementById("scoreDisplay").innerText = "Score: " + player.score;
    document.getElementById("waveDisplay").innerText = "Wave: " + waveNumber;
    document.getElementById("healthDisplay").innerText = "Health: " + Math.floor(player.health);
    
    let activePowerUps = powerUps.map(p=>p.type).join(", ") || "None";
    document.getElementById("powerUpDisplay").innerText = "Power-ups: " + activePowerUps;
}

// ==========================
// BUY TEAMMATES
document.getElementById("buyTeammateBtn").onclick = ()=>{
    if(player.money>=100){
        spawnTeammate();
        player.money-=100;
    }
}

// ==========================
// BUY WEAPONS
document.getElementById("buyWeaponPistolBtn").onclick = ()=>{
    if(player.money>=50){
        player.weapons.pistol = true;
        player.money-=50;
    }
}

document.getElementById("buyWeaponRifleBtn").onclick = ()=>{
    if(player.money>=200){
        player.weapons.rifle = true;
        player.money-=200;
    }
}

document.getElementById("buyWeaponMeleeBtn").onclick = ()=>{
    if(player.money>=100){
        player.weapons.melee = true;
        player.money-=100;
    }
}

// ==========================
// ANIMATE HUD
function animateUI(){
    updateHUD();
    requestAnimationFrame(animateUI);
}

// ==========================
// START UI LOOP
animateUI();

// ==========================
// BONUS: colorful background for HUD
document.getElementById("hud").style.background="linear-gradient(90deg, rgba(255,0,0,0.3), rgba(255,165,0,0.3), rgba(0,255,255,0.3))";
document.getElementById("hud").style.padding="10px";
document.getElementById("hud").style.borderRadius="10px";
document.getElementById("hud").style.fontFamily="Verdana, sans-serif";
