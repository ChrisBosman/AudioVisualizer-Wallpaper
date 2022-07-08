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
    if (prop.date != null) {
        $('.timeCenterContainer').css('display', `${prop.date.value ? 'flex' : 'none'}`);
    }
    if (prop.dateoffsetx) {
        $('.timeCenterContainer').css('left', `${prop.dateoffsetx.value}%`);
    }
    if (prop.dateoffsety) {
        $('.timeCenterContainer').css('top', `${prop.dateoffsety.value}%`);
    }
    if (prop.datesize) {
        changeSizeDateTime(prop.datesize.value);
        // $('.dateTimeContainer').css('width', `${65 + properties.size.value - 50}%`);
    }
}