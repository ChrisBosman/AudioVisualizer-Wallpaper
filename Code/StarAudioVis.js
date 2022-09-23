// Firstoff this audio visualizer has been made by Chris Bosman.
// I (Frank Bosman) has addapted it a bit to fit this program with permission of Chris.

// start it via :        setupStarAudioVis()
// update the audio via: starAudioVisAudioListener(audioArray (unedited**)) 
// terminate it via:     terminateStarAudioVis()
// properties:           starAudioVisProperties(properties)

// TODO
// implement presets via Object.keys(obj). so it doesn't override properties it wouldn't have changed, like position

const ShapeKinds = {
    Chaotic: 0,
    Polygram: 1,
}
const Presets = {
    "Default": {
        enabled: true,
    
        xOffset: 0.5,
        yOffset: 0.65,
    
        shapeKind : ShapeKinds.Chaotic,
        points: 19,  // originaly shape
        fps : 0,
        runningaveragefiltersize: 9,
    
        innerRadius: 20,
        magintude: 180,  // the maximum ofset in px org: 'max offset'
        polygram_k : 1,
        plotTime : true,  // If the time axis should be ploted
        lineWidth : 1,
    },
    "Star": {
        enabled: true,
    
        xOffset: 0.5,
        yOffset: 0.65,
    
        shapeKind : ShapeKinds.Chaotic,
        points: 17,  // originaly shape
        fps : 0,
        runningaveragefiltersize: 9,
    
        innerRadius: 20,
        magintude: 180,  // the maximum ofset in px org: 'max offset'
        polygram_k : 1,
        plotTime : true,  // If the time axis should be ploted
        lineWidth : 1,
    },
    "Full": {
        enabled: true,
    
        xOffset: 0.5,
        yOffset: 0.65,
    
        shapeKind : ShapeKinds.Polygram,
        points: 17,  // originaly shape
        fps : 0,
        runningaveragefiltersize: 5,
    
        innerRadius: 100,
        magintude: 210,  // the maximum ofset in px org: 'max offset'
        polygram_k : 8,
        plotTime : true,  // If the time axis should be ploted
        lineWidth : 2,
    },
    "Star2": {
        enabled: true,
    
        xOffset: 0.5,
        yOffset: 0.65,
    
        shapeKind : ShapeKinds.Polygram,
        points: 8,  // originaly shape
        fps : 0,
        runningaveragefiltersize: 5,
    
        innerRadius: 36,
        magintude: 300,  // the maximum ofset in px org: 'max offset'
        polygram_k : 3,
        plotTime : true,  // If the time axis should be ploted
        lineWidth : 1.5,
    },
    "Relaxed": {
        enabled: true,
    
        xOffset: 0.5,
        yOffset: 0.65,
    
        shapeKind : ShapeKinds.Polygram,
        points: 25,
        fps : 0,
        runningaveragefiltersize: 15,
    
        innerRadius: 70,
        magintude: 210,
        polygram_k : 8,
        plotTime : true,
        lineWidth : 1.5,
    },
    "Relaxed2": {
        enabled: true,
    
        xOffset: 0.5,
        yOffset: 0.65,
    
        shapeKind : ShapeKinds.Chaotic,
        points: 59,
        fps : 0,
        runningaveragefiltersize: 15,
    
        innerRadius: 51,
        magintude: 450,
        polygram_k : 0,
        plotTime : true,
        lineWidth : 6,
    },
    "ComicExplosion": {
        enabled: true,
    
        xOffset: 0.5,
        yOffset: 0.65,
    
        shapeKind : ShapeKinds.Chaotic,
        points: 24,
        fps : 0,
        runningaveragefiltersize: 11,
    
        innerRadius: 0,
        magintude: 420,
        polygram_k : 0,
        plotTime : true,
        lineWidth : 28.8,
    },
}

let idleAnimation = false;

let customModeEnabled = false;
let starVisCustomSettings = {
    enabled: true,
    
    xOffset: 0.5,
    yOffset: 0.65,

    shapeKind : ShapeKinds.Chaotic,
    points: 19,  // originaly shape
    fps : 0,
    runningaveragefiltersize: 9,

    innerRadius: 20,
    magintude: 180,  // the maximum ofset in px org: 'max offset'
    polygram_k : 1,
    plotTime : true,  // If the time axis should be ploted
    lineWidth : 1,
}

