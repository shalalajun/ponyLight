import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js';
import * as Stats from 'stats-js'


let container;
let camera;
let renderer;
let scene;

let controls;
let theModel;



let stats = new Stats();
stats.showPanel( 0 );
document.body.appendChild( stats.dom );


function init(){

    container = document.querySelector('#scene');
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0x000000);
   
    
    
    createCamera();
    createControls();
    glbLoad();
    createLight();
    createRenderer();

    renderer.setAnimationLoop( () => {
        stats.begin();
        //update();
        render();
        stats.end();
      } );

}


function glbLoad(){
    

    let loader = new GLTFLoader();
    let dracoLoader = new DRACOLoader();
    dracoLoader.setDecoderPath( '/examples/js/libs/draco/' );
    dracoLoader.setDecoderConfig({type: 'js'});
    loader.setDRACOLoader( dracoLoader );
   // dracoLoader.preload();
    loader.load("models/model.glb", function(gltf){
        theModel = gltf.scene;
      //  var newMaterial = new THREE.MeshStandardMaterial({map:texture});
        theModel.traverse((o) => {
            if (o.isMesh) { 
            //  o.material = newMaterial,
              o.position.y = -0.16;
              o.scale.set = 300;
             
            }
          });
        scene.add( theModel );
    
    },
        undefined, function ( error ) {
        console.error( error );
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
    camera.position.set(0,0,1);


}


function createLight(){

    const ambientLight = new THREE.HemisphereLight(
        0xffffff, 0xffffff, 1
      );
    
      scene.add( ambientLight );
  
}




function createRenderer(){

    renderer = new THREE.WebGL1Renderer({ antialias: true });
    renderer.setSize(container.clientWidth,container.clientHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    

    renderer.gammaFactor = 2.2;
    renderer.gammaOutput = true;
  
    
    container.appendChild(renderer.domElement);


}

// function update(){
  
// }

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

















