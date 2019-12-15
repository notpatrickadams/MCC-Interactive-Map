//Eel functions from Python side

//Adds number to the list of other numbers (either room number or CRN)
function listadder(num){
    eel.listadd(num)();
}
//Deletes a number
function backspace() {
    eel.listpop()();
}
//Clears the number list
function listclear() {
    maplevel(2);
    eel.listclear()();
}

//Range function like in Python found from: https://dev.to/ycmjason/how-to-create-range-in-javascript-539i
function range(start, end) {
    var ans = [];
    for (let i = start; i <= end; i++) {
        ans.push(i);
    }
    return ans;
}

//Lets the user choose the floor map based on which button they clicked
function maplevel(floornum) {
    if (floornum == 1) {
        document.getElementById("mapCanvas").style.backgroundImage = "url('../assets/map/1.jpg')";
    }
    if (floornum == 2) {
        document.getElementById("mapCanvas").style.backgroundImage = "url('../assets/map/2.jpg')";
    }
    if (floornum == 3) {
        document.getElementById("mapCanvas").style.backgroundImage = "url('../assets/map/3.jpg')";
    }
        
}

//Displays the number list
async function listdisplay(){
    let n = await eel.numtostring()();
    document.getElementById("num").innerHTML=n;
}

function startNew(room) {
    //This takes any existing keyframes stored in the <head> tag and deletes them all.
    try {
        var styles = document.head.getElementsByTagName("style")
        for (var i in styles) {
            document.head.removeChild(styles[i]);
        }
    }
    //If there aren't any, don't do anything.
    catch {
        //pass
    }
    //Creates a new style to be added to the <head> later
    var style = document.createElement('style');
    style.type = 'text/css';
    
    //Checks if the room is in this array of room numbers
    var roomNumbers = ["100", "102", "106", "108", "110", "112", "115", "116", "117", "120", "122", "123", "126", "127", "129", "131", "133", "135", "137", "139", "141", "200", "201", "202", "203", "204", "205", "206", "207", "208", "209", "210", "211", "212", "215", "216", "217", "218", "219", "220", "222", "223", "224", "225", "226", "227", "228", "229", "230", "231", "232", "233", "234", "235", "236", "237", "238", "239", "240", "241", "243", "244", "245A", "245B", "246", "248", "249", "253", "255", "256", "257", "258", "259", "261", "263", "264", "265", "267", "268", "272", "274", "276", "277", "279", "281", "283", "285", "289", "291", "293", "295", "297", "299", "300", "302", "303", "304", "305", "306", "307", "308", "309", "310", "312", "314", "317", "318", "319", "321", "323", "325", "327"];
    if (!(roomNumbers.includes(room))) {
        document.getElementById("mapCanvas").style.backgroundImage = "url('../assets/map/error.jpg')";
        return;
    }

    //If it passed the first test and it starts with 1, create these keyframes between the room and the main floor.
    //Dynamic keyframe solution found here: https://stackoverflow.com/a/31868716
    else if (room.toString().startsWith("1")) {
        //These are the keyframes
        var keyframes = `\
        @keyframes mapFade {\
            0% { background-image: url('../assets/map/rooms/1and3Stairs.png'); }\
            50% {background-image: url('../assets/map/rooms/${room}.png'); }\
            100% {background-image: url('../assets/map/rooms/1and3Stairs.png'); }\
        }`;
        //This puts the keyframes in the style tag.
        style.innerHTML = keyframes;
        //Puts the style into the document head.
        document.head.appendChild(style);
        //Adds animation details to mapCanvas. "animation-name" is the name of the set of keyframes, "animation-duration" is the length of the animation, and "animation-iteration-count" is set to infinite so it loops forever.
        document.getElementById("mapCanvas").style.cssText = "animation-name: mapFade; animation-duration: 12s; animation-iteration-count: infinite;";
        return;
    }

    //If the room number starts with 2, create keyframes so it loads better.
    //By "loads better" I mean it doesn't look like it's struggling to load the image.
    else if (room.toString().startsWith("2")) {
        var keyframes = `\
        @keyframes mapFade {\
            0% {background-image: url('../assets/map/rooms/${room}.png'); }\
            100% {background-image: url('../assets/map/rooms/${room}.png'); }\
        }`;
        style.innerHTML = keyframes;
        document.head.appendChild(style);
        document.getElementById("mapCanvas").style.cssText = "animation-name: mapFade; animation-duration: 12s; animation-iteration-count: infinite;";
        return;
    }
    
   //Keyframes with directions to rooms 318, 321, 323, 325, and 327.
    else if (room == 318 || room == 321 || room == 323 || room == 325 || room == 327) {
        var keyframes = `\
        @keyframes mapFade {\
            0% { background-image: url('../assets/map/rooms/3floorLeftSide.png'); }\
            50% {background-image: url('../assets/map/rooms/${room}.png'); }\
            100% {background-image: url('../assets/map/rooms/3floorLeftSide.png'); }\
        }`;
        style.innerHTML = keyframes;
        document.head.appendChild(style);
        document.getElementById("mapCanvas").style.cssText = "animation-name: mapFade; animation-duration: 12s; animation-iteration-count: infinite;";
        return;
    }

    //If the room number is 317 or 319...
    else if (room == 317 || room == 319) {
        var keyframes = `\
        @keyframes mapFade {\
            0% { background-image: url('../assets/map/rooms/to317and319.png'); }\
            50% {background-image: url('../assets/map/rooms/${room}.png'); }\
            100% {background-image: url('../assets/map/rooms/to317and319.png'); }\
        }`;
        style.innerHTML = keyframes;
        document.head.appendChild(style);
        document.getElementById("mapCanvas").style.cssText = "animation-name: mapFade; animation-duration: 12s; animation-iteration-count: infinite;";
        return;
    }

    //If room starts with 3
    else if (room.toString().startsWith("3")) {
        var keyframes = `\
        @keyframes mapFade {\
            0% { background-image: url('../assets/map/rooms/1and3Stairs.png'); }\
            50% {background-image: url('../assets/map/rooms/${room}.png'); }\
            100% {background-image: url('../assets/map/rooms/1and3Stairs.png'); }\
        }`;
        style.innerHTML = keyframes;
        document.head.appendChild(style);
        document.getElementById("mapCanvas").style.cssText = "animation-name: mapFade; animation-duration: 12s; animation-iteration-count: infinite;";
        return;
    }

    //If for some reason everything else fails, show the error.
    else {
        document.getElementById("mapCanvas").style.backgroundImage = `url('../assets/map/error.jpg')`;
        return;
    }
}

//Eel.expose has Javascript functions return to Python side for use over there.
eel.expose(radiochoice);
async function radiochoice(){
    var radios = document.getElementsByName('radio');
    let n = await eel.numtostring()();
    for (var i = 0, length = radios.length; i < length; i++) {
        //If "CRN" is selected
        if (radios[1].checked) {
            let l = await eel.crntoroom(n)();
            l = l.toString();
            if (l.startsWith("Manchester Main Building")) {
                startNew(l.replace("Manchester Main Building ", ""));
            }
            else {
                if (i > 0) {
                    document.getElementById("mapCanvas").style.backgroundImage = `url('../assets/map/error.jpg')`;
                }
            }
        }
        //If Room Number option is selected
        else {
            startNew(n);
        }
    }
}