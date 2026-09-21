 export function displayProject(projectId, projectLibrary) {

        const currentProject = projectLibrary[projectId];
        const projectOverlay = document.getElementById("project-overlay");
        
        console.log("projectId:", projectId);
        console.log("currentProject:", currentProject);
        console.log("media:", currentProject.media);
        
        projectOverlay.classList.add("visible");
        
        document.getElementById("project-title").textContent = currentProject.title;
        document.getElementById("project-tools").textContent = currentProject.tools.join(", ");
        document.getElementById("project-year").textContent = currentProject.year;
        document.getElementById("role").textContent = currentProject.role.join(", ");
        document.getElementById("collaboration").textContent = currentProject.collaboration;
        
        const typeElement = document.getElementById("project-type");
        typeElement.innerHTML = "";
        
        currentProject.type.forEach(item => {
            const p = document.createElement("p");
        p.textContent = item;
        typeElement.appendChild(p);
    });

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

    currentProject.media.forEach(media => {
        const figure = document.createElement("figure");
        const img = document.createElement("img");

        img.src = media.src;
        img.alt = currentProject.title;

        figure.appendChild(img);

        if (media.caption) {
            const caption = document.createElement("figcaption");
            caption.classList.add("media-caption");
            caption.textContent = media.caption;
            figure.appendChild(caption);
        }

        mediaContainer.appendChild(figure);
    });

    const vimeoContainer = document.getElementById("project-vimeo");
    vimeoContainer.innerHTML = "";

    if (currentProject.vimeo) {
        const videoId = currentProject.vimeo.url.split("/").pop();
        const iframe = document.createElement("iframe");

        iframe.src = `https://player.vimeo.com/video/${videoId}`;
        iframe.allow = "autoplay; fullscreen; picture-in-picture";
        iframe.allowFullscreen = true;

        vimeoContainer.appendChild(iframe);
    }
}