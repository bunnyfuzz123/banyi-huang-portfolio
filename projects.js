import { displayProject } from "./project-display.js";

const menuToggle = document.querySelector(".menu-toggle");
const siteMenu = document.querySelector(".site-menu");

let insideAbout = false;

menuToggle.addEventListener("click", () => {
    siteMenu.classList.toggle("visible");
})

const aboutMenuLink = document.getElementById("about-menu-link");

aboutMenuLink.addEventListener("click", (event) => {
    event.stopPropagation();
    
    enterAbout();
    siteMenu.classList.remove("visible");
})

const aboutOverlay = document.getElementById("about-overlay");

let aboutLibrary = {};

async function loadAbout() {
    const response = await fetch("./about.json");
    aboutLibrary = await response.json();
}

loadAbout();

document.querySelector(".about-link").addEventListener("click", enterAbout);

fetch("./projects.json")
    .then(response => response.json())
    .then(projects => {
        const grid = document.getElementById("project-grid");

        Object.entries(projects).forEach(([projectId, project]) => {

        const card = document.createElement("div");
        card.classList.add("project-card");
        card.dataset.projectId = projectId;
            
        // Image
        if (project.media && project.media.length > 0) {
            const img = document.createElement("img");
            img.src = project.media[0].src;
            img.alt = project.title;
            card.appendChild(img);
        }
    
        // Title
        const title = document.createElement("h2");
        title.textContent = project.title;
        card.appendChild(title);
    
        // Year
        const year = document.createElement("p");
        year.textContent = project.year;
        card.appendChild(year);
    
        

        card.addEventListener("click", () => {
            event.stopPropagation();
            displayProject(projectId, projects);
        });

        grid.appendChild(card);
    });
    })
    .catch(error => {
        console.error("Error loading projects:", error);
    });


    window.addEventListener("click", (event) => {

    if (!aboutOverlay.contains(event.target) && !aboutMenuLink.contains(event.target)) {
        if (insideAbout) {
        exitAbout();
        }
    }

    
    const projectOverlay = document.getElementById("project-overlay");

    if (
        projectOverlay.classList.contains("visible") &&
        !projectOverlay.contains(event.target)
    ) {
        projectOverlay.classList.remove("visible");
    }
});

function enterAbout() {
        console.log("aboutEntered");
        insideAbout = true;

        document.body.style.cursor = "default";
        console.log("entered about");
        
        const aboutData = aboutLibrary;

        aboutOverlay.classList.add("visible");

        document.getElementById("about-title").textContent = aboutData.title;
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

    }

    
    function exitAbout() {
        insideAbout = false;

        aboutOverlay.classList.remove("visible");

        document.body.style.cursor = "default";
    }