import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 30000 * 2);
const renderer = new THREE.WebGLRenderer({ antialias: true });
const controls = new OrbitControls(camera, renderer.domElement);

const skyboxGeo = new THREE.BoxGeometry(10000, 10000, 10000);
let materialArray = []
let textureT = new THREE.TextureLoader().load('skybox/sun_ft.jpg')
let textureL = new THREE.TextureLoader().load('skybox/sun_bk.jpg')
let textureR = new THREE.TextureLoader().load('skybox/sun_up.jpg')
let textureB = new THREE.TextureLoader().load('skybox/sun_dn.jpg')
let textureF = new THREE.TextureLoader().load('skybox/sun_rt.jpg')
let textureBa = new THREE.TextureLoader().load('skybox/sun_lf.jpg')
materialArray.push(new THREE.MeshBasicMaterial({ map: textureT }))
materialArray.push(new THREE.MeshBasicMaterial({ map: textureL }))
materialArray.push(new THREE.MeshBasicMaterial({ map: textureR }))
materialArray.push(new THREE.MeshBasicMaterial({ map: textureB }))
materialArray.push(new THREE.MeshBasicMaterial({ map: textureF }))
materialArray.push(new THREE.MeshBasicMaterial({ map: textureBa }))

let skybox = new THREE.Mesh(skyboxGeo, materialArray)
for (let i = 0; i < 6; i++)
  materialArray[i].side = THREE.BackSide;

skybox.position.y = 1000
scene.add(skybox)

let slider1 = 0, slider2 = 0
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);
document.body.appendChild(renderer.domElement);

document.getElementById('range1').onchange = function (e) {
  slider1 = e.target.value
  Vwx = slider1
};

document.getElementById('range2').onchange = function (e) {
  slider2 = e.target.value
  Vwz = slider2

};

const light = new THREE.DirectionalLight(0xffffff, 1);
light.position.set(0, 1, 0);

let human, helicopter, parachute//variables for models
const loader = new GLTFLoader();

//loading models...
loader.load('./helicopterModel/scene.gltf', function (gltf) {
  helicopter = gltf.scene
  helicopter.scale.set(0.4, 0.4, 0.4)
  helicopter.position.y = 1.5
  helicopter.position.x = Xdistance
  helicopter.rotation.z = 0.2
  scene.add(helicopter);

});
let cjnumber = 0
let parachuteNumber = 0 
function jumb() {
  if (cjnumber == 0) {
    loader.load('./CjModel/scene.gltf', function (gltf) {
      human = gltf.scene
      human.position.x = helicopter?.position.x
      human.position.y = Height - 5
      human.position.z = 4
      human.rotation.x = 90
      scene.add(human);

    })
    cjnumber += 1;
  }
  else
    console.log('cjalreadyexist')

}
let opened = false
function pJumb() {
  if (human) {
    if(parachuteNumber == 0){
      loader.load(`./${parachute_type}parachute/scene.gltf`, function (gltf) { //if u want to change the parachute just change the word in url 'parachutee' with (parachute/secondParachute/parachutee) this are name of folders conatins models
        parachute = gltf.scene;
        opened = true;
        scene.add(parachute);
        parachuteNumber++;
      })
    }else{
      console.log("already opened");
    }

  }

}
//adding functions to jumb and open parachaut buttons 
document.getElementById("btn").addEventListener("click", jumb);

document.getElementById("pbtn").addEventListener("click", pJumb);
//asigning variables to the two boxes on the right



//ground
var groundGeometry = new THREE.PlaneGeometry(6000, 6000);
const groundtext = new THREE.TextureLoader().load('spot.jpg');
groundtext.colorSpace = THREE.SRGBColorSpace;
groundtext.magFilter = THREE.NearestFilter;
groundtext.wrapS = THREE.RepeatWrapping;
groundtext.wrapT = THREE.RepeatWrapping;
groundtext.repeat.set(1, 1);
const ground = new THREE.Mesh(groundGeometry, new THREE.MeshLambertMaterial({ map: groundtext, side: THREE.DoubleSide }));
scene.add(ground);
ground.position.y = 0;
ground.rotation.x = -Math.PI / 2;


