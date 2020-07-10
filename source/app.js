import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { SpriteMaterial } from 'three';


let container;
let camera;
let renderer;
let scene;
let mesh;
let controls;
let theModel;
const Model_Path = "https://s3-us-west-2.amazonaws.com/s.cdpn.io/1376484/chair.glb";
let activeOption = 'nike_ar';


const colors = [
    {
        texture: 'models/nike/nike_AR_BK1_BC.png',
        size: [2,2,2],
        shininess: 60
    },
    {
        texture: 'models/nike/nike_AR_BK2_BC.png',
        size: [3, 3, 3],
        shininess: 0
    },
    {
      texture: 'models/nike/nike_AR_WH_BC.png',
      size: [4, 4, 4],
      shininess: 0
    },
    {
      color: '0fe4dc'
    },
    {
      color: 'f11a5c'
    },
    {
      color: 'ffcc00'
    },

    {
        color: '438AAC'
    }  
    ]




function init(){

    container = document.querySelector('#scene');
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0xf1f1f1);
    scene.fog = new THREE.Fog(0xf1f1f1, 20, 100);
    
    
    createCamera();
    createControls();
    glbLoad();
    createLight();
    createMesh();
    createRenderer();

    renderer.setAnimationLoop( () => {

        update();
        render();
    
      } );

}


function glbLoad(){
    const textureLoader = new THREE.TextureLoader();
    const texture = textureLoader.load( 'models/nike/nike_AR_WH_BC.png' );
    const texture2 = textureLoader.load( 'models/nike/tag_a_BC.png' );
    texture.encoding = THREE.sRGBEncoding;
    texture.flipY = false;
    texture2.encoding = THREE.sRGBEncoding;
    texture2.flipY = false;


    const INITIAL_MTL = new THREE.MeshPhongMaterial({
      map:texture2
    });
    const INITIAL_MTL2 = new THREE.MeshPhongMaterial({
      map:texture
    });

    const INITIAL_MAP = [
        // {childID: "nike_logo", mtl: INITIAL_MTL},
        // {childID: "nike_button", mtl: INITIAL_MTL},
        // {childID: "nike_button2", mtl: INITIAL_MTL},
        // {childID: "shoelace_up", mtl: INITIAL_MTL},
        {childID: "nike_ar", mtl: INITIAL_MTL2},
        // {childID: "nike_tag_1", mtl: INITIAL_MTL},
        {childID: "nike_tag_2", mtl: INITIAL_MTL},
        // {childID: "nike_tag_3", mtl: INITIAL_MTL},
      ];

    let loader = new GLTFLoader();
    loader.load("models/nike/nikeTest.glb", function(gltf){
        theModel = gltf.scene;
        theModel.traverse((o) => {
            if (o.isMesh) { 
              o.position.y = -0.8;
              o.castShadow = true;
              o.receiveShadow = true;
            }
          });
      
        for (let object of INITIAL_MAP) {
            initColor(theModel, object.childID, object.mtl);
        }
        scene.add( theModel );
    
    }, undefined, function ( error ) {
        console.error( error );
    
    });

    const TRAY = document.getElementById('js-tray-slide');


    function buildColors(colors) {
  for (let [i, color] of colors.entries()) {
    let swatch = document.createElement('div');
    swatch.classList.add('tray__swatch');
    
    if (color.texture)
    {
      swatch.style.backgroundImage = "url(" + color.texture + ")";   
    } else
    {
      swatch.style.background = "#" + color.color;
    }

    swatch.setAttribute('data-key', i);
    TRAY.append(swatch);
  }
}
      
      buildColors(colors);
      
      // Swatches
      const swatches = document.querySelectorAll(".tray__swatch");
      
      for (const swatch of swatches) {
        swatch.addEventListener('click', selectSwatch);
      }
      

      const options = document.querySelectorAll(".option");

      for (const option of options) {
        option.addEventListener('click',selectOption);
      }
      
      function selectOption(e) {
        let option = e.target;
        activeOption = e.target.dataset.option;
        for (const otherOption of options) {
          otherOption.classList.remove('--is-active');
        }
        option.classList.add('--is-active');
      }

      function selectSwatch(e) {
        let color = colors[parseInt(e.target.dataset.key)];
        let new_mtl;
   
       if (color.texture) {
         
         let txt = new THREE.TextureLoader().load(color.texture);
         txt.flipY = false;
         txt.encoding = THREE.sRGBEncoding;
         //txt.repeat.set( color.size[0], color.size[1], color.size[2]);
         txt.wrapS = THREE.RepeatWrapping;
         txt.wrapT = THREE.RepeatWrapping;
         
         new_mtl = new THREE.MeshPhongMaterial( {
           map: txt,
           shininess: color.shininess ? color.shininess : 10
         });    
       } 
       else
       {
         new_mtl = new THREE.MeshPhongMaterial({
             color: parseInt('0x' + color.color),
             shininess: color.shininess ? color.shininess : 10
             
           });
       }
       
       setMaterial(theModel, activeOption, new_mtl);
   }
      
      function setMaterial(parent, type, mtl) {
        parent.traverse((o) => {
         if (o.isMesh && o.nameID != null) {
           if (o.nameID == type) {
                o.material = mtl;
             }
         }
       });
      }

}

