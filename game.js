// game.js
let scene, camera, renderer, playerMesh, clock, deltaTime;
let keys = {w:false,a:false,s:false,d:false};
let currentWeapon = "pistol";

function startGame(){
  scene = new THREE.Scene();
  scene.background = new THREE.Color(0x87ceeb); // sky blue
  camera = new THREE.PerspectiveCamera(75,window.innerWidth/window.innerHeight,0.1,1000);
  camera.position.set(0,5,10);
  renderer = new THREE.WebGLRenderer({canvas:document.getElementById("gameCanvas")});
  renderer.setSize(window.innerWidth,window.innerHeight);
  clock = new THREE.Clock();
  initPlayer(); animate();
}

function initPlayer(){
  let geom = new THREE.BoxGeometry(1,2,1);
  let mat = new THREE.MeshStandardMaterial({color:document.getElementById("avatarColor").value});
  playerMesh = new THREE.Mesh(geom,mat);
  playerMesh.position.copy(player.position);
  scene.add(playerMesh);

  let light = new THREE.DirectionalLight(0xffffff,1);
  light.position.set(10,20,10);
  scene.add(light);
}

document.addEventListener("keydown",(e)=>{if(e.key=="w")keys.w=true;if(e.key=="s")keys.s=true;if(e.key=="a")keys.a=true;if(e.key=="d")keys.d=true;if(e.key=="1")currentWeapon="pistol";if(e.key=="2")currentWeapon="rifle";if(e.key=="3")currentWeapon="melee";});
document.addEventListener("keyup",(e)=>{if(e.key=="w")keys.w=false;if(e.key=="s")keys.s=false;if(e.key=="a")keys.a=false;if(e.key=="d")keys.d=false;});

document.addEventListener("click",()=>{
  if(currentWeapon=="pistol"&&player.weapons.pistol)shootBullet(player.position,{x:0,y:0,z:-1},weaponUpgrades.pistol.damage);
  if(currentWeapon=="rifle"&&player.weapons.rifle)shootBullet(player.position,{x:0,y:0,z:-1},weaponUpgrades.rifle.damage);
  if(currentWeapon=="melee"&&player.weapons.melee){if(zombies.length>0)zombies[0].health-=weaponUpgrades.melee.damage;}
});

function animate(){
  deltaTime = clock.getDelta();
  movePlayer();
  renderer.render(scene,camera);
  requestAnimationFrame(animate);
}

function movePlayer(){
  if(keys.w) playerMesh.position.z -= player.speed*deltaTime;
  if(keys.s) playerMesh.position.z += player.speed*deltaTime;
  if(keys.a) playerMesh.position.x -= player.speed*deltaTime;
  if(keys.d) playerMesh.position.x += player.speed*deltaTime;
  player.position.copy(playerMesh.position);
}
