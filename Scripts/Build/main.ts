///<reference path="Game.ts" />
///<reference path="GameStatus.ts" />
///<reference path="NodeStatus.ts" />
///<reference path="Enviroment.ts" />
///<reference path='../../lib/jquery.d.ts' />
 module MainView{
 	$(function(){
		  Enviroment.setInputFunctions();
 	})
	var USERNAME = "",
		CURRENTRELAY=0,
		BOARDSIZE = 11,
		hostAddress = "http://localhost:18080/submitResult/"
	declare var CURRENTGAME:GameLogic.Game;

	export function getCurrentRelay(){
		return CURRENTRELAY;
	}

	export function PerformMove(move: any) {		
		var positionX: number = parseInt(move.x),
			positionY: number = parseInt(move.y);
		
		if (positionX % 2 == 1) {
			positionX = positionX - 1;
		}
		positionX = positionX / 2;	

		CURRENTGAME.SetAIMove(positionY, positionX);
		if (move.winner != 0) {
			CURRENTGAME.EndGame();
			Enviroment.EndGame(move.winner);
			return true;
		}
		$("#move-information").slideToggle();
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
		CURRENTGAME = new GameLogic.Game(BOARDSIZE, status, hostAddress);
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
		Enviroment.setCheckBoxFunctions();
	}

	function createBoard(){
		var verticalIndex = 0;
		for (verticalIndex; verticalIndex < BOARDSIZE; verticalIndex++) {
			$("#game-content").append("<div class='row board'></div>");
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
		return defaultInput + dataY + verticalIndex + "'" + dataX + horizontalIndex + "' />" + label		
	}
	//function exists at the beggining to create specific board
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