scene.add(light);
camera.position.z = 5;

//handel resize
function onWindowResize() {

  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();

  renderer.setSize(window.innerWidth, window.innerHeight);
  animate()
}
window.addEventListener('resize', onWindowResize);
let deltaTime = 1 / 60;
let paraAnimation = 0;
function animate() {

  document.getElementById('slidervalue1').innerText = " X \n" + Vwx + "m/s"
  document.getElementById('slidervalue2').innerText = "Z \n" + Vwz + "m/s"

  if (helicopter) {
    helicopter.position.y = initHeight
    helicopter.position.x -= Vx * deltaTime;
    helicopter.position.z -= Vz * deltaTime;
    Zdistance = helicopter.position.z
    Xdistance = helicopter.position.x
  }


  if (human) {
    const offset = new THREE.Vector3(0, 0, 10);
    offset.applyQuaternion(camera.quaternion);
    camera.position.copy(human.position).add(offset);

    var modelPosition = new THREE.Vector3();
    human.getWorldPosition(modelPosition);

    // // Adjust the camera position and look-at target as desired
    // camera.position.set(modelPosition.x, modelPosition.y + 5, modelPosition.z + 10); //eiad edited here so the camera moves good
    // camera.lookAt(modelPosition);

    document.getElementById('1value').innerText =
      `Height :
    ${parseInt(Height)}  `;

    document.getElementById('2value').innerText =
      ` Velocity:
    Y : ${parseFloat(Vy).toFixed(4)} m/s 
    X : ${parseFloat(Vx).toFixed(4)} m/s
    Z : ${parseFloat(Vz).toFixed(4)} m/s`;


    document.getElementById('3value').innerText =
      ` Acceleration:
    Y : ${parseFloat(Ay).toFixed(4)} m/s 
    X : ${parseFloat(Ax).toFixed(4)} m/s
    Z : ${parseFloat(Az).toFixed(4)} m/s`;

    if (Height > 0 && !opened) {


      human.position.y = Height - 5
      human.position.x = Xdistance
      human.position.z = Zdistance


      T = TCalculate(Height);
      P = PCalculate(Height, T);

      rho = rhoCalculate(P, T);

      let FnetY = Fg(humanWeight + parachuteWeight, g) - FDrag(CdHuman, AHuman, rho, Vy)
      Ay = FnetY / (humanWeight + parachuteWeight);
      Vy += Ay * deltaTime;
      let hs = (Vy * deltaTime);
      Height -= hs;


      let FnetX = FWind(CdHuman, AHuman, rho, Vwx) - FDrag(CdHuman, AHuman, rho, Vx)
      Ax = FnetX / (humanWeight + parachuteWeight);
      Vx += Ax * deltaTime;
      let distX = Vx * deltaTime;
      Xdistance += distX;


      let Fnetz = FWind(CdHuman, AHuman, rho, Vwz) - FDrag(CdHuman, AHuman, rho, Vz)
      Az = Fnetz / (humanWeight + parachuteWeight);
      Vz += Az * deltaTime;
      let distz = Vz * deltaTime;
      Zdistance += distz;


      console.log(` 
    height: ${Height} m 
    Vertical Velocity: ${Vy} m/s 
    Temp: ${T} K 
    Pressure: ${P} Pa
    Acceleration: ${Ay} m/s^2
    DeltaTime : ${deltaTime}
    Fnet : ${FnetY}
    FG : ${Fg(humanWeight + parachuteWeight, g)}
    Fdrag : ${FDrag(Cd, A, rho, Vy)}
    rho : ${rho}
    Horizantal X Velocity : ${Vx}
    Xposition : ${Xdistance}
    Horizantal Z Velocity : ${Vz}
    Zposition : ${Zdistance}
    Az: ${Az}
    tense : ${Tens(humanWeight)}
    Vwz = : ${Vwz}
    Vwx = : ${Vwx}
    `
      )

    } else if (Height > 0 && opened) {
      if (Tens(humanWeight) > 1200) {
        opened = false
      }

      if (parachute_type === "round") {
        if(paraAnimation<3)
          paraAnimation+=0.09
        parachute.scale.set(paraAnimation, 3, paraAnimation)
      } else {
        if(paraAnimation<0.2)
          paraAnimation+=0.005
        parachute.scale.set(paraAnimation, 0.2, paraAnimation)
      }



      if (Vx < -15) { }
      human.position.y = Height
      human.position.x = Xdistance
      human.position.z = Zdistance

      if (parachute !== undefined) {
        parachute.position.x = human.position.x;

        if (parachute_type === "rect") {
          parachute.position.y = human.position.y + 1.75;
        } else {
          parachute.position.y = human.position.y - 4.2;
        }

        parachute.position.z = human.position.z - 3.2;
      }

      T = TCalculate(Height);
      P = PCalculate(Height, T);

      rho = rhoCalculate(P, T);

      let FnetY = Fg(humanWeight + parachuteWeight, g) - FDrag(Cd, A, rho, Vy)
      Ay = FnetY / (humanWeight + parachuteWeight);
      Vy += Ay * deltaTime;
      let hs = Vy * deltaTime;
      Height -= hs;


      let FnetX = FWind(Cd, A, rho, Vwx) - FDrag(Cd, A, rho, Vx)
      Ax = FnetX / (humanWeight + parachuteWeight);
      Vx += Ax * deltaTime;
      let distX = Vx * deltaTime;
      Xdistance += distX;

      let Fnetz = FWind(Cd, A, rho, Vwz) - FDrag(Cd, A, rho, Vz)
      Az = Fnetz / (humanWeight + parachuteWeight);
      Vz += Az * deltaTime;
      let distz = Vz * deltaTime;
      Zdistance += distz;



      console.log(` 
    height: ${Height} m 
    Vertical Velocity: ${Vy} m/s 
    Temp: ${T} K 
    Pressure: ${P} Pa
    Acceleration: ${Ay} m/s^2
    DeltaTime : ${deltaTime}
    Fnet : ${FnetY}
    FG : ${Fg(humanWeight + parachuteWeight, g)}
    Fdrag : ${FDrag(Cd, A, rho, Vy)}
    rho : ${rho}
    "A" : ${A}
    Horizantal Velocity : ${Vx}
    Xposition : ${Xdistance}
    Horizantal Z Velocity : ${Vz}
    Zposition : ${Zdistance}
    Az: ${Az}
    tense : ${Tens(humanWeight)}
    `)

      human.rotation.x = 0
    } else if (!opened) {
      human.position.y = -2.5;
      console.log(`human pos :${human.position.y}`)
      human.rotation.x = 90
    } else {
      human.position.y = 2;
      parachute.position.x = human.position.x;
      parachute.position.y = human.position.y + 3.5;
      parachute.position.z = human.position.z - 3.2;
    }

  } else {
    var modelPosition = new THREE.Vector3();
    helicopter.getWorldPosition(modelPosition);
    camera.position.set(modelPosition.x, modelPosition.y, modelPosition.z + 20);
    camera.lookAt(modelPosition);
  }
  requestAnimationFrame(animate);
  renderer.render(scene, camera);
  controls.update();

}


