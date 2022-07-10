function setupHorizontalAudioVisualizer(container, barsContainer){
    container.className = "container";
    barsContainer.className = "bars-container";

    for (let i = 0; i < AudioVisData.horizontalBars; i++) {
        let bar = document.createElement('div');
        bar.className = "bar";

        bar.style.height = `0%`; // ${Math.round(Math.random() * 100)}%`

        barsContainer.appendChild(bar);
        bars[i] = bar;
    }
}

function horizontalAudioVisualizer(oldAudioArray){
    let audioArray;
    if (AudioVisData.horizontalBars < 128) {
        let newAudioArray = [];
        for (let j = 0; j < oldAudioArray.length; j++) {
            let newTimeAudioArray = []
            const audioArray = oldAudioArray[j];
            for (let i = 0; i < AudioVisData.horizontalBars; i++){
                let value = 0;
                let startIndex = Math.round(i * audioArray.length / AudioVisData.horizontalBars);
                let amount = (startIndex < i * audioArray.length / AudioVisData.horizontalBars ? Math.floor(audioArray.length / AudioVisData.horizontalBars) : Math.ceil(audioArray.length / AudioVisData.horizontalBars))
                for (let index = 0; index < amount; index++) {
                    if (index + startIndex < audioArray.length-1) //the last one is somethimes undifined;
                        value += audioArray[index + startIndex];
                }
                newTimeAudioArray[i] = value / amount;
            }
            newAudioArray[j] = newTimeAudioArray;
        }
        audioArray = newAudioArray;
    } else {
        audioArray = oldAudioArray;
    }


    for (let i = 0; i < bars.length; i++) {
        let heightValue = 0
        audioArray.forEach(oldAudio => {
            heightValue += Math.min(oldAudio[i], 1);
        });
        heightValue /= audioArray.length;
        bars[i].style.height = `${heightValue * 100}%`;
    }
}

function horizontalAudioVisualizerProperties(properties){
    // ---------- Bars ----------
    if (properties.amountofbars){
        AudioVisData.horizontalBars = properties.amountofbars.value;
        setup();
    }
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
}

function changeShadow(on) {
    if (on) $('.bar').css("box-shadow", `0px 0px 6px ${audiovisualizerStyle.shadowSpread}px rgb(${audiovisualizerStyle.shadowColor})`);
    else $('.bar').css("box-shadow", `none`);
}