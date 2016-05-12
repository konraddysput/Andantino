var GameLogic;
(function (GameLogic) {
    (function (NodeStatus) {
        NodeStatus[NodeStatus["UnChecked"] = 0] = "UnChecked";
        NodeStatus[NodeStatus["EnemyCheck"] = 1] = "EnemyCheck";
        NodeStatus[NodeStatus["PlayerCheck"] = 2] = "PlayerCheck";
        NodeStatus[NodeStatus["Current"] = 3] = "Current";
    })(GameLogic.NodeStatus || (GameLogic.NodeStatus = {}));
    var NodeStatus = GameLogic.NodeStatus;
})(GameLogic || (GameLogic = {}));
///<reference path='NodeStatus.ts' />
var GameLogic;
(function (GameLogic) {
    var Node = (function () {
        function Node(newPositionX, newPositionY) {
            this.positionX = newPositionX;
            this.positionY = newPositionY;
            this.currentStatus = GameLogic.NodeStatus.UnChecked;
        }
        Node.prototype.changeNodeStatus = function (newNodeStatus) {
            this.currentStatus = newNodeStatus;
        };
        return Node;
    }());
    GameLogic.Node = Node;
})(GameLogic || (GameLogic = {}));
var GameLogic;
(function (GameLogic) {
    (function (GameStatus) {
        GameStatus[GameStatus["playerVsPlayer"] = 0] = "playerVsPlayer";
        GameStatus[GameStatus["playerVsBot"] = 1] = "playerVsBot";
    })(GameLogic.GameStatus || (GameLogic.GameStatus = {}));
    var GameStatus = GameLogic.GameStatus;
})(GameLogic || (GameLogic = {}));
///<reference path='../../lib/jquery.d.ts' />
///<reference path='Node.ts' />
///<reference path='GameStatus.ts' />
///<reference path="main.ts" />
var GameLogic;
(function (GameLogic) {
    var Game = (function () {
        function Game(size, status) {
            this.size = size;
            this.status = status;
            this.isPlayerOneMove = true;
            this.boardSize = size;
            this.isGameEnded = false;
            this.gameNodes = [];
            this.gameType = status;
            this.InitNodes();
        }
        Game.prototype.InitNodes = function () {
            for (var i = 0; i < this.boardSize; i++) {
                this.gameNodes[i] = [];
                for (var j = 0; j < this.boardSize; j++) {
                    this.gameNodes[i][j] = new GameLogic.Node(i, j);
                }
            }
        };
        Game.prototype.Move = function (positionX, positionY) {
            var node = GameLogic.NodeStatus.EnemyCheck;
            if (!this.isPlayerOneMove) {
                node = GameLogic.NodeStatus.PlayerCheck;
            }
            $("input[type='checkbox']:checked[data-x='" + positionX + "'][data-y='" + positionY + "']")
                .addClass(GameLogic.NodeStatus[GameLogic.NodeStatus.PlayerCheck]);
            this.gameNodes[positionX][positionY].changeNodeStatus(node);
            switch (this.gameType) {
                case GameLogic.GameStatus.playerVsBot:
                    this.GetAIMove();
                    break;
                case GameLogic.GameStatus.playerVsPlayer:
                    //changing user move
                    this.isPlayerOneMove = !this.isPlayerOneMove;
                    break;
            }
            if (!this.isPlayerOneMove) {
                MainView.nextRound();
            }
        };
        Game.prototype.GetAIMove = function () {
            $("#move-information").slideToggle();
            this.SendData();
            //ajax request to api for next move
            $.ajax({
                type: "POST",
                url: "urlToApi",
                async: false,
                data: this.SendData(),
                success: function (data) {
                    //set a new AI move in game table
                    var AIMove = JSON.parse(data);
                    this.SetAIMove(AIMove.X, AIMove.Y);
                }
            });
            $("#move-information").slideToggle();
        };
        Game.prototype.SetAIMove = function (positionX, positionY) {
            $("input[type='checkbox']:checked[data-x='" + positionX + "'][data-y='" + positionY + "']")
                .addClass(GameLogic.NodeStatus[GameLogic.NodeStatus.EnemyCheck]);
        };
        Game.prototype.SendData = function () {
            var medium = Math.floor(this.boardSize / 2), data = [];
            for (var i = 0; i < this.boardSize; i++) {
                var currentRow = [];
                for (var j = 0; j < this.boardSize; j++) {
                    currentRow.push(this.gameNodes[i][j].currentStatus);
                }
                data.push(currentRow);
            }
            return JSON.stringify(data);
        };
        return Game;
    }());
    GameLogic.Game = Game;
})(GameLogic || (GameLogic = {}));
///<reference path="Game.ts" />
///<reference path="GameStatus.ts" />
///<reference path="Enviroment.ts" />
///<reference path='../../lib/jquery.d.ts' />
var MainView;
(function (MainView) {
    $(function () {
        Enviroment.setInputFunctions();
    });
    var USERNAME = "", CURRENTRELAY = 0, BOARDSIZE = 11;
    function getCurrentRelay() {
        return CURRENTRELAY;
    }
    MainView.getCurrentRelay = getCurrentRelay;
    function nextRound() {
        CURRENTRELAY++;
        $("#current-relay").text(CURRENTRELAY);
    }
    MainView.nextRound = nextRound;
    function nextMove(movePositionX, movePositionY) {
        CURRENTGAME.Move(movePositionX, movePositionY);
    }
    MainView.nextMove = nextMove;
    function startNewGame(gameType) {
        beginGame();
        prepareForm();
        var status = GameLogic.GameStatus.playerVsPlayer;
        if (!gameType) {
            status = GameLogic.GameStatus.playerVsBot;
        }
        CURRENTGAME = new GameLogic.Game(BOARDSIZE, status);
    }
    MainView.startNewGame = startNewGame;
    function beginGame() {
        CURRENTRELAY = 0;
        USERNAME = $("#user-name").val();
        $("#current-relay").text(CURRENTRELAY);
        gameView();
    }
    //toggle does not show somehow checkboxes
    function gameView() {
        $("#login-content").hide();
        $("#game-content").show();
        $(".game-information").show();
    }
    function menuView() {
        $("#login-content").show();
        $("#game-content").hide();
        $(".game-information").toggle();
    }
    function prepareForm() {
        createBoard();
        hidePools();
        Enviroment.setCheckBoxFunctions();
    }
    function createBoard() {
        var verticalIndex = 0;
        for (verticalIndex; verticalIndex < BOARDSIZE; verticalIndex++) {
            $("#game-content").append("<div class='row'></div>");
            for (var horizontalIndex = 0; horizontalIndex < BOARDSIZE; horizontalIndex++) {
                $("#game-content div:nth-child(" + (verticalIndex + 1) + ")").append(createCheckBox(verticalIndex, horizontalIndex));
            }
        }
    }
    function createCheckBox(verticalIndex, horizontalIndex) {
        var defaultInput = "<input type='checkbox' id='checkbox-" + verticalIndex + "-" + horizontalIndex + "' ", dataX = " data-x='", dataY = " data-y='", label = "<label for='checkbox-" + verticalIndex + "-" + horizontalIndex + "' > </label>";
        return defaultInput + dataX + verticalIndex + "'" + dataY + horizontalIndex + "' />" + label;
    }
    function hidePools() {
        var medium = Math.floor(BOARDSIZE / 2);
        for (var i = 0; i < medium; ++i) {
            for (var j = medium - 1 - i; j >= 0; j--) {
                $("label[for='checkbox-" + i + "-" + j + "']").addClass("not-available");
                $("label[for='checkbox-" + i + "-" + ((medium - j) + medium) + "']").addClass("not-available");
                $("label[for='checkbox-" + (BOARDSIZE - i - 1) + "-" + j + "']").addClass("not-available");
                $("label[for='checkbox-" + (BOARDSIZE - i - 1) + "-" + ((medium - j) + medium) + "']").addClass("not-available");
            }
        }
    }
})(MainView || (MainView = {}));
///<reference path="main.ts" />
//set button functions and input logic 
var Enviroment;
(function (Enviroment) {
    var TOTALSECOUNDS = 0;
    function setInputFunctions() {
        $("#solo-game").click(function () {
            if (checkUserData()) {
                setTimer();
                MainView.startNewGame(false);
            }
        });
        $("#duo-game").click(function () {
            if (checkUserData()) {
                setTimer();
                MainView.startNewGame(true);
            }
        });
        $("#move").click(function () {
            debugger;
            var currentChoice = $("input[type='checkbox']:checked"), positionX = currentChoice.data("x"), positionY = currentChoice.data("y");
            if (positionX === null) {
                alert('nie wybrales pola!');
                return;
            }
            MainView.nextMove(positionX, positionY);
        });
    }
    Enviroment.setInputFunctions = setInputFunctions;
    function setTimer() {
        TOTALSECOUNDS = 0;
        setInterval(setTime, 1000);
    }
    function setCheckBoxFunctions() {
        $('input[type="checkbox"]').on('change', function () {
            $('input[type="checkbox"]').not(this).prop('checked', false);
        });
    }
    Enviroment.setCheckBoxFunctions = setCheckBoxFunctions;
    function checkUserData() {
        if ($("#user-name").val()) {
            $(".current-use").text($("#user-name").val());
            return true;
        }
        $("#user-name").parent().addClass("has-error");
        return false;
    }
    function setTime() {
        ++TOTALSECOUNDS;
        var minutes = (TOTALSECOUNDS / 60).toString();
        $("#seconds").text(pad(TOTALSECOUNDS % 60));
        $("#minutes").text(pad(parseInt(minutes)));
    }
    function pad(val) {
        var valString = val + "";
        if (valString.length < 2) {
            return "0" + valString;
        }
        else {
            return valString;
        }
    }
})(Enviroment || (Enviroment = {}));