//physics

let humanWeight;  // وزن الانسان   
let parachuteWeight;  // وزن الباراشوت   
let initHeight;          // الأرتفاع الإبتدائي
let Height;          // الأرتفاع 

let L, W;  // طول و عرض المظلة 

const CdHuman = 1; // انسيابية جسم الإنسان

const P0 = 101.325;  // قيمة الضغط عند سطح البحر
const M = 0.0289644; // الكتلة المولية للهواء
const R = 8.31;  // ثابت الغازات العام
const T0 = 15;  // درجة الحرارة عند سطخ الارض بالسيليسويس 
const g = 9.82;         //ثابت الجاذبية الأرضية  
let parachute_type;

let A;       // مقطع السطح العرضي للباراشوت
const AHuman = 1.4; // مقطع سطح العرضي للانسان 
const Cd = 2; //انسيابية الباراشوت
const Ci = 1; // قوة الرفع 

let Ay  //التسارع على محور المحور العمودي
let Ax  // التسارع على المحور الأفقي
let Vwx = 0  // سرعة الرياح على المحور الأفقي
let Xdistance = 0;

let Az;   // التسارع على المحور الأفقي  
let Vwz = 0;  //سرعة الرياح على المحور الأفقي
let Zdistance = 0;

let Vz = 0;  //السرعة الإبتدائية على المحور الأفقي
let Vy = 0; //السرعة الإبتدائية على المحور العمودي
let Vx = 0; // السرعة الابتدائية على المحور الافقي
let rho, T, P; //درجة الحرارة و كثافة الهواء و الضغط الجوي 


