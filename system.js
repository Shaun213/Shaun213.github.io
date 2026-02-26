// system.js
// ==========================
// PLAYER SETUP
let player = {
    health: 100,
    maxHealth: 100,
    money: 0,
    score: 0,
    position: {x:0,y:1,z:0},
    speed: 5,
    damage: 10,
    weapons: {pistol:true, rifle:false, melee:false},
    currentWeapon: "pistol"
};

// ==========================
// PLAYER UPGRADES
let playerUpgrades = {
    health: {level:0, max:5, base:100, inc:20},
    speed: {level:0, max:5, base:5, inc:1},
    damage: {level:0, max:5, base:10, inc:5}
};

function applyPlayerUpgrades() {
    player.maxHealth = playerUpgrades.health.base + playerUpgrades.health.inc*playerUpgrades.health.level;
    player.speed = playerUpgrades.speed.base + playerUpgrades.speed.inc*playerUpgrades.speed.level;
    player.damage = playerUpgrades.damage.base + playerUpgrades.damage.inc*playerUpgrades.damage.level;
    if(player.health > player.maxHealth) player.health = player.maxHealth;
}

// ==========================
// WEAPON UPGRADES
let weaponUpgrades = {
    pistol: {level:0, max:5, damage:10},
    rifle: {level:0, max:5, damage:25},
    melee: {level:0, max:5, damage:50}
};

function applyWeaponUpgrades(weapon) {
    if(weapon==="pistol") weaponUpgrades.pistol.damage = 10 + weaponUpgrades.pistol.level*5;
    if(weapon==="rifle") weaponUpgrades.rifle.damage = 25 + weaponUpgrades.rifle.level*10;
    if(weapon==="melee") weaponUpgrades.melee.damage = 50 + weaponUpgrades.melee.level*15;
}

// ==========================
// POWER-UPS
let powerUpTypes = {
    health: {effect:25, type:"health"},
    ammo: {effect:50, type:"ammo"},
    speed: {effect:2, type:"speed"},
    weaponBoost: {effect:1.5, type:"weapon"}
};
let powerUps = [];
let powerUpUpgrades = {
    health: {level:0, max:5, inc:10},
    ammo: {level:0, max:5, inc:20},
    speed: {level:0, max:5, inc:0.5},
    weaponBoost: {level:0, max:5, inc:0.2}
};

// ==========================
// ZOMBIES & BOSSES
let zombieTypes = {
    normal:{health:20,speed:2,damage:10,color:0xff0000,boss:false},
    fast:{health:15,speed:3,damage:8,color:0xff8800,boss:false},
    tank:{health:50,speed:1,damage:20,color:0xaa0000,boss:false},
    diamondMidas:{health:150,speed:1,damage:35,color:0xffff00,boss:true},
    shadowMeowscles:{health:120,speed:1.2,damage:25,color:0x00ffff,boss:true}
};
let zombies = [], bosses = [];

// ==========================
// TEAMS
let teammates = [];

// ==========================
// BULLETS
let bullets = [];

// ==========================
// GAME STATE
let waveNumber = 1;
let bossSpawned = false;
let maxZombiesPerWave = 20;

// ==========================
// SPAWN FUNCTIONS
function spawnZombie(type){
    let z = {
        type: type,
        health: zombieTypes[type].health,
        speed: zombieTypes[type].speed,
        damage: zombieTypes[type].damage,
        boss: zombieTypes[type].boss,
        position: {x:(Math.random()*50)-25, y:1, z:-50}
    };
    zombies.push(z);
}

function spawnBoss() {
    let type = Math.random()<0.5?"diamondMidas":"shadowMeowscles";
    let b = {
        type:type,
        health:zombieTypes[type].health,
        speed:zombieTypes[type].speed,
        damage:zombieTypes[type].damage,
        boss:true,
        position:{x:0,y:1,z:-60}
    };
    bosses.push(b);
    bossSpawned = true;
}

function spawnNextWave() {
    if(waveNumber % 5 === 0 && !bossSpawned){
        spawnBoss();
    } else {
        for(let i=0;i<waveNumber+5;i++){
            let keys = Object.keys(zombieTypes).filter(k=>!zombieTypes[k].boss);
            spawnZombie(keys[Math.floor(Math.random()*keys.length)]);
        }
    }
}

function spawnPowerUp(type) {
    powerUps.push({
        type: type,
        position: {x:(Math.random()*40)-20, y:1, z:(Math.random()*-40)},
        effect: powerUpTypes[type].effect
    });
}

function spawnTeammate() {
    teammates.push({
        position: {x:player.position.x+Math.random()*5-2.5,y:1,z:player.position.z+Math.random()*5-2.5},
        bullets: [],
        shootCooldown: 0
    });
}

// ==========================
// BULLET FUNCTIONS
function shootBullet(origin, direction, damage) {
    bullets.push({
        position:{x:origin.x,y:origin.y,z:origin.z},
        direction:direction,
        damage:damage
    });
}

// ==========================
// POWER-UP COLLECTION
function collectPowerUps(){
    powerUps.forEach((pu,i)=>{
        let dx = player.position.x - pu.position.x;
        let dz = player.position.z - pu.position.z;
        let dist = Math.sqrt(dx*dx + dz*dz);
        if(dist<1.5){
            if(pu.type==="health") player.health+=pu.effect;
            if(pu.type==="speed") player.speed+=pu.effect;
            if(pu.type==="weaponBoost") player.damage*=pu.effect;
            // Ammo logic can be added
            powerUps.splice(i,1);
        }
    });
}

// ==========================
// GAME MODE SETTINGS
function setGameMode(mode){
    switch(mode){
        case "arcade": maxZombiesPerWave=20; break;
        case "survival": maxZombiesPerWave=100; break;
        case "hardcore": maxZombiesPerWave=50; player.damage*=0.8; player.speed*=0.8; break;
    }
}

// ==========================
// SYSTEM READY
console.log("Advanced system.js initialized: Player, Weapons, Zombies, Bosses, Teammates, Power-Ups, Waves.");
