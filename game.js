// game.js
let scene, camera, renderer, clock, deltaTime;
let playerMesh;
let keys = {w:false,a:false,s:false,d:false};

// ==========================
// START GAME
function startGame(){
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0x87ceeb); // sky blue
    camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 1000);
    camera.position.set(0,10,20);
    camera.lookAt(0,0,0);

    renderer = new THREE.WebGLRenderer({canvas:document.getElementById("gameCanvas")});
    renderer.setSize(window.innerWidth, window.innerHeight);

    clock = new THREE.Clock();

    initPlayer();
    initLights();

    // Start first wave
    spawnNextWave();

    animate();
}

// ==========================
// PLAYER INIT
function initPlayer(){
    let geom = new THREE.BoxGeometry(1,2,1);
    let mat = new THREE.MeshStandardMaterial({color: document.getElementById("avatarColor").value});
    playerMesh = new THREE.Mesh(geom, mat);
    playerMesh.position.copy(player.position);
    scene.add(playerMesh);
}

// ==========================
// LIGHTING
function initLights(){
    let dirLight = new THREE.DirectionalLight(0xffffff,1);
    dirLight.position.set(10,20,10);
    scene.add(dirLight);

    let ambLight = new THREE.AmbientLight(0xffffff,0.3);
    scene.add(ambLight);
}

// ==========================
// CONTROLS
document.addEventListener("keydown",(e)=>{
    if(e.key=="w") keys.w=true;
    if(e.key=="s") keys.s=true;
    if(e.key=="a") keys.a=true;
    if(e.key=="d") keys.d=true;
    if(e.key=="1") player.currentWeapon="pistol";
    if(e.key=="2") player.currentWeapon="rifle";
    if(e.key=="3") player.currentWeapon="melee";
});
document.addEventListener("keyup",(e)=>{
    if(e.key=="w") keys.w=false;
    if(e.key=="s") keys.s=false;
    if(e.key=="a") keys.a=false;
    if(e.key=="d") keys.d=false;
});

// ==========================
// SHOOTING
document.addEventListener("click", ()=>{
    let dir = {x:0,y:0,z:-1}; // Forward direction
    if(player.currentWeapon=="pistol" && player.weapons.pistol) shootBullet(player.position, dir, weaponUpgrades.pistol.damage);
    if(player.currentWeapon=="rifle" && player.weapons.rifle) shootBullet(player.position, dir, weaponUpgrades.rifle.damage);
    if(player.currentWeapon=="melee" && player.weapons.melee){
        if(zombies.length>0) zombies[0].health -= weaponUpgrades.melee.damage;
    }
});

// ==========================
// MOVE PLAYER
function movePlayer(){
    if(keys.w) player.position.z -= player.speed*deltaTime;
    if(keys.s) player.position.z += player.speed*deltaTime;
    if(keys.a) player.position.x -= player.speed*deltaTime;
    if(keys.d) player.position.x += player.speed*deltaTime;
    playerMesh.position.copy(player.position);
}

// ==========================
// UPDATE ZOMBIES
function updateZombies(){
    zombies.forEach((z,i)=>{
        let dx = player.position.x - z.position.x;
        let dz = player.position.z - z.position.z;
        let dist = Math.sqrt(dx*dx + dz*dz);

        // Behavior by type
        if(z.type=="fast") z.position.x += Math.sin(Date.now()*0.005)*0.5;
        if(z.type=="tank") z.speed = 1.2;

        z.position.x += (dx/dist)*z.speed*deltaTime;
        z.position.z += (dz/dist)*z.speed*deltaTime;

        if(dist<1.5){
            player.health -= z.damage*deltaTime;
        }

        // Remove dead
        if(z.health<=0){
            zombies.splice(i,1);
            player.money += 10;
            player.score += 10;
        }
    });

    // Bosses
    bosses.forEach((b,i)=>{
        let dx = player.position.x - b.position.x;
        let dz = player.position.z - b.position.z;
        let dist = Math.sqrt(dx*dx + dz*dz);
        b.position.x += (dx/dist)*b.speed*deltaTime;
        b.position.z += (dz/dist)*b.speed*deltaTime;

        if(dist<2){
            player.health -= b.damage*deltaTime;
        }

        if(b.health<=0){
            bosses.splice(i,1);
            player.money += 100;
            player.score += 100;
            bossSpawned=false;
        }
    });
}

// ==========================
// UPDATE TEAMS (AI)
function updateTeammates(){
    teammates.forEach(tm=>{
        let dx = player.position.x - tm.position.x;
        let dz = player.position.z - tm.position.z;
        let dist = Math.sqrt(dx*dx + dz*dz);
        if(dist>3){
            tm.position.x += dx*deltaTime*2;
            tm.position.z += dz*deltaTime*2;
        }

        // Shoot nearest zombie
        if(tm.shootCooldown<=0 && zombies.length>0){
            let nearest = zombies.reduce((a,b)=> ((Math.hypot(b.position.x-tm.position.x,b.position.z-tm.position.z)) < (Math.hypot(a.position.x-tm.position.x,a.position.z-tm.position.z))?b:a));
            shootBullet(tm.position,{x:nearest.position.x-tm.position.x,y:0,z:nearest.position.z-tm.position.z}, weaponUpgrades.pistol.damage);
            tm.shootCooldown = 1;
        } else tm.shootCooldown -= deltaTime;
    });
}

// ==========================
// UPDATE BULLETS
function updateBullets(){
    bullets.forEach((b,i)=>{
        b.position.x += b.direction.x*10*deltaTime;
        b.position.y += b.direction.y*10*deltaTime;
        b.position.z += b.direction.z*10*deltaTime;

        // Check hit zombies
        zombies.forEach((z,j)=>{
            let dist = Math.sqrt((b.position.x-z.position.x)**2 + (b.position.z-z.position.z)**2);
            if(dist<1){
                z.health -= b.damage;
                bullets.splice(i,1);
            }
        });

        bosses.forEach((b,j)=>{
            let dist = Math.sqrt((b.position.x-b.position.x)**2 + (b.position.z-b.position.z)**2);
            if(dist<1){
                b.health -= b.damage;
                bullets.splice(i,1);
            }
        });
    });
}

// ==========================
// CHECK POWER-UPS
function checkPowerUps(){ collectPowerUps(); }

// ==========================
// ANIMATE LOOP
function animate(){
    deltaTime = clock.getDelta();
    movePlayer();
    updateZombies();
    updateTeammates();
    updateBullets();
    checkPowerUps();
    renderer.render(scene,camera);
    requestAnimationFrame(animate);
}
