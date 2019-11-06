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
                    while (i < 0) {
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

function start(room) {
    var passthrough = [];

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

    loadJSON(function(response) {
        var i = 0;
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
                        prepMap([475, 300], [coord[0], coord[1]], [coord[0], coord[1]], "floor2", 0);
                    }
                    i++;
                }
            }
        }
    });
    

}

//This is so fix_dpi() isn't called multiple times
function prepMap(start, current, finish, floor, r) {
    fix_dpi();
    findPath(start, current, finish, floor, r);
}

function findPath(start, current, finish, floor, r) {
    //s = source, d = dest
    var xs = start[0];
    var ys = start[1];
    var xc = current[0];
    var yc = current[1];
    var xf = finish[0];
    var yf = finish[1];

    var distance = Math.sqrt((Math.pow(xs - xc), 2) + Math.pow((ys - yc), 2));
    //var distance = 10000;

    loadJSON(function(response) {
        // Parse JSON string into object
        var closestHall;
        var json_data = JSON.parse(response);
        for (var hallSeg in json_data["hallsegments"][floor]) {
            for (var hallEndpoint in json_data["hallsegments"][floor][hallSeg]) {
                var h = json_data["hallsegments"][floor][hallSeg][hallEndpoint];
            //Gets distance between every hallway endpoint and current point
            //If the distance is less than the last lowest distance, the new one is saved as "distance" and variable "hallCoord" is created
                if ((Math.sqrt((Math.pow(h[0] - xc), 2) + Math.pow((h[1] - yc), 2))) < distance) {
                    distance = Math.sqrt((Math.pow(h[0] - xc), 2) + Math.pow((h[1] - yc), 2));
                    var hallCoord = [h[0], h[1]];
                }
            }
        
            //coord = json_data["hallsegments"][floor][h];
        }

        /*

        This is where the canvas is defined and drawn on
        
        */

        let c = document.getElementById("mapCanvas");
        let ctx = c.getContext("2d");
        ctx.lineWidth = 5;
        ctx.fillStyle = "#FF0000";

        //Draw rectangle around the finish point
        if (r == 0) {
            ctx.fillRect(finish[0], finish[1], 15, 15);
        }
        
        //If the distance between the current point and the start point is less than the current distance, just skip to the end.
        //CHANGE THIS 30 AND FIGURE OUT WHAT's GOING WRONG
        //if ((Math.sqrt((Math.pow(xs - xc), 2) + Math.pow((ys - yc), 2))) < distance) {
        if (r > 20) {
            ctx.moveTo(xc, yc);
            ctx.lineTo(xs, ys);
            ctx.stroke();
            console.log("Finished.")
        }
        else {
            //Change x value to match hallway
            if (Math.abs(xf - hallCoord[0]) < Math.abs(yf - hallCoord[1])) {
                var temp = [hallCoord[0], finish[1]];
                ctx.moveTo(finish[0], finish[1]);
                ctx.lineTo(temp[0], temp[1]);
                ctx.stroke();
            }
            //Change y value to match hallway
            else {
                var temp = [finish[0], hallCoord[1]];
                ctx.moveTo(finish[0], finish[1]);
                ctx.lineTo(temp[0], temp[1]);
                ctx.stroke();
            }

            ctx.moveTo(temp[0], temp[1]);
            ctx.lineTo(hallCoord[0], hallCoord[1]);
            ctx.stroke();
            
            console.log(`Line to ${hallCoord[0]}, ${hallCoord[1]}`);

            findPath(start, hallCoord, hallCoord, floor, r + 1);
        }

        

    });
    //Distance between start point (varies) and the closest point in a hallway
    

     /*
    //Replace 0,0 with new current coordinates
    findPath(start, [0,0], finish, floor);
    */
}