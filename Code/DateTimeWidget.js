let DateTimeStyle = {
    showFullDay: false,
}


// update time and date
updateTime();
setInterval(updateTime, 10000);
function updateTime() {
    let currentDate = new Date();
    // currentDate.setDate(7);

    let cDay = currentDate.getDate();
    let cMonth = currentDate.toLocaleString("en-US", { month: "short" });//.getMonth() + 1;
    let cYear = currentDate.getFullYear();

    let time = `${currentDate.getHours() < 10 ? '0' + currentDate.getHours() : currentDate.getHours()}:${currentDate.getMinutes() < 10 ? '0' + currentDate.getMinutes() : currentDate.getMinutes()}`;

    var dt = moment(currentDate, "YYYY-MM-DD HH:mm:ss");

    $('#time').text(time);
    $('#date').text(`${cDay} ${cMonth} ${cYear}`);
    if (DateTimeStyle.showFullDay) $('#day').text(`${dt.format('dddd')}`);
    else $('#day').text(`${dt.format('dddd')}`.substring(0, 3));
}

function dateTimeProperties(prop) {
    // ------------------------------ Date and Time ------------------------------\\
    if (prop.date) {        
        switch (prop.date.value) {
            case '1':
                $('.flipClock').removeClass('dateActive');
                $('.dateTimeContainer').addClass('dateActive');
                break;
            case '2':
                $('.dateTimeContainer').removeClass('dateActive');
                $('.flipClock').addClass('dateActive');
                break;
        
            default:
                $('.dateTimeContainer').removeClass('dateActive');
                $('.flipClock').removeClass('dateActive');
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