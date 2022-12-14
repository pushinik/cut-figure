var LevelScene = function () {

    this.start = function () {
        var stage = GameApp.stage;

        this.maxLevels = 3;

        var logo = this.logo = new PIXI.Text("Выберите уровень", { fontFamily: "Arial", fontSize: 32, fill: 0x000000, align: "center" });
        logo.anchor.set(0.5);
        stage.addChild(logo);

        var btnExit = this.btnExit = GameApp.createButton("Вернуться в меню");
        btnExit.on("pointerup", function () {
            GameApp.changeScene("menu");
        });
        stage.addChild(btnExit);

        var btnLevel;
        var btnLevels = this.btnLevels = new PIXI.Container();
        for (var i = 0; i < this.maxLevels; i++) {
            btnLevel = this.btnLevel = GameApp.createButton( "Уровень " + (i + 1) );
            btnLevel.name = i;
            btnLevel.on("pointerup", function () {
                GameApp.sceneConfig = { selectedLevel: parseInt(this.name) };
                GameApp.changeScene("game");
            }, btnLevel);
            btnLevels.addChild(btnLevel);
        }
        stage.addChild(btnLevels);
    };

    this.update = function () {

    };

    this.stop = function () {

    };

    this.resize = function (width, height) {
        this.logo.position.set(width / 2, 50);

        this.btnExit.position.set(width / 2, height / 2 - this.btnLevels.children.length * 30);
        for (var i = 0; i < this.btnLevels.children.length; i++) {
            this.btnLevels.children[i].position.set(width / 2, height / 2 + i * 60 - (this.btnLevels.children.length - 2) * 30);
        }
    };

};
