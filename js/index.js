(function () {
    window.GameApp = {};

    GameApp.activeScene = "";
    GameApp.sceneConfig = {};
    GameApp.scenes = {};

    GameApp.createButton = function (text, width) {
        width = width || 200;
        var btn = new PIXI.Container();
        var bg = new PIXI.Graphics();
        bg.lineStyle(1, 0x808080);
        bg.beginFill(0xffffff);
        bg.drawRect(-width / 2, -25, width, 50);
        bg.endFill();
        btn.addChild(bg);
        var btnText = new PIXI.Text(text, { fontFamily: "Arial", fontSize: 20, fill: 0x000000, align: "center" });
        btnText.anchor.set(0.5);
        btn.addChild(btnText);
        btn.interactive = true;
        btn.buttonMode = true;
        btn.on("pointerover", function () {
            this.alpha = 0.5;
        }, btn);
        btn.on("pointerout", function () {
            this.alpha = 1;
        }, btn);
        return btn;
    };

    GameApp.resize = function () {
        if (GameApp.activeScene != "") {
            GameApp.scenes[GameApp.activeScene].resize(window.innerWidth, window.innerHeight);
        }
    };

    GameApp.changeScene = function (name) {
        var removedChilds;
        var stage = GameApp.stage;
        if (GameApp.activeScene != "") {
            PIXI.Ticker.shared.remove(GameApp.scenes[GameApp.activeScene].update, GameApp.scenes[GameApp.activeScene]);
            GameApp.scenes[GameApp.activeScene].stop();
        }
        removedChilds = stage.removeChildren();
        for (var i = 0; i < removedChilds.length; i++) {
            removedChilds[i].destroy();
        }
        if (GameApp.scenes[name] != null) {
            GameApp.activeScene = name;
            GameApp.scenes[name].start();
            GameApp.resize();
            PIXI.Ticker.shared.add(GameApp.scenes[name].update, GameApp.scenes[GameApp.activeScene]);
        }
    };

    GameApp.addRate = function () {
        GameApp.rate++;
        localStorage.setItem("game_rate", GameApp.rate);
        console.log(GameApp.rate);
    };

    GameApp.start = function () {
        GameApp.app = new PIXI.Application({ resizeTo: window, backgroundColor: 0xe1f6ff });
        var canvas = GameApp.app.view;
        canvas.style.position = "absolute";
        canvas.style.width = "100%";
        canvas.style.height = "100%";
        canvas.style.top = "0";
        canvas.style.left = "0";
        GameApp.stage = GameApp.app.stage;
        GameApp.scenes["start"] = new StartScene();
        GameApp.scenes["menu"] = new MenuScene();
        GameApp.scenes["level"] = new LevelScene();
        GameApp.scenes["game"] = new GameScene();
        GameApp.rate = parseInt( localStorage.getItem("game_rate") ) || 0;
        GameApp.changeScene("start");
        window.addEventListener("resize", GameApp.resize);
        document.body.appendChild(canvas);
    };

    window.addEventListener("load", GameApp.start);
})();
