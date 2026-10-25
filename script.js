import * as THREE from "three";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import { HDRLoader } from 'three/addons/loaders/HDRLoader.js';
import { RGBELoader } from 'three/addons/loaders/RGBELoader.js';
import { BokehPass } from 'three/addons/postprocessing/BokehPass.js';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from "three/addons/postprocessing/RenderPass.js";
import { UnrealBloomPass } from "three/addons/postprocessing/UnrealBloomPass.js";
import { displayProject } from "./project-display.js";
import { WebGLRenderer, ACESFilmicToneMapping } from 'three';


const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();

const audio = new Audio('assets/audio/dragon-studio-scary-scream-401725.mp3')

const overviewCameraTargets = [
    new THREE.Vector3(0, 0, 0),
    new THREE.Vector3(-1, 1, 5),
    new THREE.Vector3(3, 0, 3),
    new THREE.Vector3(4, -3, 1),
    new THREE.Vector3(0, -1, 6),
    new THREE.Vector3(11, -10, 6),
];

let currentOverviewIndex = 0;
const cameraTarget = overviewCameraTargets[0].clone();
const lookTarget = new THREE.Vector3(0, 0, 0);

let baseCameraTarget = new THREE.Vector3();
let baseLookTarget = new THREE.Vector3();

let insideProject = false;

const projectOverlay = document.getElementById("project-overlay");
const aboutOverlay = document.getElementById("about-overlay");
const loadingManager = new THREE.LoadingManager();



const loader1 = new GLTFLoader(loadingManager);
const loader2 = new GLTFLoader(loadingManager);
const loader3 = new GLTFLoader(loadingManager);
const loader4 = new GLTFLoader(loadingManager);
const loader5 = new GLTFLoader(loadingManager);
const loader6 = new GLTFLoader(loadingManager);
const loader7 = new GLTFLoader(loadingManager);
const loader8 = new GLTFLoader(loadingManager);
const loader9 = new GLTFLoader(loadingManager);


let assetsLoaded = false;
let scalingFinished = false;

loadingManager.onLoad = function () {
    assetsLoaded = true;
    // scaleValue = 1;
    // // scaleBeatOne();
}

let scrollAmount = 0;
let scaleValue = 1; 
let scrollThreshold = 500; 
let beatTwoEntered = false;
let beatThreeEntered = false 
let hasEnteredProject = false;
let hasEnteredAbout = false;

let mouseX = 0;
let mouseY = 0;

let selectedObject = null;

let scene;
let camera;
let renderer;
let composer;

let projectA;
let projectB;
let projectC;
let projectD;

let projectE;
let projectF;
let projectG;
let projectH;
let projectI;

let aboutMe;

let exhibitionsLibrary = {};
let talksLibrary = {};

const vertices = [
   30,   8,  15,
   -14,  -2,   2,
    -2,   4, -20,
    18, -10,  -3
];  

const indices = [
   2, 1, 0,
    0, 3, 2,
    1, 3, 0,
    2, 3, 1
];

let projects = [];

let hoveredObject = null;

let projectLibrary = {};
let currentProject = null;
let aboutLibrary = {};


async function loadProjects() {
    const response = await fetch("projects.json");
    projectLibrary = await response.json();


};

async function loadAbout() {
    const response = await fetch("about.json");
    aboutLibrary = await response.json();
}

function displayExhibitions(container, exhibitions) {
    exhibitions.forEach(exhibition => {
        // your existing construction code
    });
}

async function loadExhibitions() {
    const response = await fetch("exhibitions.json");
    exhibitionsLibrary = await response.json();
}

async function loadTalks() {
    const response = await fetch("talks.json");
    talksLibrary = await response.json();
}

async function init() {
    await loadProjects();
    await loadAbout();
    await loadExhibitions();
    await loadTalks();
    enterBeatTwo();
}

init();



