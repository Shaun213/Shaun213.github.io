let lastTime = performance.now();
let fps=0;

function updateHUD(){
    let now=performance.now();
    let delta=now-lastTime;
    fps=Math.round(1000/delta);
    lastTime=now;
    document.getElementById("fpsCounter").innerText="FPS: "+fps;
    document.getElementById("moneyDisplay").innerText="Money: $"+Math.floor(player.money);
    document.getElementById("scoreDisplay").innerText="Score: "+player.score;
    document.getElementById("waveDisplay").innerText="Wave: "+waveNumber;
    document.getElementById("healthDisplay").innerText="Health: "+Math.floor(player.health);
    let activePowerUps=powerUps.map(p=>p.type).join(", ");
    document.getElementById("powerUpDisplay").innerText="Power-ups: "+(activePowerUps||"None");
}

// BUY BUTTONS
document.getElementById("buyTeammateBtn").onclick=()=>{if(player.money>=100){spawnTeammate();player.money-=100;}}
document.getElementById("buyWeaponPistolBtn").onclick=()=>{if(player.money>=50){player.weapons.pistol=true;player.money-=50;}}
document.getElementById("buyWeaponRifleBtn").onclick=()=>{if(player.money>=200){player.weapons.rifle=true;player.money-=200;}}
document.getElementById("buyWeaponMeleeBtn").onclick=()=>{if(player.money>=100){player.weapons.melee=true;player.money-=100;}}

// UI ANIMATION
function animateUI(){updateHUD();requestAnimationFrame(animateUI);}
animateUI();
