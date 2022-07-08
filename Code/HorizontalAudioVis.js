function horizontalAudioVisualizer(oldAudioArray){
    for (let i = 0; i < bars.length; i++) {
        let heightValue = 0
        oldAudioArray.forEach(oldAudio => {
            heightValue += Math.min(oldAudio[i], 1);
        });
        heightValue /= oldAudioArray.length;
        bars[i].style.height = `${heightValue * 100}%`;
    }
}