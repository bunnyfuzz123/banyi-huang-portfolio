 export function displayProject(projectId, projectLibrary) {
        
        const currentProject = projectLibrary[projectId];
        const projectOverlay = document.getElementById("project-overlay");
        
        console.log("projectId:", projectId);
        console.log("currentProject:", currentProject);
        console.log("media:", currentProject.media);
        
        projectOverlay.classList.add("visible");
        
        document.getElementById("project-title").textContent = currentProject.title;
        // document.getElementById("project-tools").textContent = currentProject.tools.join(", ");
        document.getElementById("project-year").textContent = currentProject.year;
        // document.getElementById("role").textContent = currentProject.role.join(", ");
        
        //roles block
        const roleElement = document.getElementById("role");
        roleElement.innerHTML = "";

        const roleHeading = document.createElement("h4");
        roleHeading.textContent = "My roles";
        roleElement.appendChild(roleHeading);

        currentProject.role.forEach(role => {
            const p = document.createElement("p");
            p.textContent = role;
            roleElement.appendChild(p);
        })

      
        //collaboration block
        const collaborationElement = document.getElementById("collaboration");
        collaborationElement.innerHTML = "";

        if (currentProject.collaboration.length > 0) {
            const collaborationHeading = document.createElement("h4");
            collaborationHeading.textContent = "Collaborators";
            collaborationElement.appendChild(collaborationHeading);

            currentProject.collaboration.forEach(collaboration => {
                const p = document.createElement("p");
                p.textContent = collaboration;
                collaborationElement.appendChild(p);
            })
        }

        //exhibitions block
        const exhibitionElement = document.getElementById("exhibition-history");
        exhibitionElement.innerHTML = "";

        if (currentProject.exhibitions.length > 0) {
            const exhibitionHeading = document.createElement("h4");
            exhibitionHeading.textContent = "Exhibition history";
            exhibitionElement.appendChild(exhibitionHeading);

            currentProject.exhibitions.forEach(exhibition => {
                const p = document.createElement("p");
                p.textContent = exhibition;
                exhibitionElement.appendChild(p);
            });
        }

        // document.getElementById("collaboration").textContent = currentProject.collaboration;
        
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


    //credits block
    const creditElement = document.getElementById("credits");
    creditElement.innerHTML = "";

    if (currentProject.credits.length > 0) {
          const creditsHeading = document.createElement("h4");
            creditsHeading.textContent = "Support";
            creditElement.appendChild(creditsHeading);

        currentProject.credits.forEach(credit => {
            const p = document.createElement("p");
            p.textContent = credit;
            creditElement.appendChild(p);
        });
    }

    const mediaContainer = document.getElementById("project-media");
    mediaContainer.innerHTML = "";

    //preview video
    if (currentProject.previewVideo) {
        const previewVideo = document.createElement("video");

        previewVideo.src = currentProject.previewVideo;
        previewVideo.autoplay = true;
        previewVideo.muted = true;
        previewVideo.loop = true;
        previewVideo.playsInline = true;

        mediaContainer.appendChild(previewVideo);
    }

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