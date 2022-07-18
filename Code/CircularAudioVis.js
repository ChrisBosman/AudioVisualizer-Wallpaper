let timedAudioArray = [];

function setupCircularAudioVisualizer(container, barsContainer){
    container.className = "circular-bar-container";
    barsContainer.className = "circular-bar-container2";

    for (let i = 0; i < AudioVisData.circularbars; i++) {
        for (j = AudioVisData.freqBands-1; j >= 0; j--) {
            let bar = document.createElement('div');
            bar.className = "circular-bar";

            bar.className = 'circular-bar';
            bar.style.transform = `rotate(${i / AudioVisData.circularbars * 360 + (1 / AudioVisData.circularbars * 360 )/ AudioVisData.freqBands * j}deg)` //Math.round(Math.random() * 360)}deg)`;
            bar.style.width = `${0}%`; //j * 1.5 + 10}%`;//`${Math.floor(Math.random() * 50 + 10)}%`;
            
            if (audiovisualizerStyle.circularBarRainbow){
                bar.style.backgroundColor = `hsl(${j / AudioVisData.freqBands * 360}, 80%, 50%)`;
            }
            else{
                let color = lerpColor(audiovisualizerStyle.circularBarColors[0], audiovisualizerStyle.circularBarColors[1], j / AudioVisData.freqBands);
                bar.style.backgroundColor = `rgb(${color[0]}, ${color[1]}, ${color[2]})`;
            }
            bar.style.opacity = `${audiovisualizerStyle.circularaudiovisualizerOpacity}%`;
            bar.id = `${i},${j}`;

            barsContainer.appendChild(bar);
            bars[i * AudioVisData.freqBands + (AudioVisData.freqBands-1 - j)] = bar;
        }
    }
}

function circularAudioVisualizer(audioList){//, bars, oldAudioArray, AudioVisData) {
    // get lower the amount of freq bands if needed
    if (AudioVisData.freqBands < 64){
        let filteredAudioList = []
        for (let i = 0; i < AudioVisData.freqBands; i++){
            let value = 0;
            // let value2 = 0;

            for (let j = 0; j < audioList.length / AudioVisData.freqBands; j++){
                value += audioList[i + j];
            }
            
            filteredAudioList[i] = value / (audioList.length / AudioVisData.freqBands)
        }
        audioList = filteredAudioList;
    }

    // circular visual ---------    
    // remember last audio's
    timedAudioArray.push(audioList);
    if (timedAudioArray.length > AudioVisData.circularbars * AudioVisData.timeMult) {
        timedAudioArray.shift();
    }

    for (let i = 0; i < AudioVisData.freqBands; i ++) {
        let heightValue = 0
        if (!AudioVisData.timedAudioVis){ // if time based audio vis
            oldAudioArray.forEach(oldAudio => {
                heightValue += Math.min(oldAudio[i], 1);
            });
            heightValue /= oldAudioArray.length;
            heightValue = Math.sqrt(heightValue);
            // heightValue /= 2;
            heightValue *= (parseFloat(audiovisualizerStyle.width.slice(0, -1)) - 15 ) / 100;
        }
        for(let j = 0; j < AudioVisData.circularbars; j++){
            if (AudioVisData.timedAudioVis && timedAudioArray.length > j * AudioVisData.timeMult){
                heightValue = 0;
                heightValue = timedAudioArray[Math.round(j * AudioVisData.timeMult)][i];
                heightValue = Math.sqrt(heightValue);
                // heightValue /= 2;
                heightValue *= (parseFloat(audiovisualizerStyle.width.slice(0, -1)) - 15 ) / 100;
            } else if (AudioVisData.timedAudioVis){
                heightValue = 0;
            }
            bars[i + (AudioVisData.circularbars - j -1) * AudioVisData.freqBands].style.width = `${heightValue * 100}%`;
        }
    }
}

function circularAudioVisualizerProperties(properties){
    if (properties.timebasedcircularaudiovisualizer){
        AudioVisData.timedAudioVis = properties.timebasedcircularaudiovisualizer.value;
    }
    if (properties.circularvisfreqbands){
        AudioVisData.freqBands = properties.circularvisfreqbands.value;
        setup();
    }
    if (properties.circularamountofbars){
        AudioVisData.circularbars = properties.circularamountofbars.value;
        setup();
    }
    if (properties.timemult){
        AudioVisData.timeMult = properties.timemult.value;
    }
    if (properties.circularaudiovisualizerrainbow){
        audiovisualizerStyle.circularBarRainbow = properties.circularaudiovisualizerrainbow.value;
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
}

function updateCircularAudioVisColors(){
    if(selectedAudioVis !== audioVisualizers.Circular) return;
    if(audiovisualizerStyle.circularBarRainbow){
        for (let i = 0; i < AudioVisData.circularbars; i++) {
            for (j = AudioVisData.freqBands-1; j >= 0; j--) {
                document.getElementById(`${i},${j}`).style.backgroundColor = `hsl(${j / AudioVisData.freqBands * 360}, 80%, 50%)`;
                document.getElementById(`${i},${j}`).style.opacity = `${audiovisualizerStyle.circularaudiovisualizerOpacity}%`;
            }
        }
    } else {
        for (let i = 0; i < AudioVisData.circularbars; i++) {
            for (j = AudioVisData.freqBands-1; j >= 0; j--) {
            // for (j = 0; j < AudioVisData.freqBands; j++) {
                let color = lerpColor(audiovisualizerStyle.circularBarColors[0], audiovisualizerStyle.circularBarColors[1], j / AudioVisData.freqBands);
                document.getElementById(`${i},${j}`).style.backgroundColor = `rgb(${color[0]}, ${color[1]}, ${color[2]})`;
                document.getElementById(`${i},${j}`).style.opacity = `${audiovisualizerStyle.circularaudiovisualizerOpacity}%`;
            }
        }
    }
}
