import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js';
import { SpriteMaterial } from 'three';
import * as Stats from 'stats-js'


let container;
let camera;
let renderer;
let scene;
let mesh;
let controls;
let theModel;
const Model_Path = "https://s3-us-west-2.amazonaws.com/s.cdpn.io/1376484/chair.glb";
let activeOption = 'nike_ar';


let stats = new Stats();
stats.showPanel( 0 );
document.body.appendChild( stats.dom );







function init(){

    container = document.querySelector('#scene');
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0x000000);
    //scene.fog = new THREE.Fog(0xf1f1f1, 20, 100);
    
    
    createCamera();
    createControls();
    glbLoad();
    createLight();
    createRenderer();

    renderer.setAnimationLoop( () => {
        stats.begin();
        update();
        render();
        stats.end();
    
      } );

}


function glbLoad(){
    // const textureLoader = new THREE.TextureLoader();
    // const texture = textureLoader.load( 'models/ponytexture.png' );
    
    // texture.encoding = THREE.sRGBEncoding;
    // texture.flipY = false;
   

    let loader = new GLTFLoader();
    let dracoLoader = new DRACOLoader();
    dracoLoader.setDecoderPath( '/examples/js/libs/draco/' );
    loader.setDRACOLoader( dracoLoader );
    loader.load("models/model.glb", function(gltf){
        theModel = gltf.scene;
      //  var newMaterial = new THREE.MeshStandardMaterial({map:texture});
        theModel.traverse((o) => {
            if (o.isMesh) { 
            //  o.material = newMaterial,
              o.position.y = -0.16;
              o.scale.set = 300;
              // o.castShadow = true;
              // o.receiveShadow = true;
            }
          });
        scene.add( theModel );
    
    }, undefined, function ( error ) {
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

      var dirLight = new THREE.DirectionalLight( 0xffffff, 0 );
      dirLight.position.set( -8, 12, 8 );
    
      scene.add( dirLight );
  
}




function createRenderer(){

    renderer = new THREE.WebGL1Renderer({ antialias: true });
    renderer.setSize(container.clientWidth,container.clientHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    

    renderer.gammaFactor = 2.2;
    renderer.gammaOutput = true;
    // renderer.physicallyCorrectLights = true;
    
    container.appendChild(renderer.domElement);


}

function update(){
  
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

















