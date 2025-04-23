// Use global React and ReactKonva objects
const Stage = window.Konva.Stage;
const Layer = window.Konva.Layer;
const Line = window.Konva.Line;

class DrawingApp extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      lines: [],
      isDrawing: false,
      color: '#000000',
      size: 2
    };
  }

  componentDidMount() {
    console.log('Component mounted');
  }

  handleMouseDown = (e) => {
    console.log('Mouse down');
    this.setState({ isDrawing: true });
    const pos = e.target.getStage().getPointerPosition();
    this.setState({
      lines: [...this.state.lines, { points: [pos.x, pos.y] }]
    });
  };

  handleMouseMove = (e) => {
    if (!this.state.isDrawing) return;

    console.log('Mouse move');
    const stage = e.target.getStage();
    const point = stage.getPointerPosition();
    const lastLine = this.state.lines[this.state.lines.length - 1];
    
    lastLine.points = lastLine.points.concat([point.x, point.y]);
    
    this.setState({
      lines: [...this.state.lines.slice(0, -1), lastLine]
    });
  };

  handleMouseUp = () => {
    console.log('Mouse up');
    this.setState({ isDrawing: false });
  };

  render() {
    console.log('Rendering component');
    return React.createElement('div', 
      { style: { width: '100%', height: '100%', background: '#fff' } },
      React.createElement(Stage, {
        width: window.innerWidth,
        height: window.innerHeight,
        onMouseDown: this.handleMouseDown,
        onMouseMove: this.handleMouseMove,
        onMouseUp: this.handleMouseUp
      },
      React.createElement(Layer, null,
        this.state.lines.map((line, i) => 
          React.createElement(Line, {
            key: i,
            points: line.points,
            stroke: this.state.color,
            strokeWidth: this.state.size,
            tension: 0.5,
            lineCap: 'round',
            lineJoin: 'round'
          })
        ))
      )
    );
  }
}

// Wait for DOM to be ready
window.addEventListener('DOMContentLoaded', () => {
  console.log('DOM loaded');
  const rootElement = document.getElementById('root');
  if (rootElement) {
    console.log('Root element found, rendering app');
    ReactDOM.render(React.createElement(DrawingApp), rootElement);
  } else {
    console.error('Root element not found!');
  }
}); 