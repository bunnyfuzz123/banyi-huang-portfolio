import * as THREE from "three";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";

const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();

const audio = new Audio('assets/audio/dragon-studio-scary-scream-401725.mp3')

const overviewCameraTargets = [
    new THREE.Vector3(0, 0, 7),
    new THREE.Vector3(-1, 1, 5),
    new THREE.Vector3(3, 0, 3),
    new THREE.Vector3(0, -1, 6),
];
let currentOverviewIndex = 0;
const cameraTarget = overviewCameraTargets[0].clone();
const lookTarget = new THREE.Vector3(0, 0, 0);

let baseCameraTarget = new THREE.Vector3();
let baseLookTarget = new THREE.Vector3();

let insideProject = false;

const overlay = document.getElementById("project-overlay");

const loader1 = new GLTFLoader();
const loader2 = new GLTFLoader();
const loader3 = new GLTFLoader();
const loader4 = new GLTFLoader();

const ambientLight = new THREE.AmbientLight(0xffffff, 1);
const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
directionalLight.position.set(5, 5, 5);

let scrollAmount = 0;
let scaleValue = 1; 
let scrollThreshold = 3000; 
let beatTwoEntered = false;
let beatThreeEntered = false 
let hasEnteredProject = false;

let mouseX = 0;
let mouseY = 0;

let selectedObject = null;

let scene;
let camera;
let renderer;

let projectA;
let projectB;
let projectC;
let projectD;

let smallProjectA;
let smallProjectB;
let smallProjectC;

let projects = [];

let hoveredObject = null;

window.addEventListener("wheel", handleWheel);

window.addEventListener("mousemove", function(event) {
    mouseX = (event.clientX / this.window.innerWidth - 0.5)*2;
    mouseY = (event.clientY / this.window.innerHeight - 0.5)*2;

    mouse.x =  mouseX;
    mouse.y = -mouseY;
})

//Beat-one: scroll to get close 
function handleWheel(event) {
    scrollAmount += event.deltaY;

    scaleValue = 1 + scrollAmount * 0.003;
    scaleValue = Math.max(0.8, Math.min(scaleValue, 8))+1;

    document.getElementById("beat-one").style.transform = `scale(${scaleValue})`;

    if (scrollAmount >= scrollThreshold && !beatTwoEntered) {
        beatTwoEntered = true;
        
        document.getElementById("beat-one").style.display = "none";
        document.getElementById("beat-two").style.display = "block";
        
        enterBeatTwo();
        };
};