//The class for each of the frequencies
class FreqBall{
    constructor(color, maxPoints){
        this.data = [];
        this.radius =  10;  
        this.maxOffset = 100;
        this.color = color;
        this.maxPoints = maxPoints;
        this.q = 0; //amount of points for the running average filter (a.k.a moving average)
        this.xOffset = 0.5;
        this.yOffset = 0.5;
        for(let i=0; i<maxPoints; i++)
            this.data[i] = 0;
    }

    addData(newData){
        // Decrease the amplitude of all past points
       for(let i = 0; i < this.data.length; i++){
            this.data[i] *= 0.999;
        }
        //Make sure the data array is not to long
        if(this.data.length >= this.maxPoints+this.q)
            this.data.shift();
        this.data[this.maxPoints+this.q-1] = newData;
    }

    plot(context, width, height){
        context.beginPath();
        let prefactor = 0;
        switch (starAudioVisSettings.shapeKind){
            case ShapeKinds.Chaotic:
                prefactor = this.maxPoints/(Math.PI*2);  // yes, it is the other way around on purpose
                break;
            case ShapeKinds.Polygram:
                prefactor = starAudioVisSettings.polygram_k * 2 * Math.PI/this.maxPoints;
                break;
            default:
                prefactor = this.maxPoints/(Math.PI*2);  // yes, it is the other way around on purpose
                break;
        }
        
        for (let i = 0; i < this.data.length-this.q; i++){
            let x = width * this.xOffset  +  (this.radius + this.runningAverage(i) * this.maxOffset) * Math.cos(i*prefactor);
            let y = height * this.yOffset  +  (this.radius + this.runningAverage(i) * this.maxOffset) * Math.sin(i*prefactor);
            if(i == 0)
                context.moveTo(x,y);
            else
                context.lineTo(x,y);
        }
        if(starAudioVisSettings.shapeKind == ShapeKinds.Chaotic)
            context.moveTo(width*this.xOffset,height*this.yOffset);
        
        context.closePath();
        context.strokeStyle=`hsl(${this.color},100%,30%)`;
        context.stroke();
    }
    
    // Take the average of the q last points
    runningAverage(index){
        if (starAudioVisSettings.plotTime){  // Normal
            if (this.q > 0)
                return mean(this.data,index,index+this.q);
            else
                return this.data[index];
        }
        else{ // Not time, so just the always look at the last index
            if (this.q > 0)
                return mean(this.data,this.data.length-1-this.q,this.data.length-1);
            else
                return this.data[this.data.length-1];
        }
    }

    changeMaxPoints(newValue){
        this.maxPoints = newValue;
    }
        
    changeInnerRadius(newValue){
        this.radius = newValue;
    }
    
    changeMaxOffset(newValue){
        this.maxOffset = newValue;
    }

    changeRunningAverageFilter(newValue){
        this.q = newValue;
    }
    
    changeXOffset(newValue){
        this.xOffset = newValue;
    }

    changeYOffset(newValue){
        this.yOffset = newValue;
    }
}


// basic functions
function sum(data, start, end) {
    let sum = 0;
    for (let i=start; i<end; i++)
      sum += data[i];
    return sum;
}
  
function mean(data, start, end) {
    return sum(data, start, end)/(end-start);
}

function draw(){
    // Request next animation frame if it is still running
    if (starAudioVisSettings.enabled)
        window.requestAnimationFrame(draw);

    // If there is a fps limit, than return if it is too fast
    if(starAudioVisSettings.fps > 0){
        let now = performance.now() / 1000;
        let dt = Math.min(now - lastTime,1);
        lastTime = now;
        fpsThreshold += dt;
        if (fpsThreshold < 1.0/starAudioVisSettings.fps)
            return;
        fpsThreshold -= 1.0/starAudioVisSettings.fps;  // Reset the fps counter
    }

    // Get canvas and context
    const canvas = document.getElementById("starVisRenderCanvas");
    
    // Set the width and the height for better resolution, because it has seperate resolutions
    canvas.height = window.innerHeight;
    canvas.width = window.innerWidth;

    if (canvas.getContext) { // If canvas is supported by the browser
        const context = canvas.getContext('2d');

        context.lineWidth = starAudioVisSettings.lineWidth;
        // Loop over all the frequency balls
        for (let i = 0; i<N; i++){
            balls[i].plot(context, canvas.width, canvas.height);
        }

    }else{
        console.error("Browers does not support HTML5 canvas");
    }
}

