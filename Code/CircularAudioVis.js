let timedAudioArray = [];

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
    // remember last audio's, but then for other purpose
    timedAudioArray.push(audioList);
    if (timedAudioArray.length > AudioVisData.circularbars) {
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
            if (AudioVisData.timedAudioVis && timedAudioArray.length > j){
                heightValue = 0;
                heightValue = timedAudioArray[j][i];
                heightValue = Math.sqrt(heightValue);
                // heightValue /= 2;
                heightValue *= (parseFloat(audiovisualizerStyle.width.slice(0, -1)) - 15 ) / 100;
            } else if (AudioVisData.timedAudioVis){
                heightValue = 0;
            }
            bars[i + j * AudioVisData.freqBands].style.width = `${heightValue * 100}%`;
        }
    }
}