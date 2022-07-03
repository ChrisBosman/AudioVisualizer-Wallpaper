let audioCanvas = null;
let audioCanvasCtx = null;
const marinX = 50;
const marinY = 100;
const barDist = 10;
const amountOfBars = 10;

function wallpaperAudioListener(audioArray) {
    // Clear the canvas and set it to black
    // audioCanvasCtx.fillStyle = 'rgb(0,0,0)';
    // audioCanvasCtx.fillRect(0, 0, audioCanvas.width, audioCanvas.height);
    audioCanvasCtx.clearRect(0, 0, audioCanvas.width, audioCanvas.height);

    //half the dataset by fusion column together:
    let audioList = [];
    let index = 0;
    for (var i = 2; i < audioArray.length; i += 3) {
        audioList[index] = (Math.min(audioArray[i], 1) + Math.min(audioArray[i-1], 1) + Math.min(audioArray[i-2], 1))/2
        index++;
    }

    // document.getElementById("test").innerText = `audioList: ${audioList.length}`;

    var barWidth = Math.round(1.0 / (audioList.length/2) * (audioCanvas.width - marinX * 2)) - barDist;
    var halfCount = audioList.length / 2;

    let barHeight = (audioCanvas.height / amountOfBars) - barDist;

    // audioCanvasCtx.fillStyle = 'rgb(255,0,0)';
    // audioCanvasCtx.fillRect(barWidth * 1 + marinX, audioCanvas.height - marinY - (barHeight + barDist) * 1, barWidth, barHeight);
    // audioCanvasCtx.fillRect(barWidth * 2 + marinX, audioCanvas.height - marinY - (barHeight + barDist) * 1, barWidth, barHeight);

    // draw the bars
    for (var i = 0; i < audioList.length/2; ++i) {
        // let bars = Math.floor(Math.min(audioList[i], 1) * 15 * amountOfBars);
        let bars = Math.min(audioList[i], 1) * 15 * amountOfBars;
        // document.getElementById("test").innerText = `Bars:${bars}, ${audioList[i]*10}`;

        // audioCanvasCtx.fillStyle = 'rgb(255,0,0)';
        // audioCanvasCtx.fillRect(barWidth * i + marinX, audioCanvas.height - marinY - (barHeight + barDist) * 1, barWidth, barHeight * Math.min(audioList[i], 1) * 5);

        for (var h = 0; h < bars; h++){
            let color = lerpColor([230, 0, 0], [230, 115, 0], h / amountOfBars);
            audioCanvasCtx.fillStyle = `rgb(${color[0]}, ${color[1]}, ${color[2]})`;  // 'rgb(255,0,0)';
            audioCanvasCtx.fillRect((barWidth + barDist) * i + marinX, audioCanvas.height - marinY - barHeight - (barHeight + barDist) * (h), barWidth, barHeight);

            // if(h == bars - 1){
            //     document.getElementById("test").innerText = `h`;
            //     let color = [0,0,255];//lerpColor([230, 0, 0], [230, 115, 0], (h + 1) / amountOfBars);
            //     audioCanvasCtx.fillStyle = `rgb(${color[0]}, ${color[1]}, ${color[2]})`;  // 'rgb(255,0,0)';
            //     audioCanvasCtx.fillRect((barWidth + barDist) * i + marinX, audioCanvas.height - marinY - barHeight * (bars - Math.floor(bars)) - (barHeight + barDist) * (bars), barWidth, barHeight * (bars - Math.floor(bars)));
            // }
        }

        if(bars == 0){
            audioCanvasCtx.fillStyle = 'rgb(230,0,0)';
            audioCanvasCtx.fillRect((barWidth + barDist) * i + marinX, audioCanvas.height - marinY - barHeight * Math.max(Math.max(Math.min(audioList[i], 1), 0.0001) * amountOfBars, 1), barWidth, barHeight * Math.min(Math.max(Math.min(audioList[i], 1), 0.01) * amountOfBars, 1));
        }
    }



    // Begin with the left channel in red
    // audioCanvasCtx.fillStyle = 'rgb(255,0,0)';
    // Iterate over the first 64 array elements (0 - 63) for the left channel audio data
    // for (var i = 1; i < halfCount/2; i+=2) {
    //     // Create an audio bar with its hight depending on the audio volume level of the current frequency
    //     var height = audioCanvas.height * (Math.min(audioArray[i], 1) + Math.min(audioArray[i-1], 1))/2 * 3;
    //     audioCanvasCtx.fillRect(barWidth * i, audioCanvas.height - height - 50, barWidth*2, height);
    // }

    // // Now draw the right channel in blue
    // audioCanvasCtx.fillStyle = 'rgb(0,0,255)';
    // // Iterate over the last 64 array elements (64 - 127) for the right channel audio data
    // for (var i = halfCount; i < audioArray.length/2; ++i) {
    //     // Create an audio bar with its hight depending on the audio volume level
    //     // Using audioArray[191 - i] here to inverse the right channel for aesthetics
    //     var height = audioCanvas.height * Math.min(audioArray[191 - i], 1) * 3;
    //     audioCanvasCtx.fillRect(barWidth * i, audioCanvas.height - height - 50, barWidth, height);
    // }
}

// Get the audio canvas once the page has loaded
audioCanvas = document.getElementById('AudioCanvas');
// Setting internal canvas resolution to user screen resolution
// (CSS canvas size differs from internal canvas size)
audioCanvas.height = window.innerHeight;
audioCanvas.width = window.innerWidth;
// Get the 2D context of the canvas to draw on it in wallpaperAudioListener
audioCanvasCtx = audioCanvas.getContext('2d');

// audioCanvasCtx.fillStyle = 'rgb(0,0,0)';
// audioCanvasCtx.fillRect(0, 0, audioCanvas.width, audioCanvas.height);

// Register the audio listener provided by Wallpaper Engine.
window.wallpaperRegisterAudioListener(wallpaperAudioListener);

function lerpColor(c1, c2, factor){
    factor = Math.min(1, factor);
    factor = Math.max(0, factor);

    let colorOut = [];
    for(var i = 0; i < c1.length; ++i){
        colorOut[i] = (c1[i] * (1 - factor) + c2[i] * factor);
    }
    return colorOut;
}