let DateTimeStyle = {
    showFullDay: false,
}
let activeDateWidget = 1;


// update time and date
updateTime();
setInterval(updateTime, 1000);
function updateTime() {
    let currentDate = new Date();
    
    if (activeDateWidget === 1){
        let cDay = currentDate.getDate();
        let cMonth = currentDate.toLocaleString("en-US", { month: "short" });//.getMonth() + 1;
        let cYear = currentDate.getFullYear();

        let time = `${currentDate.getHours() < 10 ? '0' + currentDate.getHours() : currentDate.getHours()}:${currentDate.getMinutes() < 10 ? '0' + currentDate.getMinutes() : currentDate.getMinutes()}`;

        var dt = moment(currentDate, "YYYY-MM-DD HH:mm:ss");

        $('#time').text(time);
        $('#date').text(`${cDay} ${cMonth} ${cYear}`);
        if (DateTimeStyle.showFullDay) $('#day').text(`${dt.format('dddd')}`);
        else $('#day').text(`${dt.format('dddd')}`.substring(0, 3));
    } else if (activeDateWidget === 2){
        const date = new Date()
        const seconds = date.getSeconds().toString();
        const minutes = date.getMinutes().toString();
        const hours = date.getHours().toString();
        
        updateFlipperSet('flipper5', 'flipper6', seconds);
        updateFlipperSet('flipper3', 'flipper4', minutes);
        updateFlipperSet('flipper1', 'flipper2', hours);
    }
}

function dateTimeProperties(prop) {
    // ------------------------------ Date and Time ------------------------------\\
    if (prop.date) {        
        switch (prop.date.value) {
            case '1':
                $('.flipClock').removeClass('dateActive');
                $('.dateTimeContainer').addClass('dateActive');
                activeDateWidget = 1
                break;
            case '2':
                $('.dateTimeContainer').removeClass('dateActive');
                $('.flipClock').addClass('dateActive');
                activeDateWidget = 2
                break;
        
            default:
                $('.dateTimeContainer').removeClass('dateActive');
                $('.flipClock').removeClass('dateActive');
                activeDateWidget = 0
                break;
        }

    }
    if (prop.dateoffsetx) {
        $('.timeCenterContainer').css('left', `${prop.dateoffsetx.value}%`);
    }
    if (prop.dateoffsety) {
        $('.timeCenterContainer').css('top', `${prop.dateoffsety.value}%`);
    }
    if (prop.datesize) {
        changeSizeDateTime(prop.datesize.value);
    }
    if (prop.dateshowseconds){
        $('.dateFlipperSeconds').css('display', `${prop.dateshowseconds.value ? 'flex' : 'none'}`);
    }
}

function changeSizeDateTime(newWidth) {
    // default date time
    $('.dateTimeContainer').css('width', `${newWidth}%`);
    $('.dateTimeContainer').css('height', `${newWidth / 65.0 * 20.0}vw`);
    $('#day').css('font-size', `${newWidth / 65.0 * 14.0}vw`);
    $('#time').css('font-size', `${newWidth / 65.0 * 7.0}vw`);
    $('#date').css('font-size', `${newWidth / 65.0 * 3.0}vw`);

    // flipper
    $('.flipClock').css('transform', `scale(${(newWidth + 30) / 100})`);
}


/* -------- Extra flipper clock functions -------- */
/**
 * This function can be used to update two flipper at once.
 * It takes a string of 1 or 2 characters long, if it is 1 character long the first flipper will display 0 and the second will display the value.
 * If the string is 2 characters long it will split it over the two flippers.
 * 
 * @param {String} id The *html* id of the first flipper
 * @param {String} id2 The *html* id of the second flipper
 * @param {String} value The new value represented in a _1_ or _2_ *Character(s)* *String*
 */
function updateFlipperSet(id, id2, value){
    const ones = value.charAt(value.length -1);
    const tenths = value.length > 1 ? value.charAt(0) : 0;

    if (tenths != getFlipperVal(id))
        changeFlipperNum(id, tenths);
    if (ones != getFlipperVal(id2))
        changeFlipperNum(id2, ones);
}

/**
 * Sets the given flipper to a new value.
 * And animate a flip to the new value from the old value
 * @param {String} id The *html* id of the flipper
 * @param {String|int} num a *String* or *int* of the new value
 */
function changeFlipperNum(id, num){
    const flipper = document.getElementById(id);

    const flipperTop = flipper.children[1];
    const flipperBottom = flipper.lastElementChild;
    const flipperNewTop = flipper.firstElementChild;
    const flipperNewBottom = flipper.children[2];
    
    flipperNewTop.firstElementChild.innerText = num;
    flipperTop.classList.add('flipping');
    flipperBottom.classList.remove('flipping');

    flipperNewBottom.classList.add('flipping');
    setTimeout(() => {
        flipperTop.firstElementChild.innerText = num;
        flipperTop.classList.remove('flipping');
        flipperBottom.classList.add('flipping');
        
        flipperBottom.firstElementChild.innerText = num;
    }, 250);
    setTimeout(() => {
        flipperNewBottom.firstElementChild.innerText = num
        flipperNewBottom.classList.remove('flipping');
    }, 500);
}
/**
 * Returns the current value of the flipper
 * 
 * @param {String} id The *html* id of the flipper
 * @returns a *String* of the value
 */
function getFlipperVal(id){
    const flipperNewTop = document.getElementById(id).firstElementChild;
    return flipperNewTop.firstElementChild.innerText;
}