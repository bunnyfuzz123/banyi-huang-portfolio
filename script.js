import * as THREE from "three";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import { HDRLoader } from 'three/addons/loaders/HDRLoader.js';
import { BokehPass } from 'three/addons/postprocessing/BokehPass.js';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from "three/addons/postprocessing/RenderPass.js";
import { UnrealBloomPass } from "three/addons/postprocessing/UnrealBloomPass.js";

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

const projectOverlay = document.getElementById("project-overlay");
const aboutOverlay = document.getElementById("about-overlay");

const loader1 = new GLTFLoader();
const loader2 = new GLTFLoader();
const loader3 = new GLTFLoader();
const loader4 = new GLTFLoader();
const loader5 = new GLTFLoader();
const loader6 = new GLTFLoader();
const loader7 = new GLTFLoader();

const ambientLight = new THREE.AmbientLight(0xffffff, 1.5);
const directionalLight = new THREE.DirectionalLight(0xffffff, 1.5);
directionalLight.position.set(5, 5, 5);

//E622FC
const chickenDirectionalLight = new THREE.DirectionalLight(0xFDFFEB, 1);
chickenDirectionalLight.position.set(-4, 2, 0);

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

let aboutMe;

let projects = [];

let hoveredObject = null;

let projectLibrary = {};
let currentProject = null;
let aboutLibrary = {};

async function loadProjects() {
    const response = await fetch("projects.json");
    projectLibrary = await response.json();

    console.log("projectLibrary loaded:", projectLibrary);

};

async function loadAbout() {
    const response = await fetch("about.json");
    aboutLibrary = await response.json();
    console.log("aboutLibrary loaded");
}

loadProjects(); 

