// const amountOfBars = 128;
let amountOfBars = 20;
// let amountOfCircularBars = 20
let freqBands = 32;
const averageAmount = 2;
let timedAudioVis = true;
let circularBar = false;
let oldAudioArray = [];
// let timedAudioArray = [];

let AudioVisData = {
    rolingAverageAmount: 2, // need to be implemented.

    horizontalBars: 128,

    circularbars: 20,
    freqBands: 32,
    timedAudioVis: true,
}

function wallpaperAudioListener(audioArray) {
    let audioList = []
    // flip the left side of the audio
    for (let i = 0; i <= audioArray.length; i++) {
        audioList[i] = audioArray[i >= audioArray.length / 2 ? i : audioArray.length - i - 1];
    }

    // remember last audio's
    oldAudioArray.push(audioList);
    if (oldAudioArray.length > averageAmount) {
        oldAudioArray.shift();
    }

    if (!circularBar){ // vertical bars visual
        for (let i = 0; i < bars.length; i++) {
            let heightValue = 0
            oldAudioArray.forEach(oldAudio => {
                heightValue += Math.min(oldAudio[i], 1);
            });
            heightValue /= oldAudioArray.length;
            bars[i].style.height = `${heightValue * 100}%`;
        }
    } else { 
        // circular visual
        circularAudioVisualizer(audioList);
    }
}

/* ---------------- SETUP ---------------- */
let bars = []
let barFreqs = [];
function setup(){
    //delete the old container
    $('#container').remove();
    //setup the bars:
    let container = document.createElement('div');
    container.id = "container"
    container.className = circularBar ? "circular-bar-container" : "container";
    let barsContainer = document.createElement('div');
    barsContainer.id = "barsContainer"
    barsContainer.className = circularBar ? "circular-bar-container2" : "bars-container";

    amountOfBars = circularBar ? 20 : 128;

    for (let i = 0; i < amountOfBars; i++) {
        if (!circularBar) {
            let bar = document.createElement('div');
            bar.className = "bar";

            bar.style.height = `${Math.round(Math.random() * 100)}%`

            barsContainer.appendChild(bar);
            bars[i] = bar;
        } else {
            for (j = freqBands-1; j >= 0; j--) {
                let bar = document.createElement('div');
                bar.className = "circular-bar";

                bar.className = 'circular-bar';
                bar.style.transform = `rotate(${i / amountOfBars * 360 + (1 / amountOfBars * 360 )/ freqBands * j}deg)` //Math.round(Math.random() * 360)}deg)`;
                bar.style.width = `${0}%`; //j * 1.5 + 10}%`;//`${Math.floor(Math.random() * 50 + 10)}%`;
                
                if (audiovisualizerStyle.circularBarRainbow){
                    bar.style.backgroundColor = `hsl(${j / freqBands * 360}, 80%, 50%)`;
                }
                else{
                    let color = lerpColor(audiovisualizerStyle.circularBarColors[0], audiovisualizerStyle.circularBarColors[1], j / freqBands);
                    bar.style.backgroundColor = `rgb(${color[0]}, ${color[1]}, ${color[2]})`;
                }
                bar.style.opacity = `${audiovisualizerStyle.circularaudiovisualizerOpacity}%`;
                bar.id = `${i},${j}`;

                barsContainer.appendChild(bar);
                barFreqs[i * freqBands + j] = j;
                bars[i * freqBands + (freqBands-1 - j)] = bar;
            }
        }
    }
    container.appendChild(barsContainer)
    document.body.appendChild(container);

    // properties:

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
}

// Register the audio listener provided by Wallpaper Engine.
window.wallpaperRegisterAudioListener(wallpaperAudioListener);

// setup the date time box thingy:
// hover(document.getElementById('day'), e => {
//     showFullDay = true;
//     updateTime();
//     console.log("mouse enter");
// }, e => {
//     setTimeout(() =>{
//         showFullDay = false;
//         updateTime();
//     }, 1000);

// })


