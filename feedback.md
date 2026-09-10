
hyunseo:
## fix interaction grammar 
upon landing in threejs scene, she wants to be able to move between the objects. currently movement is limited. it's also not clear scroll leads to spatial toggling of the camera. 
    Right now scroll is doing too many jobs: entering the scene, toggling camera positions, and interacting with overlay content. She wants those responsibilities separated. In the Three.js scene, she wants more direct movement between objects and clearer affordance for how spatial navigation works. In the project overlay, she wants ordinary page behavior: just scroll the content naturally, then click to exit. That would immediately make the whole system easier to learn.

## fix camera speed + performance 
speed is too slow. upon clicking an object, the camera fly speed is super low and glitchy. further optimization of 3d files? or perhaps it's an architectural problem
    The camera approach is too slow and glitchy. I wouldn’t assume yet that this is only model optimization; it could also be the camera interpolation architecture. Since your current movement is very slow even on the laptop, this sounds worth testing separately: performance/FPS versus the actual lerp speed and camera logic.

## refine UI design 
she likes the project overlay. she prefers to not see the scroll bar. outline of the overlay (border solid) makes it too UI. currently the user has to click on the scroll bar to scroll through the project content. it should just be a simple scroll. then clicking to exit the overlay. using scroll for everything is too messy. 

## tune spatial hierarchy and composition 
pay more attention to scaling of the objects. maybe bigger projects have bigger scales, compared to visual experiments. that way viewer can distinguish at a glance. what the camera sees when it's focused on an object is interesting. having more projects in the background vs none should be intentional choices. 
    Bigger, more central forms could signal major projects; smaller forms could signal experiments. That gives the scene a legible hierarchy before anyone clicks anything. Same with the background composition when focusing on a project: whether other works remain visible or disappear should feel authored, not accidental.

she likes the center animated octohedron representing me. 

..