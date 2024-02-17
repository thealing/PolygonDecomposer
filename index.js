init();

function init() {
  canvasWidthInput = document.getElementById("canvas-width-input");
  canvasHeightInput = document.getElementById("canvas-height-input");
  canvasMarginInput = document.getElementById("canvas-margin-input");
  polygonPointsInput = document.getElementById("polygon-points-input");
  polygonGenerateButton = document.getElementById("polygon-generate-button");
  polygonTriangulateButton = document.getElementById("polygon-triangulate-button");
  displayCanvas = document.getElementById("display-canvas");
  displayContext = displayCanvas.getContext("2d");
  const displayRect = displayCanvas.getBoundingClientRect();
  canvasWidthInput.value = displayRect.width;
  canvasHeightInput.value = displayRect.height;
  polygonPoints = [];
  polygonFinished = false;
  triangulation = [];
  polygonGenerateButton.addEventListener("click", function() {
    const width = parseInt(canvasWidthInput.value);
    const height = parseInt(canvasHeightInput.value);
    const margin = parseInt(canvasMarginInput.value);
    polygonPoints = generateRandomPolygon(polygonPointsInput.value, margin, margin, width - margin, height - margin);
    polygonFinished = true;
    triangulation = [];
  });
  polygonTriangulateButton.addEventListener("click", function() {
    if (!polygonFinished) {
      return;
    }
    triangulation = triangulatePolygon(polygonPoints);
    if (triangulation.length != polygonPoints.length - 2) {
      throw new Error("triangulation failed");
    }
  });
  displayCanvas.addEventListener("mouseup", function(event) {
    if (polygonFinished) {
      polygonFinished = false;
      polygonPoints = [];
      triangulation = [];
      return;
    }
    const rect = displayCanvas.getBoundingClientRect();
    const x = (event.clientX - rect.left) * displayCanvas.width / rect.width;
    const y = (event.clientY - rect.top) * displayCanvas.height / rect.height;
    const r = 10;
    if (polygonPoints.length > 0 && (x - polygonPoints[0].x) ** 2 + (y - polygonPoints[0].y) ** 2 < r ** 2) {
      polygonFinished = true;
      return;
    }
    if (polygonPoints.length > 0 && (x - polygonPoints[polygonPoints.length - 1].x) ** 2 + (y - polygonPoints[polygonPoints.length - 1].y) ** 2 < r ** 2) {
      return;
    }
    polygonPoints.push({ x: x, y: y });
  });
  requestAnimationFrame(animate);
}

function animate() {
  displayCanvas.width = parseInt(canvasWidthInput.value);
  displayCanvas.height = parseInt(canvasHeightInput.value);
  displayContext.clearRect(0, 0, displayCanvas.width, displayCanvas.height);
  if (polygonPoints.length > 0) {
    displayContext.lineWidth = 1;
    displayContext.strokeStyle = polygonFinished ? "green" : "red";
    displayContext.beginPath();
    displayContext.moveTo(polygonPoints[0].x, polygonPoints[0].y);
    for (let i = 1; i < polygonPoints.length; i++) {
      displayContext.lineTo(polygonPoints[i].x, polygonPoints[i].y);
    }
    if (polygonFinished) {
      displayContext.closePath();
    }
    displayContext.stroke();
    displayContext.strokeStyle = "blue";
    displayContext.beginPath();
    for (const t of triangulation) {
      displayContext.moveTo(polygonPoints[t[0]].x, polygonPoints[t[0]].y);
      displayContext.lineTo(polygonPoints[t[2]].x, polygonPoints[t[2]].y);
    }
    displayContext.stroke();
  }
  requestAnimationFrame(animate);
}
