///<reference path="main.ts" />

//set button functions and input logic 
module Enviroment{
	var TOTALSECOUNDS = 0;
	export function setInputFunctions() {
		$("#solo-game").click(function() {
			if(checkUserData()){
				setTimer();
				MainView.startNewGame(false);
			}
		});

		$("#duo-game").click(function() {
			if(checkUserData()){
				setTimer();
				MainView.startNewGame(true);
			}
		});
		$("#move").click(function(){
			var currentChoice = $("input[type='checkbox']:checked:not([class])"),
				positionX = currentChoice.data("x"),
				positionY = currentChoice.data("y");

			if(positionX===null){
				alert('nie wybrales pola!');
				return;
			}

			MainView.nextMove(positionX, positionY);
			MainView.nextRound();
		})
	}
	export function EndGame(winner: number){
		// set inputs to unvailable
		$("input[type=checkbox]").attr("disabled", "true");
		// show popup with options
		// set name in popup 
		var winnerText: string = winner == 2 ?
								"Grę wygrał gracz " + $("#current-use").text() + " ,Gratulacje!" :
								"Spróbuj ponownie.";
		$("#game-winner").text(winnerText);
		$("#end-game").show();
	}

	function setTimer() {
		TOTALSECOUNDS = 0;
		setInterval(setTime, 1000);

	}

	export function setCheckBoxFunctions(){
		$('input[type="checkbox"]').on('change', function() {
			$('input[type="checkbox"]:not([class])').not(this).prop('checked', false);
		});
	}
	
	function checkUserData(){
		if($("#user-name").val()){
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

	function pad(val : number) {
		var valString = val + "";
		if (valString.length < 2) {
			return "0" + valString;
		}
		else {
			return valString;
		}
	}
}