function initColor(parent, type, mtl) {
  parent.traverse((o) => {
   if (o.isMesh) {
     if (o.name.includes(type)) {
          o.material = mtl;
          o.nameID = type; // Set a new property to identify this object
       }
   }
 });
}

function createControls(){
    controls = new OrbitControls( camera, container); 
}

function createCamera(){

    const fov = 35;
    const aspect = container.clientWidth / container.clientHeight;
    const near = 0.1;
    const far = 100;    
    
    camera = new THREE.PerspectiveCamera(fov,aspect,near,far);
    camera.position.set(0,0,10);


}


function createLight(){

    // var light = new THREE.AmbientLight( 0xffffff ); // soft white light
    // scene.add( light );

    const ambientLight = new THREE.HemisphereLight(
        0xffffff, 0xffffff, 0.61
      );
    
      scene.add( ambientLight );

      var dirLight = new THREE.DirectionalLight( 0xffffff, 1 );
      dirLight.position.set( -8, 12, 8 );
      dirLight.castShadow = true;
      dirLight.shadow.mapSize = new THREE.Vector2(1024, 1024);
  // Add directional Light to scene    
      scene.add( dirLight );
    
    // let light2 = new THREE.DirectionalLight(0xffffff, 1);
    // light2.position.set( -10, -10, 10 );
    // scene.add(light2);   
}


function createMesh(){
    let geometry = new THREE.BoxBufferGeometry(2,2,2);
    let textureLoader = new THREE.TextureLoader();
    let texture = textureLoader.load('textures/dami.png');
    texture.encoding = THREE.sRGBEncoding;
    texture.anisotropy = 16;

    let material = new THREE.MeshBasicMaterial({ map: texture });
   
    mesh = new THREE.Mesh(geometry,material);


    //scene.add(mesh);
}


function createRenderer(){

    renderer = new THREE.WebGL1Renderer({ antialias: true });
    renderer.setSize(container.clientWidth,container.clientHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    

    renderer.gammaFactor = 2.2;
    renderer.gammaOutput = true;
    renderer.physicallyCorrectLights = true;
    
    container.appendChild(renderer.domElement);


}

function update(){
    mesh.rotation.z += 0.01;
    mesh.rotation.x += 0.01;
    mesh.rotation.y += 0.01;
}

function render(){
    renderer.render(scene,camera);
}


function onWindowResize() {

    // set the aspect ratio to match the new browser window aspect ratio
    camera.aspect = container.clientWidth / container.clientHeight;
  
    // update the camera's frustum
    camera.updateProjectionMatrix();
  
    // update the size of the renderer AND the canvas
    renderer.setSize( container.clientWidth, container.clientHeight );
  
  }
  
  window.addEventListener( 'resize', onWindowResize );
  

init();

