//Build 3D environment and start it running 
function enterBeatTwo() {
    
    beatTwoEntered = true;
    document.getElementById("beat-two").style.display = "block";

    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(
        65,
        window.innerWidth / window.innerHeight,
        0.1,
        100
    );

     new RGBELoader().load('assets/textures/shanghai_bund_4k.hdr', function(texture) {
   
        texture.mapping = THREE.EquirectangularReflectionMapping;
        scene.environment = texture;
    })
    
    renderer = new THREE.WebGLRenderer({alpha: true, antialias: true});
    renderer.setClearColor(0xffffff);

    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.toneMapping = ACESFilmicToneMapping;
    renderer.toneMappingExposure = 0.1; 

    document
        .getElementById("beat-two")
        .appendChild(renderer.domElement);


    composer = new EffectComposer(renderer);

    const renderPass = new RenderPass(scene, camera);
    composer.addPass(renderPass);


    const resolution = new THREE.Vector2(window.innerWidth, window.innerHeight);
    const bloomPass = new UnrealBloomPass(resolution, 0.2, 0.45, 1);

    composer.addPass(bloomPass);


    //animating aboutMe icon
    let detail = 0;
    let direction = 1;

    setInterval(() => {
        detail += direction; 

        if (detail === 8) {
            direction = -1;
        }

        if (detail === 0) {
            direction = 1;
        }
        setAboutMeDetail(detail);
    }, 350);

    const material2 = new THREE.MeshStandardMaterial({
        color: 0xFFFDD0,
        roughness: 0.45,
        metalness: 0.2,
        wireframe: true
    })


    const aboutGeometry = new THREE.PolyhedronGeometry(
        vertices,
        indices,
        0.2,
        detail
    );

    aboutMe = new THREE.Mesh(
        aboutGeometry,
        material2
    );
    
    aboutMe.position.set(5, -8, -10);
    scene.add(aboutMe);
    projects.push(aboutMe);
    aboutMe.userData.aboutId = "about";


    loader1.load("assets/models/mazu_for3jsWebsite_alternative.glb", (gltf) =>{
        projectA = gltf.scene;
        projectA.position.set(-10, -5, -2);
        projectA.scale.set(5, 5, 5);
        projectA.rotation.y = 0.8;
        scene.add(projectA);
        projects.push(projectA);
        projectA.userData.projectId = "remazu";
        
       const projectData = projectLibrary[projectA.userData.projectId];
        createSpatialLabel(projectA, projectData);
        
    })

    loader2.load("assets/models/TriadicMerge_forThreeJSPortfolio_centered_optimized.glb", (gltf) =>{
        projectB = gltf.scene;
        projectB.position.set(8, 10, -2);
        projectB.scale.set(20, 20, 20);
        projectB.rotation.y = -1.5;
        scene.add(projectB);
        projects.push(projectB);
        projectB.userData.projectId = "triadic-patterning";
        const projectData = projectLibrary[projectB.userData.projectId];
        createSpatialLabel(projectB, projectData);
    })

    loader3.load("assets/models/Sibuxiang_forThreeJSPortfolio.glb", (gltf) =>{
        projectC = gltf.scene;
        projectC.position.set(8, -4, 5);
        projectC.scale.set(.3, .3, .3);
        projectC.rotation.y = 2.1;
        scene.add(projectC);
        projects.push(projectC);
        projectC.userData.projectId = "sibuxiang";
        const projectData = projectLibrary[projectC.userData.projectId];
        createSpatialLabel(projectC, projectData);
    })

     loader4.load("assets/models/changE_dildo_ThreeJS.glb", (gltf) =>{
        projectD = gltf.scene;
        projectD.position.set(-3, 0, -15);
        projectD.scale.set(3, 3, 3);
        projectD.rotation.y = -0.75;
        scene.add(projectD);
        projects.push(projectD);
        projectD.userData.projectId = "dong";
        const projectData = projectLibrary[projectD.userData.projectId];
        createSpatialLabel(projectD, projectData);
    })

    loader5.load("assets/models/xeroxStack_threeJSPortfolio.glb", (gltf) =>{
        projectE = gltf.scene;
        projectE.position.set(6, -3, -12);
        projectE.scale.set(1.4, 1.4, 1.4);
        projectE.rotation.y = 1.8;
        scene.add(projectE);
        projects.push(projectE);
        projectE.userData.projectId = "xerox";
        projectE.visible = false;
        const projectData = projectLibrary[projectE.userData.projectId];
        createSpatialLabel(projectE, projectData);

    })

      loader6.load("assets/models/jojoduck_threeJS.glb", (gltf) =>{
        projectF = gltf.scene;
        projectF.position.set(30,20, -50);
        projectF.scale.set(2, 2, 2);
        scene.add(projectF);
        projects.push(projectF);
        // projectF.material.wireframe = true;
        projectF.userData.projectId = "lunar-calendar";
        projectF.visible = false;
        const projectData = projectLibrary[projectF.userData.projectId];
        createSpatialLabel(projectF, projectData);
    })

     loader7.load("assets/models/constellation_threeJS.glb", (gltf) =>{ 
        projectG = gltf.scene;
        projectG.position.set(-45, 12, -6);
        projectG.scale.set(10, 10, 10);
        scene.add(projectG);
        projects.push(projectG);
        projectG.userData.projectId = "constellation";
        // projectE.material.wireframe = true;
        projectG.visible = false;
        const projectData = projectLibrary[projectG.userData.projectId];
        createSpatialLabel(projectG, projectData);
    })

    loader8.load("assets/models/hk_threeJS.glb", (gltf) =>{
        projectH = gltf.scene;
        projectH.position.set(-20, -16, -8);
        projectH.scale.set(1, 1, 1);
        projectH.rotation.y = -3;
        scene.add(projectH);
        projects.push(projectH);
        projectH.userData.projectId = "amorous-polymers";
        projectH.visible = false;
        const projectData = projectLibrary[projectH.userData.projectId];
        createSpatialLabel(projectH, projectData);

    })

    loader9.load("assets/models/nekoBot.glb", (gltf) =>{
        projectI = gltf.scene;
        projectI.position.set(35, -20, 28);
        projectI.scale.set(2, 2, 2);
        projectI.rotation.y = -5.9;
        scene.add(projectI);
        projects.push(projectI);
        projectI.userData.projectId = "grand-street";
        // projectE.material.wireframe = true;
        projectI.visible = false;
        const projectData = projectLibrary[projectI.userData.projectId];
        createSpatialLabel(projectI, projectData);
    })
  

    camera.position.copy(cameraTarget);

    currentOverviewIndex ++;

    cameraTarget.copy(overviewCameraTargets[currentOverviewIndex]);

    window.addEventListener("mousemove", function(event) {
        mouseX = (event.clientX / this.window.innerWidth - 0.5) * 2;
        mouseY = (event.clientY / this.window.innerHeight - 0.5) * 2;

        mouse.x = mouseX;
        mouse.y = -mouseY;
    });

    window.addEventListener("click", function(event) {
        
        if (!beatTwoEntered) return;

        if (insideProject) {
            if (!projectOverlay.contains(event.target) && !aboutOverlay.contains(event.target)) {
                exitProject();
            }
            return;
        }

        handleBeatTwoClick();
    });  
    
    window.addEventListener("wheel", function() {
        if (beatTwoEntered && !insideProject) {

            handleBeatTwoScroll();
        } 
    })
    
    animateBeatTwo();

}


 function handleBeatTwoClick() {
        raycaster.setFromCamera(mouse, camera);

        const intersects = raycaster.intersectObjects(projects, true);

        if (intersects.length === 0) return;

        const hitObject = intersects[0].object;
        const object = getProjectRoot(hitObject);

        
        if (selectedObject === null) {
            approachProject(object, hitObject);
            } else if (selectedObject === object) {
                 if (object === aboutMe) {
                    enterAbout(object);
                 } else {
                enterProject(object, hitObject);
            } 
            
            } else {
                approachProject(object);
            }
    }

    function handleBeatTwoScroll() {

        if (selectedObject?.userData.projectId) {
            const label = document.getElementById(
                `${selectedObject.userData.projectId}-spatial-label`
            );

            if (label) {
                label.style.display = "none";
            }
        }
         selectedObject = null;
         insideProject = false;

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

    function updateSpatialLabel(project, labelId) {
        if (!project) return;

        const label= document.getElementById(labelId);


        if (!label) {
            return;
        }

        const box = new THREE.Box3().setFromObject(project);
        const position = box.getCenter(new THREE.Vector3());
        position.project(camera);

        const x = (position.x * 0.5 + 0.5) *window.innerWidth;
        const y = (-position.y * 0.5 + 0.5)* window.innerHeight;

        label.style.transform = `translate(${x}px, ${y}px)`;
    }


    function createSpatialLabel(project, projectData) {
         console.log("INSIDE CREATE SPATIAL LABEL");
        const label = document.createElement("div");

        label.id = `${project.userData.projectId}-spatial-label`;
        label.classList.add("spatial-label");

        const title = document.createElement("div");
        title.classList.add("title");
        title.textContent = projectData.title;

        const meta = document.createElement("div");
        meta.classList.add("meta");
        meta.textContent = projectData.type.join(", ");
        label.append(title, meta);

        const beatTwo = document.getElementById("beat-two");
        document.body.insertBefore(label, beatTwo);

        return label.id;
        }

     function animateBeatTwo() {
        requestAnimationFrame(animateBeatTwo);

        const time1 = performance.now() * 0.001;
        renderer.toneMappingExposure = 
            0.55 + Math.sin(time1* 0.05) * 0.45;

        composer.render();

        if (projectA) {
            projectA.rotation.y += 0.0001;
        }
     
        if (projectB) {
            projectB.rotation.y += 0.003;
        }

        if (projectC) {
            projectC.rotation.y -= 0.0001;
        }

        if (projectD) {
            projectD.rotation.y += 0.005;
        }

        if (projectE) {
            projectE.rotation.y += 0.004;
            projectE.rotation.z += 0.004;
            projectE.rotation.x += 0.004;

      
        }

          if (projectF) {
            // projectG.rotation.x += 0.001;
            projectG.rotation.y += 0.0002;
        }

        if (projectG) {
            // projectG.rotation.x += 0.001;
            projectG.rotation.z += 0.0001;
        }

         if (projectH) {
            projectH.rotation.z += 0.0002;
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
            const orbitStrength = 8;

            cameraTarget.set(
                baseCameraTarget.x + mouse.x * orbitStrength,

                baseCameraTarget.y + mouse.y * orbitStrength,

                baseCameraTarget.z 
            );

            lookTarget.copy(baseLookTarget);
        }

        camera.position.lerp(cameraTarget, 0.01);

        camera.lookAt(lookTarget);
        projects.forEach(project => {
        const projectId = project.userData.projectId;

        if (projectId && project.visible) {
                updateSpatialLabel(
                    project,
                    `${projectId}-spatial-label`
                );
            }
        });

        const time = performance.now() * 0.0006;

        aboutMe.scale.y = 0.5 + Math.sin(time) * 0.3;
        aboutMe.scale.x = 0.5 + Math.cos(time) * 0.25;
        aboutMe.scale.z = 0.5 + Math.cos(time) * 0.15;
    }

    function approachProject(project, hitObject) {

        // Hide the previously selected project's label
        if (selectedObject?.userData.projectId) {
            const previousLabel = document.getElementById(
                `${selectedObject.userData.projectId}-spatial-label`
            );

            if (previousLabel) {
                previousLabel.style.display = "none";
            }
        }

        // Select the new project
        selectedObject = project;

        // Show the new project's label
      
        const label = document.getElementById(
        `${project.userData.projectId}-spatial-label`
        );

        if (label) {
            label.style.display = "block";
        }

        const box = new THREE.Box3().setFromObject(hitObject);
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

    function enterProject(object, hitObject) {
        insideProject = true;

        const label = document.getElementById(
        `${object.userData.projectId}-spatial-label`
        );

        if (label) {
            label.style.display = "none";
        }

        setProjectWireframe(object, false);

        hoveredObject = null;


        const box = new THREE.Box3().setFromObject(hitObject);
        const center = box.getCenter(new THREE.Vector3());
        center.set(
            center.x,
            center.y,
            center.z  
        );
        cameraTarget.copy(center);
        camera.position.lerp(cameraTarget, 0.01);

        lookTarget.copy(center);

        console.log("project entered into");
        console.log("entering project", object);
        projectOverlay.classList.add("visible");
        document.body.style.cursor = "default";

        hasEnteredProject = true;  

        const projectId = object.userData.projectId;

        displayProject(projectId, projectLibrary);

    }

   

    function exitProject() {
        insideProject = false;
        selectedObject = null;

        projectOverlay.classList.remove("visible");
        aboutOverlay.classList.remove("visible");

        document.body.style.cursor = "default";
    }
    
    function enterBeatThree() {
        projectE.visible = true;
        projectF.visible = true;
        projectG.visible = true;
        projectH.visible = true;
        projectI.visible = true;

      
    }

    function getProjectRoot(object) {
        let current = object;
        // let currentProjectRoot;

        while (current.parent && current.parent !== scene) {
            current = current.parent;
        }
        return current;
   
       
    }

    
    function setProjectWireframe(project, enabled) {
        project.traverse((child) => {
          if (child.isMesh && child.material) {
            child.material.wireframe = enabled;
          }  
        })
    }

    function setAboutMeDetail(newDetail) {
        aboutMe.geometry.dispose();
       
         aboutMe.geometry = new THREE.PolyhedronGeometry(
        vertices,
        indices,
        0.8,
        newDetail
    );
    }

    function enterAbout(object) {
       
        insideProject = true;

        aboutOverlay.classList.add("visible");

        document.body.style.cursor = "default";
       
        
        const aboutId = aboutMe.userData.aboutId;
        const aboutData = aboutLibrary;

        document.getElementById("about-title").textContent = aboutData.title;
        document.getElementById("about-bio").textContent = aboutData.bio;
        document.getElementById("about-contact").textContent = aboutData.contact;

        const linksContainer = document.getElementById("about-links");
        linksContainer.innerHTML = "";

        const instagram = document.createElement("a");
        instagram.textContent = aboutData.links.instagram.name;
        instagram.href = aboutData.links.instagram.url;
        instagram.target = "_blank";
        const br = document.createElement("br");
        const vimeo = document.createElement("a");
        vimeo.textContent = "vimeo";
        vimeo.href = aboutData.links.vimeo;
        vimeo.target = "_blank";
    
        linksContainer.appendChild(instagram);
        linksContainer.appendChild(br); 

        linksContainer.appendChild(vimeo);      

        const bioElement = document.getElementById("about-bio");

        bioElement.innerHTML = "";

        aboutData.bio.forEach(paragraph => {
            const p = document.createElement("p");
            p.textContent = paragraph;
            bioElement.appendChild(p);
        })

    const exhibitionList = document.getElementById("about-exhibition-list");
    exhibitionList.innerHTML = "";

    exhibitionsLibrary.forEach(exhibition => {
        const entry = document.createElement("p");

        const year = document.createElement("span");
        year.textContent = exhibition.year;
        year.classList.add("exhibition-year");

        const title = document.createElement("span");
        title.textContent = `${exhibition.title},`;
        title.classList.add("exhibition-title");

        const venue = document.createElement("span");
        venue.textContent = exhibition.venue;
        venue.classList.add("exhibition-venue");

        const location = document.createElement("span");
        location.textContent = exhibition.location;
        location.classList.add("exhibition-location");

        const exhibitionInfo = document.createElement("span");
        exhibitionInfo.classList.add("exhibition-info");
        exhibitionInfo.append(title, venue);

        entry.append(year, exhibitionInfo, location);

        exhibitionList.appendChild(entry);
    });

    const talksList = document.getElementById("about-talks-list");
    talksList.innerHTML = "";

    talksLibrary.forEach(talk => {
        const entry = document.createElement("p");

        const year = document.createElement("span");
        year.textContent = talk.year;
        year.classList.add("talk-year");

        const title = document.createElement("span");
        title.textContent = `${talk.title},`;
        title.classList.add("talk-title");

        const venue = document.createElement("span");
        venue.textContent = talk.venue;
        venue.classList.add("talk-venue");

        const location = document.createElement("span");
        location.textContent = talk.location;
        location.classList.add("talk-location");

        const talkInfo = document.createElement("span");
        talkInfo.classList.add("talk-info");
        talkInfo.append(title, venue);

        entry.append(year, talkInfo, location);

        talksList.appendChild(entry);
    });
}