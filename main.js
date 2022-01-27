var canvas = document.getElementById("mouseCanvas")
var ctx = canvas.getContext("2d")
var gridCanvas = document.getElementById("gridCanvas")
var gridCtx = gridCanvas.getContext("2d")
gridCanvas.width = window.innerWidth
gridCanvas.height = window.innerHeight
canvas.width = window.innerWidth
canvas.height = window.innerHeight

var height = gridCanvas.height
var width = gridCanvas.width

var bounds = null;
var hasLoaded = false;
var startX = 0;
var startY = 0;
var mouseX = 0;
var mouseY = 0;

var isDrawing = false;
var isNotMouseUp = false;


var points = [];
var existingLines = [];
var existingLinesColors = [];


var lineColorInput =document.getElementById("line-color");

var lineColor = document.getElementById("line-color").value

var lineWidth = 4;
var gridPointColor = 'orange'
var gridPointSize = 3
var areaAroundPointSize = 8

class Point {
    constructor(x, y) {
        this.x = x
        this.y = y
    }

}

window.onload = function () {
    bounds = canvas.getBoundingClientRect();
    hasLoaded = true;

}
function getMousePos(canvas, evt) {
    var rect = canvas.getBoundingClientRect();
    return {
        x: evt.clientX - rect.x,
        y: evt.clientY - rect.y
    };
}

lineColorInput.addEventListener('input', e => {
    lineColor = document.getElementById("line-color").value
})

canvas.addEventListener('mousedown', e => {
    if (hasLoaded && e.button === 0) {
        if (!isDrawing) {
            startMouseX = e.clientX - bounds.left;
            startMouseY = e.clientY - bounds.top;
            var pointStart = getNearestPoint(mouseX, mouseY)
            if (isMouseInsidePoint(startMouseX, startMouseY, pointStart.x, pointStart.y)) {
                startX = pointStart.x
                startY = pointStart.y
            }
            isDrawing = true;
        }

        draw();
    }
});
canvas.addEventListener('mouseup', e => {
    if (hasLoaded && e.button === 0) {
        if (isDrawing) {
            var pointEnd = getNearestPoint(mouseX, mouseY)
            if (isMouseInsidePoint(mouseX, mouseY, pointEnd.x, pointEnd.y)) {
                existingLines.push({
                    startX: startX,
                    startY: startY,
                    endX: pointEnd.x,
                    endY: pointEnd.y
                });
                existingLinesColors.push(lineColor);
                isNotMouseUp = true;
                isDrawing = false;
            }
        }

        draw();
    }
});
canvas.addEventListener('mousemove', e => {
    if (hasLoaded) {
        mouseX = e.clientX - bounds.left;
        mouseY = e.clientY - bounds.top;

        if (isDrawing) {
            draw();
        }
    }
});

function draw() {

    ctx.clearRect(0, 0, canvas.width, canvas.height);
   
    for (var i = 0; i < existingLines.length; ++i) {
        ctx.beginPath();
        var line = existingLines[i];
        ctx.strokeStyle = existingLinesColors[i];
        ctx.moveTo(line.startX, line.startY);
        ctx.lineCap = 'round';
        ctx.lineTo(line.endX, line.endY);
        ctx.stroke();

    }

    
    if (isDrawing) {
        ctx.beginPath();
        ctx.strokeStyle = lineColor;
        ctx.lineWidth = lineWidth;
        
        ctx.moveTo(startX, startY);
        ctx.lineCap = 'round';
        ctx.lineTo(mouseX, mouseY);
        ctx.stroke();
    }
}

//////////////////////METHODS

function getNearestPoint(x, y) {
    for (let i = 0; i < points.length; i++) {
        if (isMouseInsidePoint(x, y, points[i].x, points[i].y)) {
            return points[i];
        }
    }
    return null;
}

function isMousePointBiggerThanMinPoint(mouseX, mouseY, pointX, pointY) {
    return mouseX >= pointX && mouseY >= pointY
}

function isMousePointSmallerThanMaxPoint(mouseX, mouseY, pointX, pointY) {
    return mouseX <= pointX && mouseY <= pointY
}

function isMouseInsidePoint(mouseX, mouseY, pointX, pointY) {
    let pointAreaCoords = areaAroundPoint(pointX, pointY)
    minPointX = pointAreaCoords.get('minPoint').get('x');
    minPointY = pointAreaCoords.get('minPoint').get('y');
    maxPointX = pointAreaCoords.get('maxPoint').get('x');
    maxPointY = pointAreaCoords.get('maxPoint').get('y');
    if (isMousePointBiggerThanMinPoint(mouseX, mouseY, minPointX, minPointY) && isMousePointSmallerThanMaxPoint(mouseX, mouseY, maxPointX, maxPointY)) {
        return true;
    }
    return false;
}

function areaAroundPoint(x, y) {
    const map = new Map();

    const mapMin = new Map();//Minimun 
    mapMin.set('x', x - areaAroundPointSize)
    mapMin.set('y', y - areaAroundPointSize)
    map.set('minPoint', mapMin)

    const mapMax = new Map();
    mapMax.set('x', x + areaAroundPointSize)
    mapMax.set('y', y + areaAroundPointSize)
    map.set('maxPoint', mapMax)
    //console.log(map.get('minPoint').get('x'))
    return map;
}

//////////////////////////////////GRID
drawPoint(gridCtx, 'orange', 3);

function drawPoint() {
    var odd = false;
    for (let x = 10; x < width; x += 25.98076211353) {
        for (var y = 10; y < height; y += 30) {
            if (y == 10 && odd) {
                y = 25
            }
            addPointToArray(x, y)
            paintPoint(gridCtx, gridPointColor, gridPointSize, x, y)
        }
        odd = !odd;
    }
}
function paintPoint(context, color, size, x, y) {
    gridCtx.beginPath();
    gridCtx.fillStyle = color;
    gridCtx.arc(x, y, size, 0 * Math.PI, 2 * Math.PI);
    gridCtx.fill();
}
function addPointToArray(x, y) {
    var point = new Point(x, y)
    points.push(point)
}