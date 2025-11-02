# graphite.js

**graphite.js** is a lightweight JavaScript library for real-time, customizable canvas-based graph rendering.

## Features
- Dynamic graph updates
- Customizable styles and rulers
- Lightweight and dependency-free
- Supports real-time data visualization

## Installation
```bash
git clone https://github.com/kayyraa/graphite.js.git
```
```html
<script type="module" src="https://cdn.jsdelivr.net/gh/kayyraa/graphite.js@main/graphite.js"></script>
```
## Example usage
```js
const GraphObject = new Graph(
    document.querySelector(".Canvas"),
    "Line",
    [[-1, -1], [1, 1]],
    {
        AxisX: "X",
        AxisY: "Y",
        Header: "f(x) = x"
    },
    {
        AxisXmn: -1,
        AxisXmx: 1,
        AxisYmn: -1,
        AxisYmx: 1,
        Style: {
            MasterColor: "rgb(0, 0, 0)",
            LineThickness: 2,
            DotThickness: 2
        }
    }
).Update();

GraphObject.Update();
GraphObject.Resize([window.innerWidth / 2, window.innerHeight / 2]); // [SizeX, SizeY] + Update()
```
## Example usage of TweenService
```js
const GraphObject = new Graph(
    document.querySelector(".Canvas"),
    "Line",
    [[0, 0], [1, 1]],
    {},
    {
        AxisXmn: 0,
        AxisXmx: 1,
        AxisYmn: 0,
        AxisYmx: 1,
        Style: {
            MasterColor: "rgb(0, 0, 0)",
            LineThickness: 2,
            DotThickness: 2
        }
    }
);

let Size = [window.innerWidth / 2, window.innerHeight / 2];
let Scale = { Value: 1 };
let TargetScale = 0.825;

function Loop() {
    Size[0] = (window.innerWidth / 2) * Scale.Value;
    Size[1] = (window.innerHeight / 2) * Scale.Value;
    GraphObject.Resize(Size);
    requestAnimationFrame(Loop);
}

function Animate() {
    TweenService.Tween(
        Scale,                         // Object
        "Value",                       // Property
        TargetScale,                   // Target value
        500,                           // Time
        TweenService.Easing.SineInOut, // Timing function
        () => {
            TargetScale = TargetScale === 0.825 ? 1 : 0.825;
            Animate();                 // Loops infinitely
        }                              // OnComplete function
    );
}

Loop();
Animate();
```
