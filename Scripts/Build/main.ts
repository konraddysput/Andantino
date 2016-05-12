///<reference path="Game.ts" />
///<reference path="GameStatus.ts" />
///<reference path="Enviroment.ts" />
///<reference path='../../lib/jquery.d.ts' />
 module MainView{
 	$(function(){
		  Enviroment.setInputFunctions();
 	})
	var USERNAME = "",
		CURRENTRELAY=0,
		BOARDSIZE = 11;
	declare var CURRENTGAME:GameLogic.Game;

	export function getCurrentRelay(){
		return CURRENTRELAY;
	}

	export function nextRound(){
		CURRENTRELAY++;
		$("#current-relay").text(CURRENTRELAY);
	}

	export function nextMove(movePositionX:number, movePositionY:number){
		CURRENTGAME.Move(movePositionX, movePositionY);
	}

	export function startNewGame(gameType: boolean){
		beginGame();
		prepareForm();
		var status = GameLogic.GameStatus.playerVsPlayer;
		if(!gameType){
			status = GameLogic.GameStatus.playerVsBot;
		}
		CURRENTGAME = new GameLogic.Game(BOARDSIZE, status);
	}

	function beginGame(){
		CURRENTRELAY = 0;
		USERNAME = $("#user-name").val();
		$("#current-relay").text(CURRENTRELAY);
		gameView();	
	}

	//toggle does not show somehow checkboxes
	function gameView(){
		$("#login-content").hide();
		$("#game-content").show();
		$(".game-information").show();
	}

	function menuView(){
		$("#login-content").show();
		$("#game-content").hide();
		$(".game-information").toggle();
	}

	function prepareForm() {
		createBoard();
		hidePools();
		Enviroment.setCheckBoxFunctions();
	}

	function createBoard(){
		var verticalIndex = 0;
		for (verticalIndex; verticalIndex < BOARDSIZE; verticalIndex++) {
			$("#game-content").append("<div class='row'></div>");
			for (var horizontalIndex = 0; horizontalIndex < BOARDSIZE; horizontalIndex++) {

				$("#game-content div:nth-child(" + (verticalIndex + 1) + ")").append(createCheckBox(verticalIndex, horizontalIndex));
			}
		}
	}
	function createCheckBox(verticalIndex : number, horizontalIndex:number ) {
		var defaultInput = "<input type='checkbox' id='checkbox-" + verticalIndex + "-" + horizontalIndex + "' ",
			dataX = " data-x='",
			dataY = " data-y='",
			label = "<label for='checkbox-" + verticalIndex + "-" + horizontalIndex + "' > </label>";
		return defaultInput + dataX + verticalIndex + "'" + dataY + horizontalIndex + "' />" + label		
	}

	function hidePools(){
		var medium = Math.floor(BOARDSIZE / 2);
		for (var i = 0; i < medium; ++i) {
			for (var j = medium-1-i; j >= 0; j--) {
				$("label[for='checkbox-" + i + "-" + j + "']").addClass("not-available");
				$("label[for='checkbox-" + i + "-" + ((medium - j) + medium) + "']").addClass("not-available");

				$("label[for='checkbox-" + (BOARDSIZE - i - 1) + "-" + j + "']").addClass("not-available");
				$("label[for='checkbox-" + (BOARDSIZE - i - 1) + "-" + ((medium - j) + medium) + "']").addClass("not-available");
			}
		}
	}

}