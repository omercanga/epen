(function () {
  var canvas, ctx;
  var isDrawing = false;
  var lastX, lastY, startX, startY, snapshot;

  function getCanvas() { return canvas; }
  function getCtx() { return ctx; }

  function initCanvas(el) {
    canvas = el;
    ctx = canvas.getContext('2d');
    resizeCanvas();
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    window.DrawingState.pushHistory(canvas.toDataURL('image/png'));
  }

  function resizeCanvas() {
    if (!canvas) return;
    var dpr = window.devicePixelRatio || 1;
    var w = window.innerWidth;
    var h = window.innerHeight;
    canvas.width = w * dpr;
    canvas.height = h * dpr;
    canvas.style.width = w + 'px';
    canvas.style.height = h + 'px';
    ctx.scale(dpr, dpr);
  }

  function saveState() {
    window.DrawingState.pushHistory(canvas.toDataURL('image/png'));
  }

  function restoreSnapshot(dataUrl) {
    if (!dataUrl) return;
    var img = new Image();
    img.onload = function () {
      var w = window.innerWidth;
      var h = window.innerHeight;
      ctx.clearRect(0, 0, w, h);
      ctx.drawImage(img, 0, 0, img.naturalWidth, img.naturalHeight, 0, 0, w, h);
    };
    img.src = dataUrl;
  }

  function undo() {
    var prev = window.DrawingState.undoSnapshot();
    restoreSnapshot(prev);
  }

  function redo() {
    var next = window.DrawingState.redoSnapshot();
    restoreSnapshot(next);
  }

  function clear() {
    ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
    window.DrawingState.clearHistoryAndRedo();
    window.DrawingState.pushHistory(canvas.toDataURL('image/png'));
  }

  function startDrawing(e) {
    if (!window.DrawingApp || !window.DrawingApp.isDrawMode()) return;
    isDrawing = true;
    var r = canvas.getBoundingClientRect();
    lastX = e.clientX - r.left;
    lastY = e.clientY - r.top;
    startX = lastX;
    startY = lastY;
    snapshot = ctx.getImageData(0, 0, canvas.width, canvas.height);
  }

  function draw(e) {
    if (!isDrawing || !window.DrawingApp || !window.DrawingApp.isDrawMode()) return;
    var r = canvas.getBoundingClientRect();
    var x = e.clientX - r.left;
    var y = e.clientY - r.top;

    var st = window.DrawingState.getState();
    ctx.lineWidth = st.lineWidth;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    if (st.tool === 'eraser') {
      ctx.globalCompositeOperation = 'destination-out';
      ctx.strokeStyle = 'rgba(0,0,0,1)';
    } else {
      ctx.globalCompositeOperation = 'source-over';
      if (st.tool === 'highlighter') {
        ctx.globalAlpha = 0.3;
        ctx.strokeStyle = st.color;
      } else {
        ctx.globalAlpha = 1;
        ctx.strokeStyle = st.color;
      }
    }

    if (st.tool === 'pen' || st.tool === 'eraser' || st.tool === 'highlighter') {
      ctx.beginPath();
      ctx.moveTo(lastX, lastY);
      ctx.lineTo(x, y);
      ctx.stroke();
      lastX = x;
      lastY = y;
    } else {
      ctx.putImageData(snapshot, 0, 0);
      ctx.globalCompositeOperation = 'source-over';
      ctx.strokeStyle = st.color;
      ctx.globalAlpha = 1;
      ctx.beginPath();
      if (st.tool === 'line') {
        ctx.moveTo(startX, startY);
        ctx.lineTo(x, y);
      } else if (st.tool === 'rect') {
        ctx.rect(startX, startY, x - startX, y - startY);
      } else if (st.tool === 'circle') {
        var radius = Math.sqrt((x - startX) * (x - startX) + (y - startY) * (y - startY));
        ctx.arc(startX, startY, radius, 0, Math.PI * 2);
      }
      ctx.stroke();
    }
  }

  function stopDrawing() {
    if (isDrawing) {
      isDrawing = false;
      ctx.globalAlpha = 1;
      saveState();
    }
  }

  window.CanvasManager = {
    init: initCanvas,
    resize: resizeCanvas,
    saveState: saveState,
    undo: undo,
    redo: redo,
    clear: clear,
    startDrawing: startDrawing,
    draw: draw,
    stopDrawing: stopDrawing,
    getCanvas: getCanvas,
    getCtx: getCtx
  };
})();
