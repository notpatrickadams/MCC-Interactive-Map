//Sleep function
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function fix_dpi() {
    let dpi = window.devicePixelRatio;
    let c = document.getElementById("mapCanvas");
    let ctx = c.getContext("2d");
    //get CSS height
    //the + prefix casts it to an integer
    //the slice method gets rid of "px"
    let style_height = +getComputedStyle(c).getPropertyValue("height").slice(0, -2);
    //get CSS width
    let style_width = +getComputedStyle(c).getPropertyValue("width").slice(0, -2);//scale the canvas
    c.setAttribute('height', style_height * dpi);
    c.setAttribute('width', style_width * dpi);
}

//Loads coordinates.json
//Found solution here: https://codepen.io/KryptoniteDove/post/load-json-file-locally-using-pure-javascript
function loadJSON(callback) {   
    var xobj = new XMLHttpRequest();
    xobj.overrideMimeType("application/json");
    xobj.open('GET', '../assets/coordinates.json', true); // Replace 'my_data' with the path to your file
    xobj.onreadystatechange = function () {
            if (xobj.readyState == 4 && xobj.status == "200") {
                // Required use of an anonymous callback as .open will NOT return a value but simply returns undefined in asynchronous mode
                callback(xobj.responseText);
            }
    };
    xobj.send(null);  
}

function mapStroke(room) {
    fix_dpi();
    let c = document.getElementById("mapCanvas");
    let ctx = c.getContext("2d");

    var vw = 1400*0.01;
    var vh = 800*0.01;
    var i = 0;
    var offset = 5;

    ctx.lineWidth = 5;

    ctx.strokeStyle = "#29B4FF"
    ctx.fillStyle = "#FF0000";

    if (room.toString().startsWith("1")) {
        var floor = "floor1";
        maplevel(1);
    }
    else if (room.toString().startsWith("2")) {
        var floor = "floor2";
        maplevel(2);
    }
    else if (room.toString().startsWith("3")) {
        var floor = "floor3";
        maplevel(3);
    }
    else {
        roomError();
    }

    var passthrough = [];

    loadJSON(function(response) {
        // Parse JSON string into object
        var json_data = JSON.parse(response);
        for (var r in json_data["rooms"][floor]) {

            if (json_data["rooms"][floor][room.toString()] == undefined) {
                roomError();
            }
            else {
                document.getElementById("room").innerHTML="<p>" + "Manchester Main Building " + room + "</p>";
            
                for (var co in json_data["rooms"][floor][room.toString()]) {            
                    //If less than two coordinates, which there should be two or less, fill in the point and output the coordinates of the point(s)
                    if (i < 2) {
                        coord = json_data["rooms"][floor][room.toString()][co];
                        ctx.fillRect(coord[0], coord[1], 15, 15);
                        passthrough.push(coord);
                    }
                    i++;
                }
            }
        }
    });
}

function mapClear() {
    fix_dpi();
    let c = document.getElementById("mapCanvas");
    let ctx = c.getContext("2d");
    ctx.clearRect(0, 0, c.width, c.height);
}

/*
    Find nearest hallway point or check if x or y value of the room is between the two points of the hallway
    If it's between the two points of the hallway, it will either draw a line vertically if the hall is horizontal by just changing the y value
    or draw a line horizontally if the hall is vertical by changing the value of x.

    Then it will find the next closest hallway and draw hall lines until it is close enough to the start point.

    This will be worked on next.
*/

function findPath(source, dest) {
    //s = source, d = dest
    var xs = source[0];
    var ys = source[1];
    var xd = dest[0];
    var yd = dest[1];

    loadJSON(function(response) {
        // Parse JSON string into object
        var json_data = JSON.parse(response);
        for (var r in json_data["rooms"][floor]) {
            for (var co in json_data["rooms"][floor][room.toString()]) {
                coord = json_data["rooms"][floor][room.toString()][co];
            }
        }
    });
    //Distance between start point (varies) and the closest point in a hallway
    var distance = Math.sqrt((Math.pow(xd - xs), 2) + Math.pow((yd - ys), 2));

    if ((xd - xs) < (yd - ys)) {
        var closestAxis = "x";
    }
    else {
        var closestAxis = "y";
    }

}