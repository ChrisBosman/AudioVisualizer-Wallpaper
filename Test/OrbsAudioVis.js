const frameRate = 1000/60;
let container = document.getElementById('element-container');
let orbs = []

console.log("iets");

function createOrb(sizeMult, colorMult){
    let size = sizeMult * 10;
    let pos = [Math.round(Math.random() * 100), Math.round(Math.random() * 100)]

    let element = document.createElement('div');
    element.className = "orb";
    element.style.width = `${size}vw`;
    element.style.height = `${size}vw`;
    element.style.left = `${pos[0]}vw`;
    element.style.top = `${pos[1]}vh`;
    element.style.background = `radial-gradient(circle, hsl(${colorMult*360},${80}%,${10}%) 5%, rgba(0,0,0,0) 75%)`;

    let orb = {
        element: element,
        size: size,
        pos: pos,
        speed: [Math.random() - 0.5, Math.random() - 0.5],
        lifetime: 100
    }
    orbs[orbs.length] = orb;
    container.appendChild(element);
}

console.log("hoi");
// update loop
let loop = setInterval(loopFunc, frameRate);
function loopFunc(){
    for (let i = orbs.length-1; i >= 0; i--) {
        const orb = orbs[i];

        if (orb.lifetime > -1000/frameRate){
            orb.pos = [orb.pos[0] + orb.speed[0], orb.pos[1] + orb.speed[1]]

            orb.element.style.left = `${orb.pos[0]}vw`;
            orb.element.style.top = `${orb.pos[1]}vh`;
            orb.lifetime--;
            if(orb.lifetime < 0 && !orb.element.classList.contains("fadeOut")){
                orb.element.classList.add("fadeOut");
            }
        } else {
            orbs.splice(i, 1);
        }
    }

    // respawn
    // if (Math.floor(Math.random() * 10) == 0){
    //     createOrb();
    // }
}

function wallpaperAudioListener(audioArray) {
    let audioList = []
    for (let i = 0; i < audioArray.length/2; i++) {
        audioList[i] = (audioArray[i] + audioArray[i + audioArray.length/2]) / 2;
    }

    for (let i = 0; i < audioList.length; i++) {
        const audio = min(audioList[i], 1);
        if (audio > 0.2){
            createOrb(audio, i/audioList.length);
        }
        
    }
}
// Register the audio listener provided by Wallpaper Engine.
window.wallpaperRegisterAudioListener(wallpaperAudioListener);