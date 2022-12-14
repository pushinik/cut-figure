var GameScene = function () {

    this.start = function () {
        var stage = GameApp.stage;

        var logo = this.logo = new PIXI.Text("", { fontFamily: "Arial", fontSize: 20, fill: 0x000000, align: "center" });
        logo.anchor.set(0.5);
        stage.addChild(logo);

        var timeText = this.timeText = new PIXI.Text("", { fontFamily: "Arial", fontSize: 32, fill: 0x000000, align: "center" });
        timeText.anchor.set(0.5);
        stage.addChild(timeText);

        var figure = this.figure = new PIXI.Graphics();
        stage.addChild(figure);

        var grPaint = this.grPaint = new PIXI.Graphics();
        stage.addChild(grPaint);

        var btnExit = this.btnExit = GameApp.createButton("x", 50);
        btnExit.on("pointerup", function () {
            GameApp.changeScene("level");
        });
        stage.addChild(btnExit);

        var btnReset = this.btnReset = GameApp.createButton(">", 50);
        btnReset.on("pointerup", function () {
            GameApp.changeScene("game");
        });
        stage.addChild(btnReset);

        stage.interactive = true;
        stage.hitArea = GameApp.app.screen;
        stage.on("pointerdown", this.startCut, this);
        stage.on("pointerup", this.stopCut, this);
        stage.on("pointerupoutside", this.stopCut, this);
        stage.on("pointermove", this.moveCut, this);

        this.startGame();
    };

    this.startCut = function (e) {
        this.startCutPos = { x: e.data.global.x, y: e.data.global.y };
    };

    this.moveCut = function (e) {
        var grPaint = this.grPaint;
        if (this.startCutPos != null) {
            this.endCutPos = { x: e.data.global.x, y: e.data.global.y };
            grPaint.clear();
            grPaint.lineStyle(4, 0xff0000, 1);
            grPaint.moveTo(this.startCutPos.x, this.startCutPos.y);
            grPaint.lineTo(this.endCutPos.x, this.endCutPos.y);
            grPaint.closePath();
        }
    };

    this.stopCut = function () {
        var win;
        var area;
        var points;
        var polygon;
        var newPoly;
        var width = GameApp.app.screen.width;
        var height = GameApp.app.screen.height;
        if (this.endCutPos != null) {
            for (var i = this.polygons.length - 1; i >= 0; i--) {
                polygon = this.polygons[i];
                points = this.getLinePoints(polygon, this.startCutPos.x - width / 2, this.startCutPos.y - height / 2, this.endCutPos.x - width / 2, this.endCutPos.y - height / 2);
                if (points.length == 4) {
                    newPoly = this.cutFigure(polygon, points[0], points[1], points[2], points[3]);
                    for (var j = 0; j < newPoly.length; j++) {
                        if ( this.calcArea(newPoly[j]) < 100 ) {
                            newPoly = [];
                            break;
                        }
                    }
                    if (newPoly.length > 0) {
                        this.polygons.splice(i, 1);
                        for (var j = 0; j < newPoly.length; j++) {
                            this.polygons.push(newPoly[j]);
                        }
                    }
                }
            }
            if (this.polygons.length == this.countCut) {
                area = this.calcArea(this.polygons[0]);
                win = true;
                for (var j = 1; j < this.polygons.length; j++) {
                    if ( Math.abs( area - this.calcArea(this.polygons[j]) ) > 6000 ) {
                        win = false;
                        break;
                    }
                }
                if (win) {
                    this.winGame();
                } else {
                    this.logo.text = "0 баллов";
                    this.stopGame();
                }
            }
            GameApp.resize();
        }
        this.grPaint.clear();
        this.startCutPos = null;
        this.endCutPos = null;
    };

    this.cutFigure = function (points, x1, y1, x2, y2) {
        var x;
        var y;
        var x3;
        var y3;
        var dx;
        var dy;
        var len;
        var angle;
        var points1 = [x1, y1, x2, y2];
        var points2 = [x1, y1, x2, y2];
        for (var i = 0; i < points.length; i += 2) {
            x3 = points[i];
            y3 = points[i + 1];
            x = ( x1 * x1 * x3 - 2 * x1 * x2 * x3 + x2 * x2 * x3 + x2 * (y1 - y2) * (y1 - y3) - x1 * (y1 - y2) * (y2 - y3) ) / ( (x1 - x2) * (x1 - x2) + (y1 - y2) * (y1 - y2) );
            y = ( x2 * x2 * y1 + x1 * x1 * y2 + x2 * x3 * (y2 - y1) - x1 * (x3 * (y2 - y1) + x2 * (y1 + y2)) + (y1 - y2) * (y1 - y2) * y3) / ( (x1 - x2) * (x1 - x2) + (y1 - y2) * (y1 - y2) );
            dx = x3 - x;
            dy = y3 - y;
            len = Math.sqrt(dx * dx + dy * dy);
            dx /= len;
            dy /= len;
            angle = Math.atan2(dy, dx);
            if (angle > 0) {
                points1.push(x3, y3);
            } else {
                points2.push(x3, y3);
            }
        }
        points1 = this.sortPoints(points1);
        points2 = this.sortPoints(points2);
        return [points1, points2];
    };

    this.getLinePoints = function (points, x1, y1, x2, y2) {
        var x3;
        var y3;
        var x4;
        var y4;
        var uA;
        var uB;
        var numA;
        var numB;
        var deNom;
		var foundPoints = [];
		for (var i = 0; i < points.length; i += 2) {
            x3 = points[i];
            y3 = points[i + 1];
            if (points[i + 2] != null) {
                x4 = points[i + 2];
                y4 = points[i + 3];
            } else {
                x4 = points[0];
                y4 = points[1];
            }
            deNom = (y4 - y3) * (x2 - x1) - (x4 - x3) * (y2 - y1);
            if (deNom != 0) {
                numA = (x4 - x3) * (y1 - y3) - (y4 - y3) * (x1 - x3);
                numB = (x2 - x1) * (y1 - y3) - (y2 - y1) * (x1 - x3);
                uA = numA / deNom;
                uB = numB / deNom;
                if (uA >= 0 && uA <= 1 && uB >= 0 && uB <= 1) {
                    foundPoints.push( x1 + ( uA * (x2 - x1) ), y1 + ( uA * (y2 - y1) ) );
                }
            }
        }
		return foundPoints;
	};

    this.startGame = function () {
        this.countCut = 2 + GameApp.sceneConfig.selectedLevel * 2;
        this.logo.text = "Разрежьте фигуру\nна равные части: " + this.countCut + " шт.";
        this.timeLeft = 20000;
        this.pause = false;
        this.polygons = [this.randomFigure()];
    };

    this.randomFigure = function () {
        var x;
        var y;
        var r;
        var points = [];
        var countAngles = 5 + Math.floor( Math.random() * 3 );
        var d = 2 * Math.PI / countAngles;
        d = 2 * d / 3 + d * Math.random() / 3;
        for (var i = 0; i < countAngles; i++) {
            r = 100 + Math.random() * 100;
            x = Math.cos(d * i) * r;
            y = Math.sin(d * i) * r;
            points.push(x, y);
        }
        return points;
    };

    this.sortPoints = function (polygon) {
        var center;
        var angles;
        var points = [];
        var pointsSorted;
        for (var i = 0; i < polygon.length; i += 2) {
            points.push({ x: polygon[i], y: polygon[i + 1] });
        }
        polygon = [];
        center = points.reduce(function (p, { x, y }) {
            p.x += x / points.length;
            p.y += y / points.length;
            return p;
        }, { x: 0, y: 0 });
        angles = points.map(function ({ x, y }) {
            return { x, y, angle: Math.atan2(y - center.y, x - center.x) * 180 / Math.PI };
        });
        pointsSorted = angles.sort(function (a, b) {
            return a.angle - b.angle;
        });
        for (var i = 0; i < pointsSorted.length; i++) {
            polygon.push(pointsSorted[i].x, pointsSorted[i].y);
        }
        return polygon;
    };

    this.calcArea = function (points) {
        var total = 0;
        for (var i = 0; i < points.length; i += 2) {
            var dX = points[i];
            var dY = points[i == points.length - 2 ? 1 : i + 3];
            var aX = points[i == points.length - 2 ? 0 : i + 2];
            var aY = points[i + 1];
            total += (dX * dY * 0.5);
            total -= (aX * aY * 0.5);
        }
        return Math.abs(total);
    };

    this.winGame = function () {
        this.logo.text = "+1 балл";
        this.stopGame();
        GameApp.addRate();
    };

    this.stopGame = function () {
        this.pause = true;
        this.timeText.visible = false;
        GameApp.stage.interactive = false;
    };

    this.update = function (dt) {
        if (!this.pause) {
            if (this.timeLeft - dt * PIXI.Ticker.shared.elapsedMS > 0) {
                this.timeLeft -= dt * PIXI.Ticker.shared.elapsedMS;
                this.timeText.text = Math.ceil(this.timeLeft / 1000) + " с";
            } else {
                this.logo.text = "Время вышло";
                this.stopGame();
            }
        }
    };

    this.stop = function () {
        var stage = GameApp.stage;
        stage.off("pointerdown", this.startCut);
        stage.off("pointerup", this.stopCut);
        stage.off("pointerupoutside", this.stopCut);
        stage.off("pointermove", this.moveCut);
        this.stopCut();
    };

    this.resize = function (width, height) {
        var color;
        var figure = this.figure;
        figure.position.set(width / 2, height / 2);
        figure.clear();
        for (var i = 0; i < this.polygons.length; i++) {
            color = 0xd0d0d0 + 0x2f2f2f * Math.random();
            figure.lineStyle(2, color * 0.5);
            figure.beginFill(color);
            figure.drawPolygon(this.polygons[i]);
            figure.endFill();
        }
        this.logo.position.set(width / 2, 50);
        this.timeText.position.set(width / 2, height - 50);
        this.btnExit.position.set(width - 30, 30);
        this.btnReset.position.set(width - 85, 30);
    };

};
