// ui.js
const fpsCounter = document.getElementById("fpsCounter");
let showFPS = true, lastTime = performance.now(), frame=0, fps=0;

function drawHUD(){
  frame++;
  const now = performance.now();
  if(now-lastTime>=1000){ fps=frame; frame=0; lastTime=now; }
  fpsCounter.innerText=`FPS: ${showFPS?fps:''}\nHealth: ${player.health}\nMoney: $${money}\nScore: ${score}\nWave: ${waveNumber}`;
}

// Settings UI
document.getElementById("openSettingsBtn").onclick = ()=>{ document.getElementById("settingsUI").style.display="flex"; }
document.getElementById("closeSettingsBtn").onclick = ()=>{ document.getElementById("settingsUI").style.display="none"; }
document.getElementById("fpsToggle").onchange = e=>{ showFPS=e.target.checked; }

// Shop UI
document.getElementById("openShopBtn").onclick = ()=>{ document.getElementById("shopUI").style.display="flex"; }
document.getElementById("closeShopBtn").onclick = ()=>{ document.getElementById("shopUI").style.display="none"; }
document.getElementById("buyTeammateBtn").onclick = ()=>{
  if(money>=100){
    money-=100;
    const geom = new THREE.BoxGeometry(1.5,1.5,1.5);
    const mat = new THREE.MeshStandardMaterial({color:0x0ff});
    const tm = new THREE.Mesh(geom, mat);
    tm.position.copy(player.position);
    tm.bullets=[];
    tm.shootCooldown=0;
    scene.add(tm);
    teammates.push(tm);
  }
};

// Start Game
document.getElementById("startGameBtn").onclick = ()=>{
  player.material.color.set(document.getElementById("avatarColor").value);
  document.getElementById("menu").style.display="none";
  animate3D();
}

// Update HUD every frame
setInterval(drawHUD,50);
