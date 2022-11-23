let audioVisualizers = {
    None: -1,
    Horizontal: 0,
    Circular: 1,
    Star: 2,
    Orbs: 3,
}
let selectedAudioVis = audioVisualizers.Horizontal;

let bars = []
let oldAudioArray = [];

const backgroundTypes = {
    solidColor: 0,
    image: 1,
    slideShow: 2,
    video: 3,
}

let AudioVisData = {
    rolingAverageAmount: 2,

    horizontalBars: 128,

    circularbars: 20,
    freqBands: 32,
    timedAudioVis: true,
    timeMult: 1,
}

function wallpaperAudioListener(audioArray) {
    let audioList = []
    // flip the left side of the audio
    for (let i = 0; i <= audioArray.length; i++) {
        audioList[i] = audioArray[i >= audioArray.length / 2 ? i : audioArray.length - i - 1];
    }

    // remember last audio's
    oldAudioArray.push(audioList);
    if (oldAudioArray.length > AudioVisData.rolingAverageAmount) {
        oldAudioArray.shift();
    }

    switch (selectedAudioVis) {
        case audioVisualizers.Horizontal:
            horizontalAudioVisualizer(oldAudioArray);
            break;
        case audioVisualizers.Circular:
            circularAudioVisualizer(audioList);
            break;
        case audioVisualizers.Orbs:
            orbsAudioUpdate(audioArray);
            break;
        case audioVisualizers.Star:
            starAudioVisAudioListener(audioArray);
            break;
    }
}

/* ---------------- SETUP ---------------- */
function setup(){
    //delete the old container
    stopLoopOrbs();
    terminateStarAudioVis();
    $('#container').remove();
    
    //setup the bars:
    let container = document.createElement('div');
    container.id = "container"
    let barsContainer = document.createElement('div');
    barsContainer.id = "barsContainer"
    
    switch (selectedAudioVis) {
        case audioVisualizers.Horizontal:
            setupHorizontalAudioVisualizer(container, barsContainer);
            break;
        case audioVisualizers.Circular:
            setupCircularAudioVisualizer(container, barsContainer);
            break;
        case audioVisualizers.Orbs:
            setupOrbs(container);
            break;
        case audioVisualizers.Star:
            setupStarAudioVis();
            break;
    }

    container.appendChild(barsContainer)
    document.body.appendChild(container);

    // properties audioVis:
    if (audiovisualizerStyle.x != null)
        $('#container').css('left', audiovisualizerStyle.x);
    if (audiovisualizerStyle.y != null)
        $('#container').css('top', audiovisualizerStyle.y);
    if (audiovisualizerStyle.width != null)
        $('#barsContainer').css('width', audiovisualizerStyle.width);
    if (audiovisualizerStyle.color != null)
        $('.bar').css("background-color", audiovisualizerStyle.color);
    if (audiovisualizerStyle.bargap != null)
        $('#barsContainer').css("gap", audiovisualizerStyle.bargap);
    if (audiovisualizerStyle.curved != null)
        $('.bar').css("border-radius", audiovisualizerStyle.curved);
    if (audiovisualizerStyle.borderActive)
        $('.bar').css("border", `solid rgb(${audiovisualizerStyle.borderColor}) ${audiovisualizerStyle.borderSize}px`);
    if (audiovisualizerStyle.shadowActive)
        $('.bar').css("box-shadow", `0px 0px 6px ${audiovisualizerStyle.shadowSpread}px rgb(${audiovisualizerStyle.shadowColor})`);

    // date time widget
    $('.timeCenterContainer').css("opacity", "100");
}

/* ----------- Update background ----------- */
function updateBackground(){
    console.log(backgroundSyle.directory);
    if (backgroundSyle.backgroundType === backgroundTypes.slideShow && backgroundSyle.directory != null){
        window.wallpaperRequestRandomFileForProperty('backgrounddirectory', (propertyName, filePath) => {
            changeBackgroundImage(filePath);
        });
    }
}
setInterval(updateBackground, 2000);

function changeBackgroundImage(file){
    const filePath = file.indexOf('file:///') >= 0 ? file : ('file:///' + file)
    let newImageElement = document.getElementById('newBackgroundImg');
    newImageElement.src = filePath;
    newImageElement.classList.add('visible');

    setTimeout(() => {
        let imageElement = document.getElementById('backgroundImg');
        imageElement.src = filePath;   
        newImageElement.classList.remove('visible');
    }, 1000);
}

// Register the audio listener provided by Wallpaper Engine.
window.wallpaperRegisterAudioListener(wallpaperAudioListener);

/* ---------------- PROPERTIES ---------------- */
let audiovisualizerStyle = {
    x: 0,
    y: 0,
    width: "0%",
    magnitudeBasedColor: true,
    color: null,
    secondColor: "27,242,255",
    magnitudeBasedColorMultiplier: 1.5,
    bargap: null,
    curved: null,
    borderActive: false,
    borderSize: 1,
    borderColor: "0,0,0",
    shadowActive: true,
    shadowSpread: 0,
    shadowColor: "0,0,0",

    circularBarRainbow: false,
    circularBarColors: [[255, 0, 0], [100, 0, 0]],
    circularaudiovisualizerOpacity: 100,
}
backgroundSyle = {
    backgroundType: backgroundTypes.image,
    imageSrc: "",
    videoSrc: "",
    directory: null,
}

