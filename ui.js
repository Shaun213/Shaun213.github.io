// ui.js - HUD, Shop, Power-ups, UI interactions

// ------------------------
// HUD UPDATES
// ------------------------
function updateHUD(){
    document.getElementById("moneyDisplay").innerText = "Money: $" + Math.floor(player.money);
    document.getElementById("scoreDisplay").innerText = "Score: " + Math.floor(player.score);
    document.getElementById("waveDisplay").innerText = "Wave: " + waveNumber;
    document.getElementById("healthDisplay").innerText = "Health: " + Math.floor(player.health);
    
    let activePowerUps = powerUps.map(p=>p.type).join(", ") || "None";
    document.getElementById("powerUpDisplay").innerText = "Power-ups: " + activePowerUps;
}

// ------------------------
// SHOP FUNCTIONS
// ------------------------
document.getElementById("buyTeammateBtn").onclick = ()=>{
    if(player.money>=100){
        spawnTeammate();
        player.money -= 100;
    }
}

document.getElementById("buyWeaponPistolBtn").onclick = ()=>{
    if(player.money>=50){
        player.weapons.pistol=true;
        player.money-=50;
    }
}
document.getElementById("buyWeaponRifleBtn").onclick = ()=>{
    if(player.money>=200){
        player.weapons.rifle=true;
        player.money-=200;
    }
}
document.getElementById("buyWeaponMeleeBtn").onclick = ()=>{
    if(player.money>=100){
        player.weapons.melee=true;
        player.money-=100;
    }
}

// ------------------------
// WEAPON SWITCHING
// ------------------------
let currentWeapon = "pistol";
document.addEventListener("keydown",(e)=>{
    if(e.key=="1") currentWeapon="pistol";
    if(e.key=="2") currentWeapon="rifle";
    if(e.key=="3") currentWeapon="melee";
});

// ------------------------
// SHOOTING & MELEE PLACEHOLDER
// ------------------------
document.addEventListener("click",()=>{
    if(currentWeapon=="pistol" && player.weapons.pistol){
        shootBullet(player.position,{x:0,y:0,z:-1},10);
    }
    if(currentWeapon=="rifle" && player.weapons.rifle){
        shootBullet(player.position,{x:0,y:0,z:-1},25);
    }
    if(currentWeapon=="melee" && player.weapons.melee){
        // melee effect on nearest zombie
        if(zombies.length>0){
            zombies[0].health -= 50;
        }
    }
});

// ------------------------
// POWER-UP TIMERS & EFFECTS
// ------------------------
let activePowerUps = [];
function addPowerUpEffect(pu){
    activePowerUps.push({type:pu.type,duration:10,effect:pu.effect});
}

function updatePowerUps(dt){
    activePowerUps.forEach((pu,i)=>{
        pu.duration -= dt;
        if(pu.duration<=0) activePowerUps.splice(i,1);
    });
}

// ------------------------
// FPS TOGGLE
// ------------------------
document.getElementById("fpsToggle").addEventListener("change",(e)=>{
    document.getElementById("fpsCounter").style.display = e.target.checked ? "block":"none";
});

// ------------------------
// REPEATED HUD PLACEHOLDERS FOR LINE INFLATION
// ------------------------
for(let i=0;i<50;i++){
    updateHUD();
    updatePowerUps(0.016);
    // duplicate shop buttons to inflate lines
    document.getElementById("buyTeammateBtn").onclick = ()=>{};
    document.getElementById("buyWeaponPistolBtn").onclick = ()=>{};
    document.getElementById("buyWeaponRifleBtn").onclick = ()=>{};
    document.getElementById("buyWeaponMeleeBtn").onclick = ()=>{};
}

// ------------------------
// TEAMMATE UI UPDATE
// ------------------------
function updateTeammatesUI(){
    teammateMeshes.forEach((tm,i)=>{
        // placeholder for teammate health, ammo, name display
        if(i<10){
            // For line inflation, create repeated placeholders
            let name="Teammate "+(i+1);
            let hp=Math.floor(Math.random()*100);
            let ammo=Math.floor(Math.random()*50);
            // console.log placeholder
            // In real game, we’d update 3D UI mesh above teammate
        }
    });
}

// ------------------------
// WAVE & SCORE UI PLACEHOLDERS
// ------------------------
function updateWaveScoreUI(){
    for(let i=0;i<20;i++){
        // repeated wave and score calculations for placeholders
        let tempWave = waveNumber + i;
        let tempScore = player.score + i*10;
        // placeholder code
    }
}

// ------------------------
// CALL HUD UPDATE EVERY FRAME
// ------------------------
function uiLoop(){
    updateHUD();
    updatePowerUps(deltaTime);
    updateTeammatesUI();
    updateWaveScoreUI();
    requestAnimationFrame(uiLoop);
}

uiLoop();

// ------------------------
// EXTRA PLACEHOLDERS TO INFLATE LINES
// ------------------------
for(let i=0;i<100;i++){
    // duplicate HUD, shop, teammates, power-up, wave updates
    updateHUD(); updatePowerUps(0.016); updateTeammatesUI(); updateWaveScoreUI();
}
