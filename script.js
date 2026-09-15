```javascript
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

const penBtn = document.getElementById("penBtn");
const eraserBtn = document.getElementById("eraserBtn");
const colorPicker = document.getElementById("colorPicker");
const sizeSlider = document.getElementById("sizeSlider");
const sizeValue = document.getElementById("sizeValue");

const undoBtn = document.getElementById("undoBtn");
const redoBtn = document.getElementById("redoBtn");
const clearBtn = document.getElementById("clearBtn");
const saveBtn = document.getElementById("saveBtn");

let drawing = false;
let eraser = false;

let history = [];
let historyIndex = -1;


// ===============================
// CANVAS
// ===============================

function resetCanvas() {
    ctx.fillStyle = "white";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
}


// ===============================
// HISTORY
// ===============================

function saveHistory() {

    if (historyIndex < history.length - 1) {
        history = history.slice(0, historyIndex + 1);
    }

    history.push(canvas.toDataURL());

    historyIndex++;

    if (history.length > 50) {
        history.shift();
        historyIndex--;
    }
}


function restoreHistory(index) {

    if (index < 0 || index >= history.length) {
        return;
    }

    const image = new Image();

    image.onload = function () {

        ctx.clearRect(
            0,
            0,
            canvas.width,
            canvas.height
        );

        ctx.drawImage(image, 0, 0);
    };

    image.src = history[index];
}


// ===============================
// MOUSE POSITION
// ===============================

function getPosition(event) {

    const rect = canvas.getBoundingClientRect();

    return {
        x:
            (event.clientX - rect.left) *
            (canvas.width / rect.width),

        y:
            (event.clientY - rect.top) *
            (canvas.height / rect.height)
    };
}


// ===============================
// DRAWING
// ===============================

canvas.addEventListener("mousedown", function (event) {

    drawing = true;

    const position = getPosition(event);

    ctx.beginPath();

    ctx.moveTo(
        position.x,
        position.y
    );

    ctx.lineCap = "round";
    ctx.lineJoin = "round";

    ctx.strokeStyle =
        eraser
            ? "white"
            : colorPicker.value;

    ctx.lineWidth =
        Number(sizeSlider.value);

    // პატარა წერტილი
    ctx.lineTo(
        position.x + 0.01,
        position.y + 0.01
    );

    ctx.stroke();
});


canvas.addEventListener("mousemove", function (event) {

    if (!drawing) {
        return;
    }

    const position = getPosition(event);

    ctx.strokeStyle =
        eraser
            ? "white"
            : colorPicker.value;

    ctx.lineWidth =
        Number(sizeSlider.value);

    ctx.lineTo(
        position.x,
        position.y
    );

    ctx.stroke();

    ctx.beginPath();

    ctx.moveTo(
        position.x,
        position.y
    );
});


function stopDrawing() {

    if (!drawing) {
        return;
    }

    drawing = false;

    ctx.closePath();

    saveHistory();
}


canvas.addEventListener(
    "mouseup",
    stopDrawing
);

canvas.addEventListener(
    "mouseleave",
    stopDrawing
);


// ===============================
// PEN
// ===============================

penBtn.addEventListener("click", function () {

    eraser = false;

    penBtn.classList.add("active");

    eraserBtn.classList.remove("active");

});


// ===============================
// ERASER
// ===============================

eraserBtn.addEventListener("click", function () {

    eraser = true;

    eraserBtn.classList.add("active");

    penBtn.classList.remove("active");

});


// ===============================
// BRUSH SIZE
// ===============================

sizeSlider.addEventListener("input", function () {

    sizeValue.textContent =
        sizeSlider.value + "px";

});


// ===============================
// UNDO
// ===============================

undoBtn.addEventListener("click", function () {

    if (historyIndex > 0) {

        historyIndex--;

        restoreHistory(historyIndex);

    }

});


// ===============================
// REDO
// ===============================

redoBtn.addEventListener("click", function () {

    if (historyIndex < history.length - 1) {

        historyIndex++;

        restoreHistory(historyIndex);

    }

});


// ===============================
// CLEAR
// ===============================

clearBtn.addEventListener("click", function () {

    resetCanvas();

    saveHistory();

});


// ===============================
// SAVE PNG
// ===============================

saveBtn.addEventListener("click", function () {

    const link = document.createElement("a");

    link.download = "andogo-paint.png";

    link.href =
        canvas.toDataURL("image/png");

    link.click();

});


// ===============================
// START
// ===============================

resetCanvas();

saveHistory();
```
