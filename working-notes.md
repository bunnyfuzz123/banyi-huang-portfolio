Interaction prototype #1

- scroll --> scale feels promising
- mouse --> frame maping is worth revisiting
- explore mouse --> introducing/positioning of a second entity. interest lies in relationships,intersections, and reference frames rather than isolated effects. 
    mouse position input results in 
- return to overall architecture

Project interaction: overview --> approach/observe --> fork: return or engage deeper 

## beat 2 - mazu glb

- mazu mesh loads successfully with materials
- clicking/approaching does not center the object
- likely bc the glb's object origin is not centered
- not blocking current prototype 

- maybe toggle material to wireframe with mouse hover? in addition to pointer icon changing 


## project pages

project architecture: replace hardcoded remazu html with reusable project-detail templace + project data keyed by ID. same ID can connect Three.js object, URL state, and displayed project content

# file size optimization

landing page gif might be too big, 25. mb. the same way that i had to scale down the optimize glb files, reducing texture size from 4k to 2k, something can be done about this. 
    Landing-page GIF: 25.7 MB, needs an optimization pass later—either substantially compress/resize it or replace it with a lighter looping format while preserving the automatic-motion experience.


# Camera movement/interaction 
DONE!! 
As the glb contains multiple child meshes, I could later raycast into the hierarchy, identify the actual child mesh that was clicked, and use that child mesh's bounding box center instead of the whole project's root center. Second click becomes travel toward the part of the obejct you touched. It's more poetic. and offers more unexpected perspectives. 

fix paper project UVs and resulting material flickering issue 

use octahedron as a way to link to aboutMe page overlay



NEXT STEPS — TOWARD TUESDAY V0

CURRENT STATE

The spatial/Three.js system is sufficiently developed for V0.

Current spatial language includes:
- 3D project objects distributed through the scene
- camera travel / approach behavior
- child meshes can function as individual clickable destinations
- slow camera movement allows projects to be inhabited from unexpected viewpoints
- post-processing now gives the scene stronger focal hierarchy / dreaminess
- project-detail overlay works
- Three.js object → projectId → projects.json → project detail HTML pipeline works
- smaller/secondary project objects can enter the scene later

IMPORTANT:
Stop treating the Three.js environment as the current bottleneck.

It is pleasurable and easy to keep developing, but the portfolio now needs CONTENT.

Do not touch script.js tomorrow unless something literally blocks content population.
Record Three.js ideas/bugs in notes instead.


TOMORROW'S PRIMARY TASK: PROJECT CONTENT

This is primarily a collecting / organizing / writing day.

For each project, gather:

IDENTITY
- title
- year
- project type

MY CONTRIBUTION
- role
- tools
- collaboration / collaborators

ABOUT THE WORK
- summary if useful
- description

CONTEXT
- media
- components if relevant
- exhibitions
- credits

MEDIA
For V0, support only:
1. still images
2. Vimeo embeds

No GIFs.
No local-video system.
No need to anticipate every possible media type.

Prioritize collecting the actual media before designing an elaborate media renderer.

Project media should eventually be displayed generously:
- strong hero image/video
- project text/context
- role/contribution
- additional component/documentation images
- exhibition/install documentation later in sequence

Hero material = encounter the work.
Installation documentation = understand where/how the work lived.


PROJECT DETAIL ARCHITECTURE

There should be ONE project-detail system.

Both spatial and flat navigation should lead to exactly the same project data and project-detail layout.

SPATIAL ROUTE:

click 3D object
→ projectId
→ projects.json
→ render project
→ project overlay

FLAT ROUTE:

click thumbnail/title
→ projectId
→ projects.json
→ render project
→ SAME project overlay

Do not create separate project pages/data for spatial and flat modes.

Eventually separate the current enterProject() responsibilities:

enterProject(object)
= Three.js-specific behavior
- camera
- spatial state
- mesh interaction
- then calls openProject(projectId)

openProject(projectId)
= universal content behavior
- retrieve project from projectLibrary
- render title/year/role/description/media/etc.
- open project overlay

This allows both 3D objects and flat thumbnails to call the same project-detail system.


FLAT WORK INDEX

The site needs a non-spatial way to browse projects.

This is important for:
- accessibility
- people who do not want to explore the 3D environment
- hiring viewers who want to scan work quickly
- direct navigation to a known project

For V0, keep it extremely ordinary.

Possible:
thumbnail
title
year
project type

Click → same project-detail overlay.

The Work Index should render from projects.json rather than duplicate project information.


UTILITY / NAVIGATION LAYER

Add a persistent fixed-position interface in a corner of the viewport.

Does not need to be a hamburger.
Can be a small overlay/control that expands.

Stable destinations:

Work / Projects
About
Writing
CV
Contact

Spatial portfolio = expressive navigation.
Fixed menu = dependable navigation.

Both coexist.


NON-PROJECT PAGES

ABOUT
Necessary for V0.
Needs its own content/layout but can use the same overlay/interface language.

CV
Can be a straightforward separate view/page/overlay.
Does not need to fit the project schema.

WRITING
Keep simple.
A flat list/index of published articles is enough.
Reuse/adapt HTML/content from existing website rather than redesigning it.

CONTACT
High priority because this is a hire-facing portfolio.
Make email/contact route immediately obvious.

CURATORIAL
Not necessary for Tuesday V0.
Add later.


RESPONSIVE THREE.JS — LATER

Current project positions and camera coordinates are substantially hardcoded.

This is known technical debt, not an immediate problem.

Future responsive pass should address:
- renderer resize
- composer/post-processing resize
- camera aspect ratio / projection matrix
- viewport proportions
- project positioning
- camera targets/framing
- mobile/small-screen behavior

Do NOT turn this into a responsive spatial-layout-system project before Tuesday.


POST-PROCESSING / VISUAL SYSTEM — HOLD CURRENT STATE

Current post-processing experiments are producing a visual quality I like.

Important discovery:
composition did not necessarily need more objects/connections.
Depth of field / post-processing created hierarchy by controlling attention.

The space now feels dreamier and less compositionally jarring.

Save/commit the current working combination.

Later:
- toggle individual passes to understand their contribution
- test ordering
- tune parameters
- determine what is essential vs decorative

Not necessary now.


THINGS TO RECORD, NOT BUILD YET

- responsive spatial layout
- more sophisticated media taxonomy
- GIF support
- local video
- clean/direct project URLs
- History API / routing
- elaborate Work Index interactions
- curatorial archive
- additional secondary-project interaction systems
- further post-processing experimentation
- more spatial decoration / connecting lines
- additional Three.js polish


TUESDAY V0 DEFINITION

The goal is NOT the eventual website.

The goal is a sendable portfolio containing:

- experiential/spatial entrance
- real projects with real project information
- strong still/video media
- reusable project-detail layout
- clear statement of my contribution
- flat Work/Projects index
- About
- Writing
- CV
- Contact
- dependable navigation between these things

The spatial architecture has been demonstrated.

Now put the work inside it.


V1 notes: 
-add sidebar labels: role/software/credits/exhibition history 