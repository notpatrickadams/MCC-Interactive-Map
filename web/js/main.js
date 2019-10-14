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
    eel.listclear()();
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

function roomError() {
    document.getElementById("room").innerHTML="<p>This class is online, the room is not in the main building, or the CRN/room does not exist.</p>";
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
                document.getElementById("room").innerHTML="<p>" + l + "</p>";
                mapStroke(l.replace("Manchester Main Building ", ""));
            }
            else {
                if (i > 0) {
                    roomError();
                }
            }
        }
        //If Room Number option is selected
        else {
            mapStroke(n);
        }
    }
}


function openMap() {
    document.getElementById("map-overlay").style.height = "100%";
}

function closeMap() {
    document.getElementById("map-overlay").style.height = "0%";
}