let Te = 800;

const Fg = (m, g) => {
  return m * g;
}
const FDrag = (Cd, A, rho, V) => {
  if (V > 0)
    return 0.5 * Cd * A * rho * V ** 2;
  else
    return -0.5 * Cd * A * rho * V ** 2;
}

const FLift = (Ci, A, rho, V) => {
  return 0.5 * Ci * A * rho * V ** 2;
}

const PCalculate = (h, T) => {
  return P0 * Math.exp((-M * g * h) / (R * T));
}

const TCalculate = (h) => {
  const temp = T0 - 0.0065 * h;
  return temp + 273.15;
}

const Tens = (m) => {
  return m * g;
}

const rhoCalculate = (P, T) => {
  return (P * M) / (R * T) * 100;
}

const FWind = (Cd, A, rho, V) => {
  if (V > 0)
    return 0.5 * Cd * A * rho * V ** 2;
  else
    return -(0.5 * Cd * A * rho * V ** 2);
}

//when form button is clicked this function excutes
document.getElementById('form-btn').addEventListener('click', function (e) {
  e.preventDefault();

  humanWeight = parseInt(document.getElementById('hw').value)
  parachuteWeight = parseInt(document.getElementById('pw').value)
  initHeight = parseInt(document.getElementById('height').value)
  Height = initHeight
  L = parseInt(document.getElementById('pcl').value)
  W = parseInt(document.getElementById('pcw').value)
  Vx = parseInt(document.getElementById('vx0').value)
  Vz = parseInt(document.getElementById('vz0').value)

  const roundRadio = document.getElementById("round");
  const rectRadio = document.getElementById("rect");


  if (roundRadio.checked) {
    parachute_type = roundRadio.value
    A = Math.pow(L, 2) * Math.PI
  } else {
    parachute_type = rectRadio.value
    A = L * W;
  }





  helicopter.position.y = Height


  document.getElementById('1value').innerText =
    `Height :
  ${parseInt(Height)}  `;

  document.getElementById('2value').innerText =
    ` Velocity:
  Y : 0 m/s 
  X : 0 m/s
  Z : 0 m/s`;


  document.getElementById('3value').innerText =
    ` Acceleration:
  Y : 0 m/s 
  X : 0 m/s
  Z : 0 m/s`;


  document.getElementById("welpage").style.display = "none";
  animate()
})
const ambientLight = new THREE.AmbientLight(0xeeeeee);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 4);
directionalLight.position.set(1, 1, 0.5).normalize();
scene.add(directionalLight);
let previousMouseX = 0;
let previousMouseY = 0;

window.addEventListener('mousemove', (event) => {
  const mouseX = event.clientX;
  const mouseY = event.clientY;

  const deltaX = mouseX - previousMouseX;
  const deltaY = mouseY - previousMouseY;

  // Update camera position based on mouse movement
  camera.position.x += deltaX * 0.01;
  camera.position.y -= deltaY * 0.01;

  previousMouseX = mouseX;
  previousMouseY = mouseY;
});