//Build 3D environment and start it running 
function enterBeatTwo() {

    scene = new THREE.Scene();
    const axesHelper = new THREE.AxesHelper(5);
    camera = new THREE.PerspectiveCamera(
        75,
        window.innerWidth / window.innerHeight,
        0.1,
        1000
    );

    scene.add(ambientLight);
    scene.add(directionalLight);

    renderer = new THREE.WebGLRenderer();
    renderer.setClearColor(0xffffff);

    renderer.setSize(window.innerWidth, window.innerHeight);

    document
        .getElementById("beat-two")
        .appendChild(renderer.domElement);

    const geometry1 = new THREE.BoxGeometry(1, 1, 1);
    const geometry2 = new THREE.BoxGeometry(1, 1, 1);
    const geometry3 = new THREE.BoxGeometry(1, 1, 1);
    const geometry4 = new THREE.BoxGeometry(1, 1, 1);
    const geometry5 = new THREE.SphereGeometry(1, 1, 1);
    const geometry6 = new THREE.SphereGeometry(.5, .5, .5);
    const geometry7 = new THREE.SphereGeometry(1, 1, 1);


    const material1 = new THREE.MeshBasicMaterial({
        color: 0x000000,
        wireframe: true
    })

    const material2 = new THREE.MeshBasicMaterial({
        color: 0x8A2BE2,
        wireframe: true
    })
    
    loader1.load("assets/models/mazu_for3jsWebsite.glb", (gltf) =>{
        projectA = gltf.scene;
        projectA.position.set(-3, -4, 1);
        projectA.scale.set(2, 2, 2);
        scene.add(projectA);
        projects.push(projectA);
    })

    loader2.load("assets/models/TriadicMerge_forThreeJSPortfolio_centered_optimized.glb", (gltf) =>{
        projectB = gltf.scene;
        projectB.position.set(8, 1, -2);
        projectB.scale.set(6, 6, 6);
        scene.add(projectB);
        projects.push(projectB);
    })

    loader3.load("assets/models/Sibuxiang_forThreeJSPortfolio.glb", (gltf) =>{
        projectC = gltf.scene;
        projectC.position.set(8, -2, 1);
        projectC.scale.set(2, 2, 2);
        projectC.scale.set(.1, .1, .1);
        scene.add(projectC);
        projects.push(projectC);
    })

     loader4.load("assets/models/changE_dildo_ThreeJS.glb", (gltf) =>{
        projectD = gltf.scene;
        projectD.position.set(-1, 2, -5);
        // projectD.scale.set(.1, .1, .1);
        scene.add(projectD);
        projects.push(projectD);
    })

    smallProjectA = new THREE.Mesh(geometry5, material2.clone());
    smallProjectB = new THREE.Mesh(geometry6, material2.clone());
    smallProjectC = new THREE.Mesh(geometry7, material2.clone());

    projects = [
        smallProjectA,
        smallProjectB,
        smallProjectC
    ];

  
    // projectB.position.set(2, 0, -3);
    // projectC.position.set(3, -2, 1);
    // projectD.position.set(0, 1, 4);

    smallProjectA.position.set(3, 5, -1);
    smallProjectB.position.set(-4, 2, 0);
    smallProjectC.position.set(-4, 0, 3);

    smallProjectA.visible = false;
    smallProjectB.visible = false;
    smallProjectC.visible = false;

    scene.add(smallProjectA);
    scene.add(smallProjectB);
    scene.add(smallProjectC);

    // scene.add(axesHelper);

    camera.position.copy(cameraTarget);

    currentOverviewIndex ++;

    cameraTarget.copy(overviewCameraTargets[currentOverviewIndex]);


    window.addEventListener("click", function() {
        if (beatTwoEntered) {
            handleBeatTwoClick();
        }
    });  
    
    window.addEventListener("wheel", function() {
        if (beatTwoEntered) {

            handleBeatTwoScroll();
        } 
    })
    
    animateBeatTwo();

}


 function handleBeatTwoClick() {
        raycaster.setFromCamera(mouse, camera);

        const intersects = raycaster.intersectObjects(projects, true);

        if (intersects.length === 0) return;
        
        // const object = intersects[0].object;

        const hitObject = intersects[0].object;
        const project = getProjectRoot(hitObject);

        if (selectedObject === null) {
            approachProject(project);
            } else if (selectedObject === project) {
                enterProject(project);
            } else {
                approachProject(project);
            }

    }

    function handleBeatTwoScroll() {
         selectedObject = null;
         insideProject = false;

         overlay.classList.remove("visible");
         currentOverviewIndex++;

         if (currentOverviewIndex >= overviewCameraTargets.length) {
            currentOverviewIndex = 0;
         }

         cameraTarget.copy(overviewCameraTargets[currentOverviewIndex]);

         lookTarget.set(0, 0, 0);

         if (hasEnteredProject && !beatThreeEntered) {
            enterBeatThree();
            beatThreeEntered = true;
         };

    }


     function animateBeatTwo() {
        requestAnimationFrame(animateBeatTwo);
        if (projectA) {
            // projectA.rotation.x += 0.0002;
            projectA.rotation.y += 0.0001;
        }
     
        if (projectB) {
             projectB.position.x += 0.0001;
            projectB.rotation.y += 0.0003;
        }

        if (projectC) {
            projectC.rotation.y -= 0.0001;
        }

        if (projectD) {
            projectD.rotation.y += 0.0005;
        }

        raycaster.setFromCamera(mouse, camera);
        const intersects = raycaster.intersectObjects(projects, true);
      
        if (hoveredObject) {
            hoveredObject.material.wireframe = false;
            hoveredObject = null;
        }

        if (intersects.length >0 && !insideProject) {
            document.body.style.cursor = "pointer";
            hoveredObject = intersects[0].object;
            hoveredObject.material.wireframe = true;

        } else {
            document.body.style.cursor = "default";
        }

        if (selectedObject && !insideProject) {
            const orbitStrength = 1;

            cameraTarget.set(
                baseCameraTarget.x + mouse.x * orbitStrength,

                baseCameraTarget.y + mouse.y * orbitStrength,

                baseCameraTarget.z 
            );

            lookTarget.copy(baseLookTarget);
        }

        camera.position.lerp(cameraTarget, 0.004);

        camera.lookAt(lookTarget);
        // camera.lookAt(0, 0, 0);

        renderer.render(scene, camera);
    }

    function approachProject(project) {
        selectedObject = project;

        const box = new THREE.Box3().setFromObject(project);
        const center = box.getCenter(new THREE.Vector3());
        const size = box.getSize(new THREE.Vector3());

        const maxSize = Math.max(size.x, size.y, size.z);

        const fov = camera.fov * (Math.PI / 180);

        const distance = (maxSize / 2) / Math.tan(fov / 2)* 1.2;

        const radius = 1;

        const horizontalAngle = mouse.x * 0.8;
        const verticalAngle = mouse.y * 0.5;

        baseCameraTarget.set(
            center.x,
            center.y,
            center.z + distance
        );

        baseLookTarget.copy(center);    
        cameraTarget.copy(baseCameraTarget);
        lookTarget.copy(baseLookTarget);
    }

    function enterProject(object) {
        insideProject = true;

        setProjectWireframe(object, false);

        hoveredObject = null;


        const box = new THREE.Box3().setFromObject(object);
        const center = box.getCenter(new THREE.Vector3());
        center.set(
            center.x,
            center.y,
            center.z  
        );
        cameraTarget.copy(center);
        lookTarget.copy(center);

        console.log("project entered into");
        console.log("entering project", object);
        // audio.play();
        overlay.classList.add("visible");
        document.body.style.cursor = "default";

        hasEnteredProject = true;  
    }


    function enterBeatThree() {
        smallProjectA.visible = true;
         smallProjectB.visible = true;
         smallProjectC.visible = true;
    }

    function getProjectRoot(object) {
        let current = object;

        while (current.parent && current.parent !== scene) {
            current = current.parent;
        }
        return current;
        console.log(current);
    }

    function setProjectWireframe(project, enabled) {
        project.traverse((child) => {
          if (child.isMesh && child.material) {
            child.material.wireframe = enabled;
          }  
        })
    }