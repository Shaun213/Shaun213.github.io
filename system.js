// system.js

let waveNumber=1, zombies=[], bossSpawned=false, teammates=[];
let money=0, score=0;

const bossWaveInterval = 5;

const zombieTypes = {
  normal:{health:20,speed:2,color:0xff0000},
  fast:{health:15,speed:3,color:0xff8800},
  tank:{health:50,speed:1,color:0xaa0000},
  diamondMidas:{health:150,speed:1,color:0xffff00,boss:true},
  shadowMeowscles:{health:120,speed:1.2,color:0x00ffff,boss:true}
};

function spawnZombie(type){
  const geom = new THREE.BoxGeometry(2,2,2);
  const mat = new THREE.MeshStandardMaterial({color:zombieTypes[type].color});
  const z = new THREE.Mesh(geom, mat);
  z.position.set(Math.random()*50-25,1,-50);
  z.health = zombieTypes[type].health;
  z.speed = zombieTypes[type].speed;
  z.boss = zombieTypes[type].boss || false;
  scene.add(z);
  zombies.push(z);
}

function spawnNextWave(){
  if(waveNumber % bossWaveInterval===0 && !bossSpawned && zombies.length===0){
    const bossType = Math.random()<0.5?'diamondMidas':'shadowMeowscles';
    spawnZombie(bossType);
    bossSpawned=true;
  }else{
    for(let i=0;i<waveNumber+1;i++){
      const types=['normal','fast','tank'];
      spawnZombie(types[Math.floor(Math.random()*types.length)]);
    }
  }
}

function updateWaves(){
  if(zombies.length===0){
    waveNumber++;
    spawnNextWave();
    bossSpawned=false;
  }
}

// Teammates
function spawnTeammates(player){
  teammates.forEach(tm=>{
    tm.position.lerp(player.position.clone().add(new THREE.Vector3(Math.random()*5-2.5,0,Math.random()*5-2.5)),0.02);
    if(zombies.length>0 && tm.shootCooldown<=0){
      let target = zombies[0];
      const bulletGeom = new THREE.SphereGeometry(0.3,8,8);
      const bulletMat = new THREE.MeshStandardMaterial({color:0xffff00});
      const b = new THREE.Mesh(bulletGeom, bulletMat);
      b.position.copy(tm.position);
      b.direction = new THREE.Vector3().subVectors(target.position,tm.position).normalize();
      scene.add(b);
      tm.bullets.push(b);
      tm.shootCooldown=60;
    }
    if(tm.shootCooldown>0) tm.shootCooldown--;
  });
}

// Power-ups (placeholder)
let powerUps = [];
function spawnPowerUp(type, x, z){
  const geom = new THREE.SphereGeometry(1,8,8);
  const mat = new THREE.MeshStandardMaterial({color:type==='health'?0x00ff00:0x0000ff});
  const p = new THREE.Mesh(geom, mat);
  p.position.set(x,1,z);
  scene.add(p);
  powerUps.push({mesh:p,type});
}
