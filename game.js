let scene = new THREE.Scene();
scene.background = new THREE.Color(0x0a0a0a);
scene.fog = new THREE.Fog(0x000000, 20, 150);

let camera = new THREE.PerspectiveCamera(75, innerWidth/innerHeight, 0.1, 1000);
let renderer = new THREE.WebGLRenderer({antialias:true});
renderer.setSize(innerWidth, innerHeight);
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
document.body.appendChild(renderer.domElement);

let controls = new THREE.PointerLockControls(camera, document.body);
document.body.addEventListener("click", ()=>controls.lock());
scene.add(controls.getObject());

camera.position.y = 2;

// Lighting
let hemi = new THREE.HemisphereLight(0x8888ff,0x080820,0.5);
scene.add(hemi);

let dirLight = new THREE.DirectionalLight(0xffffff,1);
dirLight.position.set(10,20,10);
dirLight.castShadow=true;
dirLight.shadow.mapSize.width=2048;
dirLight.shadow.mapSize.height=2048;
scene.add(dirLight);

// Ground
let ground = new THREE.Mesh(
new THREE.PlaneGeometry(500,500),
new THREE.MeshStandardMaterial({color:0x1a1a1a})
);
ground.rotation.x=-Math.PI/2;
ground.receiveShadow=true;
scene.add(ground);

// Buildings
let buildings=[];
for(let i=0;i<40;i++){
let h=Math.random()*15+5;
let b=new THREE.Mesh(
new THREE.BoxGeometry(8,h,8),
new THREE.MeshStandardMaterial({color:0x222222})
);
b.position.set((Math.random()-0.5)*200,h/2,(Math.random()-0.5)*200);
b.castShadow=true;
scene.add(b);
buildings.push(b);
}

// Weapon Model
let weaponMesh = new THREE.Mesh(
new THREE.BoxGeometry(0.3,0.2,1),
new THREE.MeshStandardMaterial({color:0x444444})
);
weaponMesh.position.set(0.5,-0.5,-1);
camera.add(weaponMesh);

// Game State
let zombies=[];
let wave=1;
let score=0;
let health=100;
let ammo=12;
let reserve=48;
let weapon=1;
let fps=0;
let lastFrame=performance.now();
let graphicsHigh=true;
let shadowsOn=true;

// Spawn
function spawnZombie(boss=false){
let size=boss?4:2;
let z=new THREE.Mesh(
new THREE.BoxGeometry(size,size*2,size),
new THREE.MeshStandardMaterial({color: boss?0xaa0000:0x006600})
);
z.position.set((Math.random()-0.5)*150,size,(Math.random()-0.5)*150);
z.health=boss?300:60+wave*5;
z.speed=boss?0.015:0.02+wave*0.001;
z.isBoss=boss;
z.castShadow=true;
scene.add(z);
zombies.push(z);
}

function nextWave(){
for(let i=0;i<wave*4;i++) spawnZombie();
if(wave%5===0) spawnZombie(true);
wave++;
}

nextWave();

// Shooting
function shoot(){
if(ammo<=0) return;
ammo--;

let flash=new THREE.PointLight(0xffaa00,2,5);
flash.position.copy(camera.position);
scene.add(flash);
setTimeout(()=>scene.remove(flash),50);

let ray=new THREE.Raycaster(camera.position,
new THREE.Vector3(0,0,-1).applyQuaternion(camera.quaternion));

let hits=ray.intersectObjects(zombies);
if(hits.length>0){
let z=hits[0].object;
z.health-=weapon===1?40:70;
bloodEffect(z.position.clone());
if(z.health<=0){
scene.remove(z);
zombies.splice(zombies.indexOf(z),1);
score+=10;
}
}
}

document.addEventListener("mousedown",shoot);

// Blood particles
function bloodEffect(pos){
let geo=new THREE.BufferGeometry();
let points=[];
for(let i=0;i<20;i++){
points.push(pos.clone().add(new THREE.Vector3(
(Math.random()-0.5),
Math.random(),
(Math.random()-0.5)
)));
}
geo.setFromPoints(points);
let mat=new THREE.PointsMaterial({color:0xaa0000,size:0.2});
let p=new THREE.Points(geo,mat);
scene.add(p);
setTimeout(()=>scene.remove(p),300);
}

// Movement
let move={};
document.addEventListener("keydown",e=>move[e.code]=true);
document.addEventListener("keyup",e=>move[e.code]=false);

// Menu
function resume(){
document.getElementById("menu").style.display="none";
controls.lock();
}

document.addEventListener("keydown",e=>{
if(e.code==="Escape"){
document.getElementById("menu").style.display="block";
controls.unlock();
}
});

// Animation Loop
function animate(){
requestAnimationFrame(animate);

let now=performance.now();
fps=Math.round(1000/(now-lastFrame));
lastFrame=now;

if(controls.isLocked){
let speed=move["ShiftLeft"]?0.2:0.1;
if(move["KeyW"]) controls.moveForward(speed);
if(move["KeyS"]) controls.moveForward(-speed);
if(move["KeyA"]) controls.moveRight(-speed);
if(move["KeyD"]) controls.moveRight(speed);
}

// Zombie AI
zombies.forEach(z=>{
let dir=camera.position.clone().sub(z.position).normalize();
let ray=new THREE.Raycaster(z.position,dir,0,3);
let collision=ray.intersectObjects(buildings);
if(collision.length>0){
z.position.x+=(Math.random()-0.5)*0.1;
} else {
z.position.add(dir.multiplyScalar(z.speed));
}
if(z.position.distanceTo(camera.position)<2){
health-=0.2;
}
});

// Regen
if(health<100) health+=0.02;

if(zombies.length===0) nextWave();

if(health<=0){
alert("Game Over! Score: "+score);
localStorage.setItem("highscore",Math.max(score,localStorage.getItem("highscore")||0));
location.reload();
}

document.getElementById("stats").innerHTML=
`Health: ${Math.floor(health)}<br>
Wave: ${wave}<br>
Score: ${score}<br>
Ammo: ${ammo}/${reserve}<br>
High Score: ${localStorage.getItem("highscore")||0}`;

document.getElementById("fps").innerHTML="FPS: "+fps;

renderer.render(scene,camera);
}

animate();
