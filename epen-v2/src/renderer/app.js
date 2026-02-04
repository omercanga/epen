(function () {
  var drawMode = true;

  function isDrawMode() { return drawMode; }
  function setDrawMode(v) { drawMode = !!v; }

  function updateShortcutLabels() {
    var isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0;
    var drawShortcut = document.getElementById('drawingShortcut');
    var closeShortcut = document.getElementById('closeShortcut');
    var nextDisplayShortcut = document.getElementById('nextDisplayShortcut');
    if (drawShortcut) drawShortcut.textContent = isMac ? '⌘D' : 'Ctrl+Shift+D';
    if (closeShortcut) closeShortcut.textContent = isMac ? '⌘Q' : 'Ctrl+Q';
    if (nextDisplayShortcut) nextDisplayShortcut.textContent = isMac ? '⌘⇧M' : 'Ctrl+Shift+M';
  }

  function updateDrawingModeUI(active) {
    setDrawMode(active);
    var statusBar = document.getElementById('status-bar');
    var toolbar = document.getElementById('toolbar');
    var titleBar = document.getElementById('titleBar');
    if (statusBar) {
      var lang = window.DrawingApp.getCurrentLang();
      var t = window.DrawingApp.getTranslations();
      var status = active ? (t[lang] && t[lang].active) || 'Active' : (t[lang] && t[lang].inactive) || 'Inactive';
      var label = (t[lang] && t[lang].drawMode) || 'Drawing Mode';
      statusBar.innerHTML = label + ': <b>' + status + '</b>';
    }
    if (toolbar) toolbar.classList.toggle('hidden', !active);
    if (titleBar) titleBar.classList.toggle('passive', !active);
    if (statusBar) statusBar.classList.toggle('passive', !active);
  }

  function init() {
    var api = window.ePen;
    if (!api) return;

    window.DrawingApp = {
      isDrawMode: isDrawMode,
      setDrawMode: setDrawMode,
      getCurrentLang: function () { return window._ePenLang || 'en'; },
      getTranslations: function () { return window._ePenTranslations || {}; }
    };

    api.getTranslations().then(function (t) {
      window._ePenTranslations = t;
      return api.getLanguage();
    }).then(function (lang) {
      window._ePenLang = lang;
      if (window._ePenTranslations) window.applyTranslations(window._ePenTranslations, lang);
      updateShortcutLabels();
    });

    api.onLanguageChange(function (lang) {
      window._ePenLang = lang;
      if (window._ePenTranslations) window.applyTranslations(window._ePenTranslations, lang);
    });

    api.onDrawingModeChanged(updateDrawingModeUI);
    api.onInitDrawingMode(updateDrawingModeUI);

    var canvasEl = document.getElementById('canvas');
    if (canvasEl) {
      window.CanvasManager.init(canvasEl);
      window.addEventListener('resize', function () { window.CanvasManager.resize(); });
      canvasEl.addEventListener('mousedown', window.CanvasManager.startDrawing);
      canvasEl.addEventListener('mousemove', window.CanvasManager.draw);
      canvasEl.addEventListener('mouseup', window.CanvasManager.stopDrawing);
      canvasEl.addEventListener('mouseleave', window.CanvasManager.stopDrawing);
    }

    document.getElementById('toggleDrawingMode').addEventListener('click', function () { api.toggleDrawingMode(); });
    document.getElementById('closeButton').addEventListener('click', function () { api.closeWindow(); });

    var tools = {
      pen: document.getElementById('penTool'),
      highlighter: document.getElementById('highlighterTool'),
      eraser: document.getElementById('eraserTool'),
      line: document.getElementById('lineTool'),
      rect: document.getElementById('rectangleTool'),
      circle: document.getElementById('circleTool')
    };
    Object.keys(tools).forEach(function (tool) {
      if (tools[tool]) tools[tool].addEventListener('click', function () {
        Object.keys(tools).forEach(function (k) { if (tools[k]) tools[k].classList.remove('active'); });
        tools[tool].classList.add('active');
        window.DrawingState.setTool(tool);
      });
    });

    document.querySelectorAll('.color-swatch').forEach(function (swatch) {
      swatch.addEventListener('click', function () {
        var color = swatch.getAttribute('data-color');
        if (color && color !== 'custom') {
          window.DrawingState.setColor(color);
          var picker = document.getElementById('colorPicker');
          if (picker) picker.value = color;
          document.querySelectorAll('.color-swatch').forEach(function (s) { s.classList.remove('active'); });
          swatch.classList.add('active');
        }
      });
    });
    var colorPicker = document.getElementById('colorPicker');
    if (colorPicker) {
      colorPicker.addEventListener('input', function () {
        window.DrawingState.setColor(colorPicker.value);
        document.querySelectorAll('.color-swatch').forEach(function (s) { s.classList.remove('active'); });
        var customSwatch = document.querySelector('.color-swatch[data-color="custom"]');
        if (customSwatch) customSwatch.classList.add('active');
      });
    }
    var lineWidth = document.getElementById('lineWidth');
    var lineWidthValue = document.getElementById('lineWidthValue');
    if (lineWidth) {
      lineWidth.addEventListener('input', function () {
        var v = parseInt(lineWidth.value, 10);
        window.DrawingState.setLineWidth(v);
        if (lineWidthValue) lineWidthValue.textContent = v + 'px';
      });
    }

    document.getElementById('undoButton').addEventListener('click', window.CanvasManager.undo);
    document.getElementById('redoButton').addEventListener('click', window.CanvasManager.redo);
    document.getElementById('clearButton').addEventListener('click', window.CanvasManager.clear);

    document.addEventListener('keydown', function (e) {
      if (e.ctrlKey || e.metaKey) {
        if (e.key === 'z') { e.preventDefault(); window.CanvasManager.undo(); }
        else if (e.key === 'y' || (e.shiftKey && e.key === 'z')) { e.preventDefault(); window.CanvasManager.redo(); }
        else if (e.key === 'q') { e.preventDefault(); api.closeWindow(); }
        else if (e.key === 'd') { e.preventDefault(); api.toggleDrawingMode(); }
      }
    });

    updateShortcutLabels();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
