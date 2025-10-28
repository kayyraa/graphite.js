globalThis.Graph = class {
    constructor(
        Canvas = new HTMLCanvasElement,
        Type = "Line",
        Data = [],
        Labels = {},
        Options = {}
    ) {
        const DefaultLabels = {
            AxisX: "X",
            AxisY: "Y",
            Header: "Graph"
        };

        const DefaultOptions = {
            AxisXmx: 1,
            AxisXmn: 0,
            AxisYmx: 1,
            AxisYmn: 0,
            AxisTelemetry: 4,
            Style: {
                LineColor: "rgba(43, 43, 43, 1)",
                DotColor: "rgb(0, 0, 255)",
                TextColor: "rgb(0, 0, 0)",
                TickColor: "rgb(0, 0, 0)",
                LineThickness: 2,
                DotThickness: 1,
                Padding: 64
            }
        };

        this.Canvas = Canvas;
        this.Type = Type;
        this.Data = Data;
        this.Labels = Object.assign({}, DefaultLabels, Labels);
        this.Options = Object.assign({}, DefaultOptions, Options);

        if (Options.Style) this.Options.Style = Object.assign({}, DefaultOptions.Style, Options.Style);
    }

    Update() {
        const Width = this.Canvas.width;
        const Height = this.Canvas.height;
        const Ctx = this.Canvas.getContext("2d");
        Ctx.clearRect(0, 0, Width, Height);

        let Padding = this.Options.Style.Padding;
        let GraphWidth = Width - Padding * 2;
        let GraphHeight = Height - Padding * 2;

        let Xmn = this.Options.AxisXmn;
        let Xmx = this.Options.AxisXmx;
        let Ymn = this.Options.AxisYmn;
        let Ymx = this.Options.AxisYmx;

        const AxisXRuler = {};
        for (let _ = Xmn; _ <= Xmx + 1e-9; _ += Xmx / this.Options.AxisTelemetry) {
            AxisXRuler[parseFloat(_.toFixed(6))] = _.toString();
        }
        this.Labels.AxisXRuler = AxisXRuler;

        const AxisYRuler = {};
        for (let _ = Ymn; _ <= Ymx + 1e-9; _ += Ymx / this.Options.AxisTelemetry) {
            AxisYRuler[parseFloat(_.toFixed(6))] = _.toString();
        }
        this.Labels.AxisYRuler = AxisYRuler;

        let LineColor = this.Options.Style.LineColor;
        let DotColor = this.Options.Style.DotColor;
        let TextColor = this.Options.Style.TextColor;
        let TickColor = this.Options.Style.TickColor;

        const MasterColor = this.Options.Style.MasterColor;
        if (MasterColor) {
            LineColor = MasterColor;
            DotColor = MasterColor;
            TextColor = MasterColor;
            TickColor = MasterColor;
        }

        function DrawRect(Px, Py, Width, Height, Style) {
            Ctx.fillStyle = Style;
            Ctx.fillRect(Px, Py, Width, Height);
        }

        function DrawLine(PsX, PsY, PeX, PeY, LineWidth, Style) {
            Ctx.strokeStyle = Style;
            Ctx.lineWidth = LineWidth;
            Ctx.beginPath();
            Ctx.moveTo(PsX, PsY);
            Ctx.lineTo(PeX, PeY);
            Ctx.stroke();
        }

        function DrawCircle(Px, Py, Radius, Style) {
            Ctx.fillStyle = Style;
            Ctx.beginPath();
            Ctx.arc(Px, Py, Radius, 0, Math.PI * 2);
            Ctx.fill();
        }

        function DrawText(Text = "", Px = 0, Py = 0, Align = "center", Font = "14px Arial", Style = TextColor) {
            Ctx.fillStyle = Style;
            Ctx.font = Font;
            Ctx.textAlign = Align;
            Ctx.fillText(Text, Px, Py);
        }

        let ZeroX = Padding + ((0 - Xmn) / (Xmx - Xmn)) * GraphWidth;
        let ZeroY = Padding + GraphHeight - ((0 - Ymn) / (Ymx - Ymn)) * GraphHeight;
        ZeroX = Math.min(Math.max(ZeroX, Padding), Padding + GraphWidth);
        ZeroY = Math.min(Math.max(ZeroY, Padding), Padding + GraphHeight);

        DrawLine(Padding, ZeroY, Padding + GraphWidth, ZeroY, 2, TextColor);
        DrawLine(ZeroX, Padding, ZeroX, Padding + GraphHeight, 2, TextColor);

        const ArrowSize = 14;

        Ctx.beginPath();
        Ctx.moveTo(Padding + GraphWidth - 1 + ArrowSize, ZeroY);
        Ctx.lineTo(Padding + GraphWidth - ArrowSize - 1 + ArrowSize, ZeroY - ArrowSize / 2);
        Ctx.lineTo(Padding + GraphWidth - ArrowSize - 1 + ArrowSize, ZeroY + ArrowSize / 2);
        Ctx.closePath();
        Ctx.fillStyle = TextColor;
        Ctx.fill();

        Ctx.beginPath();
        Ctx.moveTo(ZeroX, Padding + 1 - ArrowSize);
        Ctx.lineTo(ZeroX - ArrowSize / 2, Padding + ArrowSize + 1 - ArrowSize);
        Ctx.lineTo(ZeroX + ArrowSize / 2, Padding + ArrowSize + 1 - ArrowSize);
        Ctx.closePath();
        Ctx.fill();

        if (Xmn < 0) {
            Ctx.beginPath();
            Ctx.moveTo(Padding - ArrowSize, ZeroY);
            Ctx.lineTo(Padding - ArrowSize + ArrowSize, ZeroY - ArrowSize / 2);
            Ctx.lineTo(Padding - ArrowSize + ArrowSize, ZeroY + ArrowSize / 2);
            Ctx.closePath();
            Ctx.fill();
        }

        if (Ymn < 0) {
            Ctx.beginPath();
            Ctx.moveTo(ZeroX, Padding + GraphHeight + ArrowSize);
            Ctx.lineTo(ZeroX - ArrowSize / 2, Padding + GraphHeight + 1);
            Ctx.lineTo(ZeroX + ArrowSize / 2, Padding + GraphHeight + 1);
            Ctx.closePath();
            Ctx.fill();
        }

        DrawText(this.Labels.Header, GraphWidth / 2 + Padding, Padding / 2);

        let XmnPadding = Xmn < 0 ? ArrowSize + 4 : 0;
        let YmnPadding = Ymn < 0 ? ArrowSize + 4 : 0;

        let XKeys = Object.keys(this.Labels.AxisXRuler).map(parseFloat).sort((A, B) => A - B);
        for (let _ = 0; _ < XKeys.length; _++) {
            if (Xmn < 0 && XKeys[_] === 0) continue;
            let Key = XKeys[_];
            let Px = Padding + (Key - Xmn) / (Xmx - Xmn) * GraphWidth;
            if (Px < Padding || Px > Padding + GraphWidth) continue;
        
            let YmnMargin = Ymn < 0 ? GraphHeight / 2 + Padding / 4 + 2 : 0;
            DrawText(parseFloat(this.Labels.AxisXRuler[Key]).toFixed(Number.isInteger(parseFloat(this.Labels.AxisYRuler[Key])) ? 0 : 2), Px, Padding + GraphHeight + 20 + XmnPadding - YmnMargin);
            DrawLine(Px, Padding + GraphHeight + XmnPadding - YmnMargin, Px, Padding + GraphHeight + 6 + XmnPadding - YmnMargin, 1, TextColor);
        
            if (_ < XKeys.length - 1) {
                let NextKey = XKeys[_ + 1];
                let MidX = (Key + NextKey) / 2;
                let PxMid = Padding + (MidX - Xmn) / (Xmx - Xmn) * GraphWidth;
                DrawLine(PxMid, Padding + GraphHeight + XmnPadding - YmnMargin, PxMid, Padding + GraphHeight + 4 + XmnPadding - YmnMargin, 1, TickColor);
            }
        }

        let YKeys = Object.keys(this.Labels.AxisYRuler).map(parseFloat).sort((a, b) => a - b);
        for (let _ = 0; _ < YKeys.length; _++) {
            if (Ymn < 0 && YKeys[_] === 0) continue;
            let Key = YKeys[_];
            let Py = Padding + GraphHeight - (Key - Ymn) / (Ymx - Ymn) * GraphHeight;
            if (Py < Padding || Py > Padding + GraphHeight) continue;
        
            let XmnMargin = Xmn < 0 ? GraphWidth / 2 + Padding / 4 + 2 : 0;
            DrawText(parseFloat(this.Labels.AxisYRuler[Key]).toFixed(Number.isInteger(parseFloat(this.Labels.AxisYRuler[Key])) ? 0 : 2), Padding - 8 - YmnPadding + XmnMargin, Py + 4, "right");
            DrawLine(Padding - YmnPadding + XmnMargin, Py, Padding - 6 - YmnPadding + XmnMargin, Py, 1, TextColor);
        
            if (_ < YKeys.length - 1) {
                let NextKey = YKeys[_ + 1];
                let MidY = (Key + NextKey) / 2;
                let PyMid = Padding + GraphHeight - (MidY - Ymn) / (Ymx - Ymn) * GraphHeight;
                DrawLine(Padding - YmnPadding + XmnMargin, PyMid, Padding - 4 - YmnPadding + XmnMargin, PyMid, 1, TickColor);
            }
        }

        DrawText(this.Labels.AxisY, Padding + 5, Padding + 15, "left");
        DrawText(this.Labels.AxisX, Padding + GraphWidth - 5, Padding + GraphHeight - 10, "right");

        if (this.Type === "Line") {
            for (let _ = 1; _ < this.Data.length; _++) {
                let Px0 = Padding + ((this.Data[_ - 1][0] - Xmn) / (Xmx - Xmn)) * GraphWidth;
                let Py0 = Padding + GraphHeight - ((this.Data[_ - 1][1] - Ymn) / (Ymx - Ymn)) * GraphHeight;
                let Px1 = Padding + ((this.Data[_][0] - Xmn) / (Xmx - Xmn)) * GraphWidth;
                let Py1 = Padding + GraphHeight - ((this.Data[_][1] - Ymn) / (Ymx - Ymn)) * GraphHeight;
                DrawLine(Px0, Py0, Px1, Py1, this.Options.Style.LineThickness, LineColor);
                DrawCircle(Px0, Py0, this.Options.Style.DotThickness, DotColor);
            }
        } else if (this.Type === "Dot") {
            for (let _ = 0; _ < this.Data.length; _++) {
                let Px = Padding + ((this.Data[_][0] - Xmn) / (Xmx - Xmn)) * GraphWidth;
                let Py = Padding + GraphHeight - ((this.Data[_][1] - Ymn) / (Ymx - Ymn)) * GraphHeight;
                DrawCircle(Px, Py, this.Options.Style.DotThickness, DotColor);
            }
        } else if (this.Type === "Bar") {
            let BarWidth = (GraphWidth / this.Data.length) * 0.5;
            for (let _ = 0; _ < this.Data.length; _++) {
                let Px = Padding + ((this.Data[_][0] - Xmn) / (Xmx - Xmn)) * GraphWidth;
                let Py = Padding + GraphHeight - ((this.Data[_][1] - Ymn) / (Ymx - Ymn)) * GraphHeight;
                let BarHeight = Padding + GraphHeight - Py;
                DrawRect(Px - BarWidth / 2, Py, BarWidth, BarHeight, LineColor)
            }
        } else if (this.Type === "Area") {
            Ctx.beginPath();
            for (let _ = 0; _ < this.Data.length; _++) {
                let Px = Padding + ((this.Data[_][0] - Xmn) / (Xmx - Xmn)) * GraphWidth;
                let Py = Padding + GraphHeight - ((this.Data[_][1] - Ymn) / (Ymx - Ymn)) * GraphHeight;
                if (_ === 0) Ctx.moveTo(Px, Py);
                else Ctx.lineTo(Px, Py);
            }
            Ctx.lineTo(Padding + GraphWidth, Padding + GraphHeight);
            Ctx.lineTo(Padding, Padding + GraphHeight);
            Ctx.closePath();
            Ctx.fillStyle = "rgba(0, 100, 255, 0.3)";
            Ctx.fill();
            for (let _ = 1; _ < this.Data.length; _++) {
                let Px0 = Padding + ((this.Data[_ - 1][0] - Xmn) / (Xmx - Xmn)) * GraphWidth;
                let Py0 = Padding + GraphHeight - ((this.Data[_ - 1][1] - Ymn) / (Ymx - Ymn)) * GraphHeight;
                let Px1 = Padding + ((this.Data[_][0] - Xmn) / (Xmx - Xmn)) * GraphWidth;
                let Py1 = Padding + GraphHeight - ((this.Data[_][1] - Ymn) / (Ymx - Ymn)) * GraphHeight;
                DrawLine(Px0, Py0, Px1, Py1, this.Options.Style.LineThickness, LineColor);
            }
        } else if (this.Type === "Step") {
            for (let _ = 1; _ < this.Data.length; _++) {
                let Px0 = Padding + ((this.Data[_ - 1][0] - Xmn) / (Xmx - Xmn)) * GraphWidth;
                let Py0 = Padding + GraphHeight - ((this.Data[_ - 1][1] - Ymn) / (Ymx - Ymn)) * GraphHeight;
                let Px1 = Padding + ((this.Data[_][0] - Xmn) / (Xmx - Xmn)) * GraphWidth;
                let Py1 = Padding + GraphHeight - ((this.Data[_][1] - Ymn) / (Ymx - Ymn)) * GraphHeight;
                DrawLine(Px0, Py0, Px1, Py0, this.Options.Style.LineThickness, LineColor);
                DrawLine(Px1, Py0, Px1, Py1, this.Options.Style.LineThickness, LineColor);
            }
        } else if (this.Type === "Spline") {
            Ctx.beginPath();
            for (let _ = 0; _ < this.Data.length; _++) {
                let Px = Padding + ((this.Data[_][0] - Xmn) / (Xmx - Xmn)) * GraphWidth;
                let Py = Padding + GraphHeight - ((this.Data[_][1] - Ymn) / (Ymx - Ymn)) * GraphHeight;
                if (_ === 0) Ctx.moveTo(Px, Py);
                else {
                    let PxPrev = Padding + ((this.Data[_ - 1][0] - Xmn) / (Xmx - Xmn)) * GraphWidth;
                    let PyPrev = Padding + GraphHeight - ((this.Data[_ - 1][1] - Ymn) / (Ymx - Ymn)) * GraphHeight;
                    let Cx = (PxPrev + Px) / 2;
                    let Cy = (PyPrev + Py) / 2;
                    Ctx.quadraticCurveTo(PxPrev, PyPrev, Cx, Cy);
                }
            }
            Ctx.strokeStyle = LineColor;
            Ctx.lineWidth = this.Options.Style.LineThickness;
            Ctx.stroke();
        }
    }
};