loadAbout();

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
    camera = new THREE.PerspectiveCamera(
        65,
        window.innerWidth / window.innerHeight,
        0.1,
        100
    );

    scene.add(ambientLight);
    scene.add(directionalLight);
    scene.add(chickenDirectionalLight);

    renderer = new THREE.WebGLRenderer();
    renderer.setClearColor(0xffffff);

    renderer.setSize(window.innerWidth, window.innerHeight);
   
    document
        .getElementById("beat-two")
        .appendChild(renderer.domElement);


    composer = new EffectComposer(renderer);

    const renderPass = new RenderPass(scene, camera);
    composer.addPass(renderPass);

    const bokehPass = new BokehPass (scene, camera, {
        focus: 1,
        aperture: 0.0004,
        maxblur: 0.002
    })

    const resolution = new THREE.Vector2(window.innerWidth, window.innerHeight);
    const bloomPass = new UnrealBloomPass(resolution, 0.3, 0.1, 1);

    composer.addPass(bloomPass);

    composer.addPass(bokehPass);

    //animating aboutMe icon
    let detail = 0;
    let direction = 1;

    setInterval(() => {
        detail += direction; 

        if (detail === 5) {
            direction = -1;
        }

        if (detail === 0) {
            direction = 1;
        }
        setAboutMeDetail(detail);
    }, 200);

    const material2 = new THREE.MeshBasicMaterial({
        color: 0x8A2BE2,
        wireframe: true
    })

    aboutMe = new THREE.Mesh(
        new THREE.OctahedronGeometry(0.2, detail), 
        material2
    );
    
    aboutMe.position.set(0, 0, 0);
    scene.add(aboutMe);
    projects.push(aboutMe);
    aboutMe.userData.aboutId = "about";


    loader1.load("assets/models/mazu_for3jsWebsite_alternative.glb", (gltf) =>{
        projectA = gltf.scene;
        projectA.position.set(-3, -4, 1);
        projectA.scale.set(2, 2, 2);
        scene.add(projectA);
        projects.push(projectA);
        projectA.userData.projectId = "remazu";
    })

    loader2.load("assets/models/TriadicMerge_forThreeJSPortfolio_centered_optimized.glb", (gltf) =>{
        projectB = gltf.scene;
        projectB.position.set(8, 1, -2);
        projectB.scale.set(6, 6, 6);
        scene.add(projectB);
        projects.push(projectB);
        projectB.userData.projectId = "triadic-patterning";
    })

    loader3.load("assets/models/Sibuxiang_forThreeJSPortfolio.glb", (gltf) =>{
        projectC = gltf.scene;
        projectC.position.set(8, -2, 1);
        projectC.scale.set(2, 2, 2);
        projectC.scale.set(.1, .1, .1);
        scene.add(projectC);
        projects.push(projectC);
        projectC.userData.projectId = "sibuxiang";
    })

     loader4.load("assets/models/changE_dildo_ThreeJS.glb", (gltf) =>{
        projectD = gltf.scene;
        projectD.position.set(-1, 2, -5);
        // projectD.scale.set(.1, .1, .1);
        scene.add(projectD);
        projects.push(projectD);
        projectD.userData.projectId = "dong";
    })

    loader5.load("assets/models/xeroxStack_threeJSPortfolio.glb", (gltf) =>{
        projectE = gltf.scene;
        projectE.position.set(3, 0, -4);
        // projectE.scale.set(2, 2, 2);
        scene.add(projectE);
        projects.push(projectE);
        projectE.userData.projectId = "xerox";
        // projectE.material.wireframe = true;
        projectE.visible = false;

    })

      loader6.load("assets/models/jojoduck_threeJS.glb", (gltf) =>{
        projectF = gltf.scene;
        projectF.position.set(-4, 2, 0);
        // projectF.scale.set(2, 2, 2);
        scene.add(projectF);
        projects.push(projectF);
        projectF.userData.projectId = "lunar-calendar";
        // projectE.material.wireframe = true;
        projectF.visible = false;
       

    })

     loader7.load("assets/models/constellation_threeJS.glb", (gltf) =>{
        projectG = gltf.scene;
        projectG.position.set(-6, 6, -6);
        projectG.scale.set(5, 5, 5);
        scene.add(projectG);
        projects.push(projectG);
        projectG.userData.projectId = "constellation";
        // projectE.material.wireframe = true;
        projectG.visible = false;

    })
  

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

        const hitObject = intersects[0].object;
        const object = getProjectRoot(hitObject);

        
        if (selectedObject === null) {
            approachProject(object);
            } else if (selectedObject === object) {
                 if (object === aboutMe) {
                    enterAbout(object);
                 } else {
                enterProject(object);
            } 
            
            } else {
                approachProject(object);
            }
    }

    function handleBeatTwoScroll() {
         selectedObject = null;
         insideProject = false;


         projectOverlay.classList.remove("visible");
         aboutOverlay.classList.remove("visible");

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

        composer.render();

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

        if (projectE) {
            projectE.rotation.y += 0.0002;
            projectE.rotation.z += 0.0002;
        }

        if (projectG) {
            projectG.rotation.x += 0.0001;
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
            const orbitStrength = 1.2;

            cameraTarget.set(
                baseCameraTarget.x + mouse.x * orbitStrength,

                baseCameraTarget.y + mouse.y * orbitStrength,

                baseCameraTarget.z 
            );

            lookTarget.copy(baseLookTarget);
        }

        camera.position.lerp(cameraTarget, 0.002);

        camera.lookAt(lookTarget);
        // camera.lookAt(0, 0, 0);

        // renderer.render(scene, camera);
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
        projectOverlay.classList.add("visible");
        document.body.style.cursor = "default";

        hasEnteredProject = true;  

       const projectId = object.userData.projectId;

        currentProject = projectLibrary[projectId];
        

        console.log("projectId:", projectId);
        console.log("currentProject:", currentProject);
        console.log("media:", currentProject.media);

        document.getElementById("project-title").textContent = currentProject.title;
        document.getElementById("project-tools").textContent = currentProject.tools.join(", ");
        document.getElementById("project-year").textContent = currentProject.year;
        document.getElementById("role").textContent = currentProject.role.join(", ");
        document.getElementById("collaboration").textContent = currentProject.collaboration;
        document.getElementById("project-type").textContent = currentProject.type;
        // document.getElementById("credits").textContent = currentProject.credits;


        const typeElement = document.getElementById("project-type");

        typeElement.innerHTML = "";

        currentProject.type.forEach(paragraph => {
            const p = document.createElement("p");
            p.textContent = paragraph;
            typeElement.appendChild(p);
        })

        // const collaborationElement = document.getElementById("collaboration")
        // collaborationElement.innerHTML = "";

        // currentProject.collaboration.forEach(paragraph => {
        //     if (currentProject.collaboration.length = 1) {
        //         return;
        //         console.log("only one line here")
        //     }
        //     else {const p = document.createElement("p");
        //     p.textContent = paragraph;
        //     collaborationElement.appendChild(p);}


            
        // });

        const descriptionElement = document.getElementById("project-description");

        descriptionElement.innerHTML = "";

        currentProject.description.forEach(paragraph => {
            const p = document.createElement("p");
            p.textContent = paragraph;
            descriptionElement.appendChild(p);
        });

        const creditElement = document.getElementById("credits");
        creditElement.innerHTML = "";
        currentProject.credits.forEach(paragraph => {
            const p = document.createElement("p");
            p.textContent = paragraph;
            creditElement.appendChild(p);
        });

        const mediaContainer = document.getElementById("project-media");
        mediaContainer.innerHTML = "";
        currentProject.media.forEach (media => {
            const figure = document.createElement("figure");
            const img = document.createElement("img");
            img.src = media.src
            img.alt = currentProject.title;

            figure.appendChild(img);

            if (media.caption) {
                const caption = document.createElement("figcaption");
                caption.classList.add("media-caption");
                caption.textContent = media.caption;
                figure.appendChild(caption);
                console.log(caption);
            }
            mediaContainer.appendChild(figure);
        });

        const vimeoContainer = document.getElementById("project-vimeo");
        vimeoContainer.innerHTML = "";

        if (currentProject.vimeo) {
            const videoId = currentProject.vimeo.url.split("/").pop();
            console.log(videoId);
            const iframe = document.createElement("iframe");
            iframe.src = `https://player.vimeo.com/video/${videoId}`;
            iframe.allow = "autoplay; fullscreen; picture-in-picture";
            iframe.allowFullscreen = true;

            vimeoContainer.appendChild(iframe);
        };

    }


    function enterBeatThree() {
        projectE.visible = true;
        projectF.visible = true;
        projectG.visible = true;
        console.log("xerox paper should not be displayed")
      
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
        aboutMe.geometry = new THREE.OctahedronGeometry(
            0.2,
            newDetail
        );
    }

    function enterAbout(object) {
        insideProject = true;

        aboutOverlay.classList.add("visible");

        document.body.style.cursor = "default";
        console.log("entered about");
        
        const aboutId = aboutMe.userData.aboutId;
        const aboutData = aboutLibrary;
        console.log(aboutLibrary);

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

    }