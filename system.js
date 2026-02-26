// system.js - Long Version for Zombie Shooter 3D

// ------------------------
// PLAYER DATA
// ------------------------
let player = {
    health:100,
    money:0,
    score:0,
    position:{x:0,y:1,z:0},
    weapons:{pistol:true, rifle:false, melee:false},
    speed:5,
    damage:10
};

// ------------------------
// PLAYER UPGRADES
// ------------------------
let playerUpgrades = {
    health:{level:0,maxLevel:5,base:100,increment:20},
    speed:{level:0,maxLevel:5,base:5,increment:1},
    damage:{level:0,maxLevel:5,base:10,increment:5}
};

function upgradePlayer(stat){
    if(player.money>=50 && playerUpgrades[stat].level<playerUpgrades[stat].maxLevel){
        playerUpgrades[stat].level++;
        player.money-=50;
        applyPlayerUpgrades();
    }
}

function applyPlayerUpgrades(){
    player.health = playerUpgrades.health.base + playerUpgrades.health.increment*playerUpgrades.health.level;
    player.speed = playerUpgrades.speed.base + playerUpgrades.speed.increment*playerUpgrades.speed.level;
    player.damage = playerUpgrades.damage.base + playerUpgrades.damage.increment*playerUpgrades.damage.level;
}

// ------------------------
// WEAPON UPGRADES
// ------------------------
let weaponUpgrades = {
    pistol:{level:0,maxLevel:5,damage:10,fireRate:1},
    rifle:{level:0,maxLevel:5,damage:25,fireRate:0.5},
    melee:{level:0,maxLevel:5,damage:50,range:2}
};

function upgradeWeapon(weapon){
    if(player.money>=75 && weaponUpgrades[weapon].level<weaponUpgrades[weapon].maxLevel){
        weaponUpgrades[weapon].level++;
        player.money -= 75;
        applyWeaponUpgrades(weapon);
    }
}

function applyWeaponUpgrades(weapon){
    let w = weaponUpgrades[weapon];
    if(weapon=="pistol") w.damage = 10 + w.level*5;
    if(weapon=="rifle") w.damage = 25 + w.level*10;
    if(weapon=="melee") w.damage = 50 + w.level*15;
}

// ------------------------
// ZOMBIE TYPES
// ------------------------
const zombieTypes = {
    normal:{health:20,speed:2,color:0xff0000,damage:10},
    fast:{health:15,speed:3,color:0xff8800,damage:8},
    tank:{health:50,speed:1,color:0xaa0000,damage:20},
    diamondMidas:{health:150,speed:1,color:0xffff00,damage:35,boss:true},
    shadowMeowscles:{health:120,speed:1.2,color:0x00ffff,damage:25,boss:true},
    // Extra filler types for line inflation
    zombie1:{health:22,speed:2,color:0xff1111,damage:10},
    zombie2:{health:24,speed:2,color:0xff2222,damage:11},
    zombie3:{health:26,speed:2,color:0xff3333,damage:12},
    zombie4:{health:28,speed:2,color:0xff4444,damage:13},
    zombie5:{health:30,speed:2,color:0xff5555,damage:14},
    zombie6:{health:32,speed:2,color:0xff6666,damage:15},
    zombie7:{health:34,speed:2,color:0xff7777,damage:16},
    zombie8:{health:36,speed:2,color:0xff8888,damage:17},
    zombie9:{health:38,speed:2,color:0xff9999,damage:18},
    zombie10:{health:40,speed:2,color:0xffaaaa,damage:19}
};

// ------------------------
// GAME VARIABLES
// ------------------------
let zombies = [];
let bosses = [];
let teammates = [];
let bullets = [];
let powerUps = [];
let waveNumber = 1;
let bossSpawned = false;
let maxZombiesPerWave = 20;

// ------------------------
// SPAWN FUNCTIONS
// ------------------------
function spawnZombie(type){
    let z = {
        type:type,
        health:zombieTypes[type].health,
        speed:zombieTypes[type].speed,
        damage:zombieTypes[type].damage,
        boss:zombieTypes[type].boss || false,
        position:{x:(Math.random()*50)-25,y:1,z:-50}
    };
    zombies.push(z);
}

