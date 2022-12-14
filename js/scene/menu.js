var MenuScene = function () {

    this.start = function () {
        var stage = GameApp.stage;

        var logo = this.logo = new PIXI.Text("Разрежь фигуру", { fontFamily: "Arial", fontSize: 32, fill: 0x000000, align: "center" });
        logo.anchor.set(0.5);
        stage.addChild(logo);

        var btnStart = this.btnStart = GameApp.createButton("Начать игру");
        btnStart.on("pointerup", function () {
            GameApp.changeScene("level");
        });
        stage.addChild(btnStart);

        var rateText = this.rateText = new PIXI.Text("Рейтинг: " + GameApp.rate + " баллов", { fontFamily: "Arial", fontSize: 20, fill: 0x000000, align: "center" });
        rateText.anchor.set(0.5);
        stage.addChild(rateText);
    };

    this.update = function () {

    };

    this.stop = function () {

    };

    this.resize = function (width, height) {
        this.logo.position.set(width / 2, 50);
        this.btnStart.position.set(width / 2, height / 2);
        this.rateText.position.set(width / 2, height - 50);
    };

};