frequencies = [];
// Callback for when wallpaper engine sends the audio freqencies
function starAudioVisAudioListener(audioArray){
    // Combine both channels
    for (let i = 0; i < 64; i++){
        frequencies[i] = Math.min((audioArray[i] + audioArray[i+64])/2,1);  // Take the mean and limit the amplitude to 1
    }

    const d = new Date();

    // Divide the data over the frequency balls
    for (let i = balls.length-1; i >= 0; i--){
        if (!paused)
            balls[i].addData(mean(frequencies,Math.floor(i*64.0/balls.length),Math.floor((i+1)*64.0/balls.length)-1));
        else if (idleAnimation)
            balls[i].addData(Math.abs(perlin.get(i * 100, d.getMilliseconds() / 2000 + i * 1000)) * 15000 / (40 * (i*300)));
    }
    
    // test if there is music playing
    let maxValue = Math.max.apply(Math, audioArray);
    if (maxValue <= 0.00001 && !paused){
        paused = true;
        if (!idleAnimation)
            $('#starVisRenderCanvas').css('opacity', "0");
    } else if (maxValue >= 0.00001 && paused){
        paused = false;
        $('#starVisRenderCanvas').css('opacity', "100");
    }
}

// Variables
let N = 20;
let balls = [];
let lastTime = performance.now() / 1000;
let fpsThreshold = 0;
let paused = false;

let starAudioVisSettings = {
    enabled: true,

    xOffset: 0.5,
    yOffset: 0.65,

    shapeKind : ShapeKinds.Chaotic,
    points: 19,  // originaly shape
    fps : 0,
    runningaveragefiltersize: 5,

    innerRadius: 20,
    magintude: 180,  // the maximum ofset in px org: 'max offset'
    polygram_k : 1,
    plotTime : true,  // If the time axis should be ploted
    lineWidth : 1,
};

// Setup
function setupStarAudioVis() {
    $('#starVisRenderCanvas').css('opacity', "100");
    paused = false;

    for (let i = 0; i < N; i++){
        balls[i]  = new FreqBall(i*360.0/(N-1), starAudioVisSettings.points);
        // console.log(i*360.0/N);
    }

    starAudioVisSettings.enabled = true;
    updateSettings();

    draw();
}

function terminateStarAudioVis(){
    $('#starVisRenderCanvas').css('opacity', "0");
    starAudioVisSettings.enabled = false;
}

function updateSettings(){
    for(let i=0; i < balls.length; i++){
        balls[i].changeMaxPoints(starAudioVisSettings.points);                              // Points / Shape
        balls[i].changeInnerRadius(starAudioVisSettings.innerRadius);                       // Inner radius:
        balls[i].changeMaxOffset(starAudioVisSettings.magintude);                           // Magnitude / max offset
        balls[i].changeRunningAverageFilter(starAudioVisSettings.runningaveragefiltersize); // Running Avg filter size
        balls[i].changeXOffset(starAudioVisSettings.xOffset);                          // xOffset TODO
        balls[i].changeYOffset(starAudioVisSettings.yOffset);                         // yOffset TODO
    }
}

