(function () {
  var state = {
    tool: 'pen',
    color: '#ff0000',
    lineWidth: 6,
    history: [],
    redoStack: []
  };

  window.DrawingState = {
    getState: function () { return state; },
    setTool: function (tool) { state.tool = tool; },
    setColor: function (color) { state.color = color; },
    setLineWidth: function (w) { state.lineWidth = Math.max(1, Math.min(20, w)); },
    pushHistory: function (dataUrl) { state.history.push(dataUrl); state.redoStack = []; },
    undoSnapshot: function () {
      if (state.history.length <= 1) return null;
      state.redoStack.push(state.history.pop());
      return state.history[state.history.length - 1];
    },
    redoSnapshot: function () {
      if (state.redoStack.length === 0) return null;
      var next = state.redoStack.pop();
      state.history.push(next);
      return next;
    },
    clearHistoryAndRedo: function () { state.redoStack = []; },
    state: state
  };
})();
