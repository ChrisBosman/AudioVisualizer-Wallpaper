const frameRate = 1000/60;
const maxOrbs = 100;
let orbsContainer;// = document.getElementById('element-container');
let orbs = []
let orbsOldAudio = [];
let loop;

function setupOrbs(container){
    orbsContainer = container;
    loop = setInterval(loopFunc, frameRate);
    orbs = []
    orbsOldAudio = [];
}
function stopLoopOrbs(){
    clearInterval(loop);  
}

function createOrb(sizeMult, colorMult){
    let size = sizeMult * 10;
    let pos = [Math.round(Math.random() * 100), Math.round(Math.random() * 100)]

    let element = document.createElement('div');
    element.className = "orb";
    element.style.width = `${size}vw`;
    element.style.height = `${size}vw`;
    element.style.left = `${pos[0]}vw`;
    element.style.top = `${pos[1]}vh`;
    element.style.background = `radial-gradient(circle, hsl(${colorMult*360},${80}%,${50}%) 5%, rgba(0,0,0,0) 75%)`;

    let orb = {
        element: element,
        size: size,
        pos: pos,
        speed: [Math.random() - 0.5, Math.random() - 0.5],
        lifetime: Math.max(20 * Math.min(25/orbs.length, 1.5), 5)
    }
    orbs[orbs.length] = orb;
    orbsContainer.appendChild(element);
}

// update loop
function loopFunc(){
    for (let i = orbs.length-1; i >= 0; i--) {
        const orb = orbs[i];

        if (orb.lifetime > -5000/frameRate){
            orb.pos = [orb.pos[0] + orb.speed[0], orb.pos[1] + orb.speed[1]]

            orb.element.style.left = `${orb.pos[0]}vw`;
            orb.element.style.top = `${orb.pos[1]}vh`;
            
            
            orb.lifetime--;
            if(orb.lifetime < 0 && !orb.element.classList.contains("fadeOut")){
                orb.element.classList.add("fadeOut");
            }
            if(orb.pos[0] > 100 + orb.size || orb.pos[0] < -orb.size || orb.pos[1] > 100 + orb.size || orb.pos[1] < -orb.size){
                orbsContainer.removeChild(orb.element);
                orbs.splice(i, 1);
            }
        } else {
            orbsContainer.removeChild(orb.element);
            orbs.splice(i, 1);
        }
    }

    // limit the orbs
    if (orbs.length > maxOrbs){
        orbsContainer.removeChild(orbs[0].element);
        orbs.shift();
    }

    // respawn
    // if (Math.floor(Math.random() * 10) == 0){
    //     createOrb();
    // }
}

function orbsAudioUpdate(audioArray) {
    let filteredAudioList = [];
    for (let i = 0; i < audioArray.length/2; i++) {
        filteredAudioList[i] = (audioArray[i] + audioArray[i + audioArray.length/2]) / 2;
    }
    orbsOldAudio[orbsOldAudio.length] = filteredAudioList;

    if(orbsOldAudio.length > 5){
        let audioList = []
        
        for(let i = 0; i < audioArray.length; i++){
            let value = 0;
            // orbsOldAudio.forEach(dataPoint => value += dataPoint);
            for (let j = 0; j < orbsOldAudio.length; j++){
                value += orbsOldAudio[j][i];
            }

            audioList[i] = value / orbsOldAudio.length;
        }
        
        for (let i = 0; i < audioList.length; i++) {
            const audio = Math.min(audioList[i], 1);
            if (audio > 0.2){
                createOrb((audio-0.2)*1.2, i/audioList.length);
            }
            
        }

        orbsOldAudio = [];
    }

}
// Register the audio listener provided by Wallpaper Engine.
// window.wallpaperRegisterAudioListener(wallpaperAudioListener);