/* ---------------- PROPERTIES ---------------- */
let audiovisualizerStyle = {
    x: 0,
    y: 0,
    width: "0%",
    color: null,
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
setup();

// Register the propertyListener
window.wallpaperPropertyListener = {
    applyUserProperties: function (properties) {
        let prop = properties;
        dateTimeProperties(prop);


        if (properties.backgroundimg) { // the background image
            let imageElement = document.getElementById('backgroundImg');
            imageElement.src = 'file:///' + properties.backgroundimg.value;
        }
        // ------------------------------ AudioVis ------------------------------\\
        if (properties.circluaraudiovisualizer){
            circularBar = properties.circluaraudiovisualizer.value;
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
        if (properties.timebasedcircularaudiovisualizer){
            timedAudioVis = properties.timebasedcircularaudiovisualizer.value;
        }
        if (properties.circularvisfreqbands){
            freqBands = properties.circularvisfreqbands.value;
            setup();
        }
        // circular audio visualizer
        if (properties.circularaudiovisualizerrainbow){
            audiovisualizerStyle.circularBarRainbow = properties.circularaudiovisualizerrainbow.value;
            // console.log(audiovisualizerStyle);
            updateCircularAudioVisColors();
        }
        if (properties.circularaudiovisualizercolor1){
            audiovisualizerStyle.circularBarColors[0] = toCSSrgb(properties.circularaudiovisualizercolor1.value);
            updateCircularAudioVisColors();
        }
        if (properties.circularaudiovisualizercolor2){
            audiovisualizerStyle.circularBarColors[1] = toCSSrgb(properties.circularaudiovisualizercolor2.value);
            updateCircularAudioVisColors();
        }
        if (properties.circularaudiovisualizeropacity){
            audiovisualizerStyle.circularaudiovisualizerOpacity = properties.circularaudiovisualizeropacity.value;
            updateCircularAudioVisColors();
        }
        // ---------- Bars ----------
        if (properties.audiobarcolor) { // the color of the audio bars
            $('.bar').css("background-color", `rgb(${toCSSrgb(properties.audiobarcolor.value)})`);
            audiovisualizerStyle.color =`rgb(${toCSSrgb(properties.audiobarcolor.value)})`
        }
        if (properties.bargap) {
            $('#barsContainer').css("gap", `${properties.bargap.value / 10}%`);
            audiovisualizerStyle.bargap = `${properties.bargap.value / 10}%`
        }
        if (properties.curved) {
            $('.bar').css("border-radius", `${properties.curved.value ? '100%' : '0%'}`);
            audiovisualizerStyle.curved = `${properties.curved.value ? '100%' : '0%'}`;
        }

        // ---------- Border ----------
        if (properties.border) {
            audiovisualizerStyle.borderActive = properties.border.value
            changeBorder(audiovisualizerStyle.borderActive);
        }
        if (properties.bordersize) {
            audiovisualizerStyle.borderSize = properties.bordersize.value;
            changeBorder(audiovisualizerStyle.borderActive);
        }
        if (properties.bordercolor) {
            audiovisualizerStyle.borderColor = toCSSrgb(properties.borderColor.value);
            changeBorder(audiovisualizerStyle.borderActive);
        }

        // ---------- Shadow ----------
        if (properties.shadow) {
            audiovisualizerStyle.shadowActive = properties.shadow.value
            changeShadow(audiovisualizerStyle.shadowActive);
        }
        if (properties.shadowcolor) {
            audiovisualizerStyle.shadowColor = toCSSrgb(properties.shadowcolor.value);
            changeShadow(audiovisualizerStyle.shadowActive);
        }
        if (properties.shadowspread) {
            audiovisualizerStyle.shadowSpread = properties.shadowspread.value;
            changeShadow(audiovisualizerStyle.shadowActive);
        }
    },
};

function updateCircularAudioVisColors(){
    if(audiovisualizerStyle.circularBarRainbow){
        for (let i = 0; i < amountOfBars; i++) {
            for (j = freqBands-1; j >= 0; j--) {
                document.getElementById(`${i},${j}`).style.backgroundColor = `hsl(${j / freqBands * 360}, 80%, 50%)`;
                document.getElementById(`${i},${j}`).style.opacity = `${audiovisualizerStyle.circularaudiovisualizerOpacity}%`;
            }
        }
    } else {
        for (let i = 0; i < amountOfBars; i++) {
            for (j = freqBands-1; j >= 0; j--) {
                let color = lerpColor(audiovisualizerStyle.circularBarColors[0], audiovisualizerStyle.circularBarColors[1], j / freqBands);
                document.getElementById(`${i},${j}`).style.backgroundColor = `rgb(${color[0]}, ${color[1]}, ${color[2]})`;
                document.getElementById(`${i},${j}`).style.opacity = `${audiovisualizerStyle.circularaudiovisualizerOpacity}%`;
            }
        }
    }
}

function changeSizeDateTime(newWidth) {
    $('.dateTimeContainer').css('width', `${newWidth}%`);
    $('.dateTimeContainer').css('height', `${newWidth / 65.0 * 20.0}vw`);
    $('#day').css('font-size', `${newWidth / 65.0 * 14.0}vw`);
    $('#time').css('font-size', `${newWidth / 65.0 * 7.0}vw`);
    $('#date').css('font-size', `${newWidth / 65.0 * 3.0}vw`);
}

function changeShadow(on) {
    if (on) $('.bar').css("box-shadow", `0px 0px 6px ${audiovisualizerStyle.shadowSpread}px rgb(${audiovisualizerStyle.shadowColor})`);
    else $('.bar').css("box-shadow", `none`);
}

function changeBorder(on) {
    if (on) $('.bar').css("border", `solid rgb(${audiovisualizerStyle.borderColor}) ${audiovisualizerStyle.borderSize}px`);
    else $('.bar').css("border", `none`);
}

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

function hover(element, enter, leave) {
    element.addEventListener('mouseenter', enter)
    element.addEventListener('mouseleave', leave)
}