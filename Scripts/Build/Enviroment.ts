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
			debugger;
			var currentChoice= $("input[type='checkbox']:checked"),
				positionX = currentChoice.data("x"),
				positionY = currentChoice.data("y");

			if(positionX===null){
				alert('nie wybrales pola!');
				return;
			}

			MainView.nextMove(positionX, positionY);
		})
	}

	function setTimer() {
		TOTALSECOUNDS = 0;
		setInterval(setTime, 1000);

	}

	export function setCheckBoxFunctions(){
		$('input[type="checkbox"]').on('change', function() {
			$('input[type="checkbox"]').not(this).prop('checked', false);
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



