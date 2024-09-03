class SketchCanvas extends HTMLElement {
  static DEFAULT_STROKE_STYLE = "black";
  static DEFAULT_LINE_WIDTH = 3;
  static DEFAULT_LINE_CAP = "round";
  static DEFAULT_LINE_JOIN = "round";

  constructor() {
    super();
    this.attachShadow({ mode: 'open' });

    // Erstelle das Canvas-Element und füge es dem Shadow DOM hinzu
    this.canvas = document.createElement('canvas');
    this.shadowRoot.appendChild(this.canvas);

    // Füge Standard-Stile für den Host und das Canvas hinzu
    const style = document.createElement('style');
    style.textContent = `
      :host {
        display: block; /* Damit der Host wie ein Block-Element wirkt und CSS-Größen änderbar sind */
        width: 100%;
        height: 100%;
      }
      canvas {
        display: block; /* Entfernt ungewollten Abstand unter dem Canvas */
        width: 100%;
        height: 100%;
      }
    `;
    this.shadowRoot.appendChild(style);

    this.context = this.canvas.getContext('2d');

    // Verwende ResizeObserver, um die Größe des Canvas anzupassen
    this.resizeObserver = new ResizeObserver(() => this._updateCanvasSize());
  }

  connectedCallback() {
    // Setze die Standard-Zeichenattribute erst, wenn das Element verbunden ist
    this._setContextProperties();

    // Setze die Event-Listener für Zeichnen, wenn das Element verbunden ist
    this._setupDrawingEvents();

    // Überwache Änderungen in der Größe des Host-Elements
    this.resizeObserver.observe(this);

    // Initialisiere die Größe des Canvas basierend auf dem Shadow Host
    this._updateCanvasSize();
  }

  disconnectedCallback() {
    // Stoppe die Beobachtung der Größenänderung, wenn das Element vom DOM entfernt wird
    this.resizeObserver.unobserve(this);
  }

  _setContextProperties() {
    this.context.strokeStyle = this.strokeStyle;
    this.context.lineWidth = this.lineWidth;
    this.context.lineCap = this.lineCap;
    this.context.lineJoin = this.lineJoin;
  }

  _setupDrawingEvents() {
    this.canvas.addEventListener('mousedown', (evt) => this._startStroke(evt, [evt.offsetX, evt.offsetY]));
    this.canvas.addEventListener('mousemove', (evt) => this._continueStroke([evt.offsetX, evt.offsetY]));
    this.canvas.addEventListener('mouseup', () => this._endStroke());
    this.canvas.addEventListener('mouseout', () => this._endStroke());
    this.canvas.addEventListener('touchstart', (evt) => this._startStroke(evt, this._getTouchPoint(evt)));
    this.canvas.addEventListener('touchmove', (evt) => this._continueStroke(this._getTouchPoint(evt)));
    this.canvas.addEventListener('touchend', () => this._endStroke());
    this.canvas.addEventListener('touchcancel', () => this._endStroke());
  }

  _updateCanvasSize() {
    const { width, height } = this.getBoundingClientRect();
    this.canvas.width = width;
    this.canvas.height = height;
  }

  _startStroke(evt, point) {
    evt.preventDefault();
    this.drawing = true;
    this.latestPoint = point;
  }

  _continueStroke(newPoint) {
    if (!this.drawing) return;
    this.context.beginPath();
    this.context.moveTo(this.latestPoint[0], this.latestPoint[1]);
    console.log(`strokeStyle=${this._strokeStyle}`)
    this._setContextProperties();
    this.context.lineTo(newPoint[0], newPoint[1]);
    this.context.stroke();
    this.latestPoint = newPoint;
  }

  _endStroke() {
    this.drawing = false;
  }

  _getTouchPoint(evt) {
    if (!evt.currentTarget) {
      return [0, 0];
    }
    const rect = evt.currentTarget.getBoundingClientRect();
    const touch = evt.targetTouches[0];
    return [touch.clientX - rect.left, touch.clientY - rect.top];
  }

  clear() {
    this.context.clearRect(0, 0, this.canvas.scrollWidth, this.canvas.scrollHeight);
  }

  get strokeStyle() {
    return this.getAttribute('stroke-style') || SketchCanvas.DEFAULT_STROKE_STYLE;
  }

  set strokeStyle(value) {
    this.setAttribute('stroke-style', value);
//    console.log(`strokeStyle=${this._strokeStyle}`)
//    requestAnimationFrame(() => {
//        this.context.strokeStyle = value;
//    });
//    this.setAttribute('stroke-style', value);
  }

  get lineWidth() {
    return parseFloat(this.getAttribute('line-width')) || SketchCanvas.DEFAULT_LINE_WIDTH;
  }

  set lineWidth(value) {
    this.setAttribute('line-width', value);
  }

  get lineCap() {
    return this.getAttribute('line-cap') || SketchCanvas.DEFAULT_LINE_CAP;
  }

  set lineCap(value) {
    this.setAttribute('line-cap', value);
  }

  get lineJoin() {
    return this.getAttribute('line-join') || SketchCanvas.DEFAULT_LINE_JOIN;
  }

  set lineJoin(value) {
    this.setAttribute('line-join', value);
  }

  getBase64Image() {
    return this.canvas.toDataURL('image/png');
  }

  setBase64Image(value) {
    if (value.startsWith('data:image/png;base64,')) {
      const img = new Image();
      img.src = value;
      img.onload = () => {
        this.canvas.width = img.width;
        this.canvas.height = img.height;
        this.context.drawImage(img, 0, 0);
      };
    }
  }

  static get observedAttributes() {
      return ['stroke-style', 'line-width', 'line-cap', 'line-join'];
  }

  attributeChangedCallback(name, oldValue, newValue) {
    this._setContextProperties();
  }

}

customElements.define('sketch-canvas', SketchCanvas);