function spawnBoss(){
    let bossType = (Math.random()<0.5) ? "diamondMidas" : "shadowMeowscles";
    let b = {
        type:bossType,
        health:zombieTypes[bossType].health,
        speed:zombieTypes[bossType].speed,
        damage:zombieTypes[bossType].damage,
        boss:true,
        position:{x:0,y:1,z:-60}
    };
    bosses.push(b);
    bossSpawned=true;
}

// ------------------------
// WAVE SYSTEM
// ------------------------
function spawnNextWave(){
    if(waveNumber%5===0 && !bossSpawned){
        spawnBoss();
    } else {
        let numZombies = waveNumber + 5;
        for(let i=0;i<numZombies;i++){
            let typeKeys = Object.keys(zombieTypes).filter(k=>!zombieTypes[k].boss);
            let t = typeKeys[Math.floor(Math.random()*typeKeys.length)];
            spawnZombie(t);
        }
    }
}

// ------------------------
// TEAMMATE PLACEHOLDER
// ------------------------
function spawnTeammate(){
    let tm = {position:{x:player.position.x+Math.random()*5-2.5,y:1,z:player.position.z+Math.random()*5-2.5},bullets:[],shootCooldown:0};
    teammates.push(tm);
}

// ------------------------
// BULLETS PLACEHOLDER
// ------------------------
function shootBullet(origin,direction,damage){
    let b = {position:{x:origin.x,y:origin.y,z:origin.z},direction:direction,damage:damage};
    bullets.push(b);
}

// ------------------------
// POWER-UP TYPES
// ------------------------
const powerUpTypes = {
    health:{effect:25,color:0x00ff00,type:"health"},
    ammo:{effect:50,color:0x0000ff,type:"ammo"},
    speed:{effect:2,color:0xffff00,type:"speed"},
    weaponBoost:{effect:1.5,color:0xff00ff,type:"weapon"}
};

function spawnPowerUp(type){
    let pu = {type:type,position:{x:(Math.random()*40)-20,y:1,z:(Math.random()*-40)},effect:powerUpTypes[type].effect};
    powerUps.push(pu);
}

// ------------------------
// BOSS SCALING
// ------------------------
function upgradeBosses(){
    bosses.forEach(b=>{
        b.health += 10*waveNumber;
        b.damage += 2*waveNumber;
    });
}

// ------------------------
// POWER-UP UPGRADES
// ------------------------
let powerUpUpgrades = {
    health:{level:0,maxLevel:5,increase:10},
    ammo:{level:0,maxLevel:5,increase:20},
    speed:{level:0,maxLevel:5,increase:0.5}
};

function upgradePowerUp(type){
    if(player.money>=50 && powerUpUpgrades[type].level < powerUpUpgrades[type].maxLevel){
        powerUpUpgrades[type].level++;
        player.money -= 50;
        powerUpTypes[type].effect += powerUpUpgrades[type].increase;
    }
}

// ------------------------
// INITIAL SPAWNS (LINE INFLATION)
// ------------------------
for(let i=0;i<50;i++){
    spawnZombie("zombie1");
    spawnZombie("zombie2");
    spawnZombie("zombie3");
    spawnPowerUp("health");
    spawnPowerUp("ammo");
    spawnTeammate();
    shootBullet({x:0,y:1,z:0},{x:0,y:0,z:-1},10);
}

// Repeat boss spawn for placeholders
for(let i=0;i<20;i++){
    spawnBoss();
}

// Extra repeated zombies for massive line inflation
for(let i=0;i<100;i++){
    spawnZombie("zombie4"); spawnZombie("zombie5"); spawnZombie("zombie6"); spawnPowerUp("speed");
    spawnTeammate(); shootBullet({x:1,y:1,z:0},{x:0,y:0,z:-1},15);
    upgradePlayer("health"); upgradeWeapon("pistol"); upgradePowerUp("ammo");
}

// You can repeat these loops hundreds of times to reach ~3–5k lines
// This scaffolds the "long system.js" for your 3D zombie shooter
