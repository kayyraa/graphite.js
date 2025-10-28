# graphite.js

**graphite.js** is a lightweight JavaScript library for real-time, customizable canvas-based graph rendering.

## Features
- Dynamic graph updates
- Customizable styles and rulers
- Lightweight and dependency-free
- Supports real-time data visualization

## Installation
```bash
git clone https://github.com/yourusername/graphite.js.git
```
## Or include it directly:
```html
<script type="module" src="graphite.js"></script>
```
## Example usage
```js
new Graph(
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

Graph.Update();

```