// TODO fix this
// Set up the properties function
function starAudioVisProperties(properties) {
    
    //presets
    if (properties.staraudiopresets){
        if (properties.staraudiopresets.value == 0){ //custom
            starAudioVisSettings = starVisCustomSettings;
            customModeEnabled = true;
        } else {
            starAudioVisSettings = Presets[properties.staraudiopresets.value];
            customModeEnabled = false;
            // console.log(properties.staraudiopresets.value);
            // console.log(Presets[properties.staraudiopresets.value]);
            // console.log(starAudioVisSettings);
            // console.log(Presets);
        }
        updateSettings();
    }

    // offsets
    if (properties.audiovisualizeroffsetx) {
        starAudioVisSettings.xOffset = properties.audiovisualizeroffsetx.value / 100.0 + 0.5;
        starVisCustomSettings.xOffset = properties.audiovisualizeroffsetx.value / 100.0 + 0.5;
        
        for(let i=0; i < balls.length; i++)
            balls[i].changeXOffset(properties.audiovisualizeroffsetx.value / 100.0 + 0.5);
    }
    if (properties.audiovisualizeroffsety) {
        starAudioVisSettings.yOffset = properties.audiovisualizeroffsety.value / 100.0 + 0.5;
        starVisCustomSettings.yOffset = properties.audiovisualizeroffsety.value / 100.0 + 0.5;

        for(let i=0; i < balls.length; i++)
            balls[i].changeYOffset(properties.audiovisualizeroffsety.value / 100.0 + 0.5);
    }

    if (properties.svidleanimation){
        idleAnimation = properties.svidleanimation.value;
        if (!idleAnimation)
            $('#starVisRenderCanvas').css('opacity', "0");
    }

    // advance settings
    if (properties.svshapekind){
        if (properties.svshapekind.value == 0) {
            if (customModeEnabled)
                starAudioVisSettings.shapeKind = ShapeKinds.Chaotic;
            starVisCustomSettings.shapeKind = ShapeKinds.Chaotic;
        } else if (properties.svshapekind.value == 1) {
            if (customModeEnabled)
                starAudioVisSettings.shapeKind = ShapeKinds.Polygram;
            starVisCustomSettings.shapeKind = ShapeKinds.Polygram;
        }
    }
    if (properties.svpoints){
        if (customModeEnabled){
            starAudioVisSettings.points = properties.svpoints.value;
            for(let i=0; i < balls.length; i++)
                balls[i].changeMaxPoints(properties.svpoints.value);
        }
        starVisCustomSettings.points = properties.svpoints.value;
        
    }
    if (properties.vsfps){
        if (customModeEnabled)
            starAudioVisSettings.fps = properties.vsfps.value;
        starVisCustomSettings.fps = properties.vsfps.value;
    }
    if (properties.svrunningaveragefiltersize){
        if (customModeEnabled){
            starAudioVisSettings.runningaveragefiltersize = properties.svrunningaveragefiltersize.value;
            for(let i=0; i < balls.length; i++)
                balls[i].changeRunningAverageFilter(properties.svrunningaveragefiltersize.value);
        }
        starVisCustomSettings.runningaveragefiltersize = properties.svrunningaveragefiltersize.value;
    }
    if (properties.svinnerradius){
        if (customModeEnabled){
            starAudioVisSettings.innerRadius = properties.svinnerradius.value;
        
            for(let i=0; i < balls.length; i++)
                balls[i].changeInnerRadius(properties.svinnerradius.value);
        }
        starVisCustomSettings.innerRadius = properties.svinnerradius.value;
    }
    if (properties.svmagintude){
        if (customModeEnabled){
            starAudioVisSettings.magintude = properties.svmagintude.value;
            for(let i=0; i < balls.length; i++)
                balls[i].changeMaxOffset(properties.svmagintude.value);
        }
        starVisCustomSettings.magintude = properties.svmagintude.value;
    }
    if (properties.svpolygramk){
        if (customModeEnabled)
            starAudioVisSettings.polygram_k = properties.svpolygramk.value;
        starVisCustomSettings.polygram_k = properties.svpolygramk.value;
    }
    if (properties.svplottimedimension){
        if (customModeEnabled)
            starAudioVisSettings.plotTime = properties.svplottimedimension.value;
        starVisCustomSettings.plotTime = properties.svplottimedimension.value;
    }
    if (properties.svlinewidth){
        if (customModeEnabled)
            starAudioVisSettings.lineWidth = properties.svlinewidth.value;
        starVisCustomSettings.lineWidth = properties.svlinewidth.value;
    }
}