// Register the propertyListener
window.wallpaperPropertyListener = {
    applyUserProperties: function (properties) {
        let prop = properties;

        // ----------------------------- DateTime -----------------------------\\
        dateTimeProperties(prop);

        // ---------------------------- Background -----------------------------\\
        if (properties.backgroundtype){
            let imageElement = document.getElementById('backgroundImg');
            let videoElement = document.getElementById('backgroundVideo');
            $('#backgroundImg.visible').removeClass('visible');
            $('#backgroundVideo.visible').removeClass('visible');

            switch (properties.backgroundtype.value) {
                case '0':  // solid color
                    backgroundSyle.backgroundType = backgroundTypes.solidColor;
                    break;
                case '1':  // image
                    backgroundSyle.backgroundType = backgroundTypes.image;
                    $('#backgroundImg').addClass('visible');

                    if (backgroundSyle.imageSrc)
                        changeBackgroundImage(backgroundSyle.imageSrc);
                    break;
                case '2':  // image slideshow
                    backgroundSyle.backgroundType = backgroundTypes.slideShow;
                    $('#backgroundImg').addClass('visible');
                    break;
                case '3':  // video
                    backgroundSyle.backgroundType = backgroundTypes.video;
                    $('#backgroundVideo').addClass('visible');
                    break;
            }
        }
        if (properties.backgroundimg) { // the background image
            let imageElement = document.getElementById('backgroundImg');
            imageElement.src = 'file:///' + properties.backgroundimg.value;
            backgroundSyle.imageSrc = 'file:///' + properties.backgroundimg.value;

            if (backgroundSyle.backgroundType === backgroundTypes.image)
                imageElement.style.opacity = 100;
        }
        if (properties.backgrounddirectory){
            backgroundSyle.directory = properties.backgrounddirectory.value;
        }
        if (properties.backgroundvideo) { 
            let videoElement = document.getElementById('backgroundVideo');
            videoElement.src = 'file:///' + properties.backgroundvideo.value;
            backgroundSyle.videoSrc = 'file:///' + properties.backgroundimg.value;
            
            if (backgroundSyle.backgroundType === backgroundTypes.video)
                videoElement.style.opacity = 100;
        }
        // ------------------------------ AudioVis ------------------------------\\
        if (properties.audiovisualizertype){
            if (properties.audiovisualizertype.value == -1)
                selectedAudioVis = audioVisualizers.None;
            else if (properties.audiovisualizertype.value == 0)
                selectedAudioVis = audioVisualizers.Horizontal;
            else if (properties.audiovisualizertype.value == 1)                
                selectedAudioVis = audioVisualizers.Circular;
            else if (properties.audiovisualizertype.value == 2)
                selectedAudioVis = audioVisualizers.Star;
            else if (properties.audiovisualizertype.value == 3)
                selectedAudioVis = audioVisualizers.Orbs;
            setup();
        }
        if (properties.audiovisualizer) {
            $('#barsContainer').css('display', `${properties.audiovisualizer.value ? 'flex' : 'none'}`);
        }
        if (properties.audiovisualizerwidth) {
            $('#barsContainer').css('width', `${properties.audiovisualizerwidth.value}%`);
            audiovisualizerStyle.width = `${properties.audiovisualizerwidth.value}%`;
        }
        if (properties.audiovisualizeroffsetx) {
            $('#container').css('left', `${properties.audiovisualizeroffsetx.value}%`);
            audiovisualizerStyle.x = `${properties.audiovisualizeroffsetx.value}%`;
        }
        if (properties.audiovisualizeroffsety) {
            $('#container').css('top', `${properties.audiovisualizeroffsety.value}%`);
            audiovisualizerStyle.y = `${properties.audiovisualizeroffsety.value}%`;
        }
        // circular audio visualizer
        circularAudioVisualizerProperties(prop);
        horizontalAudioVisualizerProperties(prop);
        starAudioVisProperties(prop);       
    },
};

setup();

function lerpColor(c1, c2, factor) {
    factor = Math.min(1, factor);
    factor = Math.max(0, factor);

    let colorOut = [];
    for (var i = 0; i < c1.length; ++i) {
        colorOut[i] = (c1[i] * (1 - factor) + c2[i] * factor);
    }
    return colorOut;
}

function toCSSrgb(variable) {
    var customColor = variable.split(' ');
    customColor = customColor.map(function (c) {
        return Math.ceil(c * 255);
    });
    return customColor;
}

// function hover(element, enter, leave) {
//     element.addEventListener('mouseenter', enter)
//     element.addEventListener('mouseleave', leave)
// }