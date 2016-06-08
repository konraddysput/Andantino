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
        function Game(size, status, hostAddress) {
            this.size = size;
            this.status = status;
            this.isPlayerOneMove = true;
            this.boardSize = size;
            this.isGameEnded = false;
            this.gameNodes = [];
            this.gameType = status;
            this._hostAddress = hostAddress;
            this.InitNodes();
            this._firstMove = true;
            console.log(this._hostAddress);
        }
        Game.prototype.EndGame = function () {
            this.isGameEnded = true;
        };
        Game.prototype.InitNodes = function () {
            for (var i = 0; i < this.boardSize; i++) {
                this.gameNodes[i] = [];
                for (var j = 0; j < this.boardSize; j++) {
                    this.gameNodes[i][j] = new GameLogic.Node(i, j);
                }
            }
        };
        Game.prototype.Move = function (positionX, positionY) {
            if (this.isGameEnded) {
                return false;
            }
            var node = GameLogic.NodeStatus.PlayerCheck;
            $("input[type='checkbox']:checked[data-x='" + positionX + "'][data-y='" + positionY + "']")
                .addClass(GameLogic.NodeStatus[GameLogic.NodeStatus.PlayerCheck])
                .attr("disabled", "true");
            this.gameNodes[positionY][positionX].changeNodeStatus(node);
            switch (this.gameType) {
                case GameLogic.GameStatus.playerVsBot:
                    this.AddPoints();
                    this.GetAIMove();
                    break;
                case GameLogic.GameStatus.playerVsPlayer:
                    //changing user move
                    this.isPlayerOneMove = !this.isPlayerOneMove;
                    break;
            }
        };
        Game.prototype.AddPoints = function () {
            //in a future we should add point after checking a game time
            var currentScore = parseInt($("#current-score").text()), currentTime = parseInt($("#minutes").text());
            currentScore += Math.round(50 / (currentTime + 1));
            $("#current-score").text(currentScore);
        };
        Game.prototype.GetAIMove = function () {
            if (this.isGameEnded) {
                return false;
            }
            $("#move-information").slideToggle();
            //if this is a first move we dont need to ask server for move position
            if (this._firstMove) {
                this.MakeFirstMove();
                $("#move-information").slideToggle();
            }
            else {
                //ajax request to api for next move
                //to request data in server we use jsonp because of cross origin resource sharing
                // function invoked after ajax call have been choosen by Andantino API
                $.ajax({
                    type: "GET",
                    dataType: "jsonp",
                    url: this._hostAddress + this.SendData()
                });
            }
        };
        Game.prototype.SetAIMove = function (positionY, positionX) {
            var node = GameLogic.NodeStatus.EnemyCheck;
            this.gameNodes[positionY][positionX].changeNodeStatus(node);
            console.log("X: " + positionX);
            console.log("Y: " + positionY);
            $("input[type='checkbox'][data-x='" + positionX + "'][data-y='" + positionY + "']")
                .prop("checked", "checked")
                .addClass(GameLogic.NodeStatus[GameLogic.NodeStatus.EnemyCheck])
                .attr("disabled", "true");
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
        Game.prototype.MakeFirstMove = function () {
            var widthMove = this.CheckPossibleWidth(), currentWidth = parseInt($("." + GameLogic.NodeStatus[GameLogic.NodeStatus.PlayerCheck]).first().attr("data-x")), heightMove = parseInt($("." + GameLogic.NodeStatus[GameLogic.NodeStatus.PlayerCheck]).first().attr("data-y"));
            this.SetAIMove(heightMove, currentWidth + widthMove);
            this._firstMove = false;
        };
        Game.prototype.CheckPossibleWidth = function () {
            var widthPosition = parseInt($("." + GameLogic.NodeStatus[GameLogic.NodeStatus.PlayerCheck]).attr("data-x"));
            if (widthPosition == 0) {
                return widthPosition + 1;
            }
            else if (widthPosition == 9) {
                return widthPosition - 1;
            }
            else {
                return Math.floor(Math.random() * 10) > 5 ? 1 : -1;
            }
        };
        //not using
        Game.prototype.CheckPossibleHeight = function () {
            var heightPosition = parseInt($("." + GameLogic.NodeStatus[GameLogic.NodeStatus.PlayerCheck]).attr("data-y"));
            if (heightPosition == 0) {
                return false;
            }
            else if (heightPosition == 9) {
                return true;
            }
            else {
                return Math.floor(Math.random() * 10) > 5;
            }
        };
        return Game;
    }());
    GameLogic.Game = Game;
})(GameLogic || (GameLogic = {}));
///<reference path="Game.ts" />
///<reference path="GameStatus.ts" />
///<reference path="NodeStatus.ts" />
///<reference path="Enviroment.ts" />
///<reference path='../../lib/jquery.d.ts' />
var MainView;
(function (MainView) {
    $(function () {
        Enviroment.setInputFunctions();
    });
    var USERNAME = "", CURRENTRELAY = 0, BOARDSIZE = 11, hostAddress = "http://localhost:18080/submitResult/";
    function getCurrentRelay() {
        return CURRENTRELAY;
    }
    MainView.getCurrentRelay = getCurrentRelay;
    function PerformMove(move) {
        if (move.winner != 0) {
            CURRENTGAME.EndGame();
            Enviroment.EndGame(move.winner);
            return true;
        }
        var positionX = parseInt(move.x), positionY = parseInt(move.y);
        if (positionX % 2 == 1) {
            positionX = positionX - 1;
        }
        positionX = positionX / 2;
        CURRENTGAME.SetAIMove(positionY, positionX);
        $("#move-information").slideToggle();
    }
    MainView.PerformMove = PerformMove;
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
        CURRENTGAME = new GameLogic.Game(BOARDSIZE, status, hostAddress);
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
        Enviroment.setCheckBoxFunctions();
    }
    function createBoard() {
        var verticalIndex = 0;
        for (verticalIndex; verticalIndex < BOARDSIZE; verticalIndex++) {
            $("#game-content").append("<div class='row board'></div>");
            for (var horizontalIndex = 0; horizontalIndex < BOARDSIZE; horizontalIndex++) {
                $("#game-content div:nth-child(" + (verticalIndex + 1) + ")").append(createCheckBox(verticalIndex, horizontalIndex));
            }
        }
    }
    function createCheckBox(verticalIndex, horizontalIndex) {
        var defaultInput = "<input type='checkbox' id='checkbox-" + verticalIndex + "-" + horizontalIndex + "' ", dataX = " data-x='", dataY = " data-y='", label = "<label for='checkbox-" + verticalIndex + "-" + horizontalIndex + "' > </label>";
        return defaultInput + dataY + verticalIndex + "'" + dataX + horizontalIndex + "' />" + label;
    }
    //function exists at the beggining to create specific board
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
    var TOTALSECOUNDS = 0, TOTALMOVES = 0;
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
            var currentChoice = $("input[type='checkbox']:checked:not([class])"), positionX = currentChoice.data("x"), positionY = currentChoice.data("y");
            if (positionX === null) {
                alert('nie wybrales pola!');
                return;
            }
            MainView.nextMove(positionX, positionY);
            MainView.nextRound();
        });
    }
    Enviroment.setInputFunctions = setInputFunctions;
    function EndGame(winner) {
        // set inputs to unvailable
        $("input[type=checkbox]").attr("disabled", "true");
        // show popup with options
        // set name in popup 
        var winnerText = winner == 2 ?
            "Grę wygrał gracz " + $("#current-use").text() + " ,Gratulacje!" :
            "Spróbuj ponownie.";
        $("#game-winner").text(winnerText);
        $("#end-game").show();
    }
    Enviroment.EndGame = EndGame;
    function setTimer() {
        TOTALSECOUNDS = 0;
        setInterval(setTime, 1000);
    }
    function setCheckBoxFunctions() {
        $('input[type="checkbox"]').on('change', function () {
            var currentPosition = {
                x: parseInt($(this).attr("data-x")),
                y: parseInt($(this).attr("data-y"))
            };
            $('input[type="checkbox"]:not([class])').not(this).prop('checked', false);
            if (!isMovePossible(currentPosition.x, currentPosition.y) && TOTALMOVES > 1) {
                $(this).prop('checked', false);
                return false;
            }
            $(this).prop('checked', true);
            TOTALMOVES++;
        });
    }
    Enviroment.setCheckBoxFunctions = setCheckBoxFunctions;
    function checkUpperOrLower(xposition, currentY) {
        var totalMoves = 0, startIndex = xposition - (currentY % 2);
        if (currentY < 0) {
            return 0;
        }
        else {
            for (var i = startIndex; i < (startIndex + 2); i++) {
                if ($("#checkbox-" + currentY + "-" + i).attr("disabled") === "disabled") {
                    totalMoves++;
                }
            }
            return totalMoves;
        }
    }
    function checkCurrent(xposition, yposition) {
        var totalMoves = 0;
        for (var i = xposition - 1; i < (xposition - 1 + 3); i++) {
            if ($("#checkbox-" + yposition + "-" + i).attr("disabled") === "disabled") {
                totalMoves++;
            }
        }
        return totalMoves;
    }
    function isMovePossible(xposition, yposition) {
        var possibleMoves = checkUpperOrLower(xposition, yposition - 1);
        possibleMoves = possibleMoves + checkCurrent(xposition, yposition);
        possibleMoves = possibleMoves + checkUpperOrLower(xposition, yposition + 1);
        console.log("Wkoło pionki:" + possibleMoves);
        return possibleMoves >= 2;
    }
    Enviroment.isMovePossible = isMovePossible;
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
