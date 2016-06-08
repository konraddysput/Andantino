///<reference path='../../lib/jquery.d.ts' />
///<reference path='Node.ts' />
///<reference path='GameStatus.ts' />
///<reference path="main.ts" />
module GameLogic {
	export class Game {
		private gameNodes: Node[][];
		private isGameEnded: boolean;
		private boardSize: number;
		private gameType: GameStatus;
		private isPlayerOneMove: boolean 
		private _hostAddress: string;
		private _firstMove: boolean;

		
		constructor(public size: number, public status: GameStatus, hostAddress: string ) {
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

		public EndGame(){
			this.isGameEnded = true;
		}

		private InitNodes(){
			for (var i = 0; i < this.boardSize; i++) {
				this.gameNodes[i] = [];
				for (var j = 0; j < this.boardSize; j++) {
					this.gameNodes[i][j] = new Node(i, j);
				}
			}
		}

		public Move(positionX: number, positionY:number) {
			if (this.isGameEnded){
				return false;
			}
			var node = NodeStatus.PlayerCheck
			$("input[type='checkbox']:checked[data-x='" + positionX + "'][data-y='" + positionY + "']")
								.addClass(NodeStatus[NodeStatus.PlayerCheck])
								.attr("disabled","true");

			this.gameNodes[positionY][positionX].changeNodeStatus(node);

			switch (this.gameType) {
				case GameStatus.playerVsBot:
					this.AddPoints();
					this.GetAIMove();
					break;
				
				case GameStatus.playerVsPlayer:
					//changing user move
					this.isPlayerOneMove = !this.isPlayerOneMove;
					break;
			}
		}

		private AddPoints(){
			//in a future we should add point after checking a game time
			var currentScore: number = parseInt($("#current-score").text()),
				currentTime: number = parseInt($("#minutes").text());
			currentScore += Math.round(50/(currentTime+1));
			$("#current-score").text(currentScore);
		}

		private GetAIMove() {
			if (this.isGameEnded) {
				return false;
			}
			$("#move-information").slideToggle();
			//if this is a first move we dont need to ask server for move position
			if (this._firstMove){
				this.MakeFirstMove();
				$("#move-information").slideToggle();
			}
			else{				
				//ajax request to api for next move
				//to request data in server we use jsonp because of cross origin resource sharing
				// function invoked after ajax call have been choosen by Andantino API
				$.ajax({
					type: "GET",					
					dataType: "jsonp",
					url: this._hostAddress +this.SendData()
				});
			}
		}
		public SetAIMove(positionY:number, positionX:number){
			var node = NodeStatus.EnemyCheck;
			this.gameNodes[positionY][positionX].changeNodeStatus(node);
			console.log("X: " + positionX);
			console.log("Y: " + positionY);
			$("input[type='checkbox'][data-x='" + positionX + "'][data-y='" + positionY + "']")
				.prop("checked", "checked")
				.addClass(NodeStatus[NodeStatus.EnemyCheck])
				.attr("disabled", "true");
		}

		private SendData(){			
			var medium = Math.floor(this.boardSize / 2),
				data : number[][] = [];

			for (var i = 0; i < this.boardSize; i++) {
				var currentRow : number[] = [];
				for (var j = 0; j < this.boardSize; j++) {
					currentRow.push(this.gameNodes[i][j].currentStatus);
				}
				data.push(currentRow);
			}

			return JSON.stringify(data);
		}

		private MakeFirstMove(){
			var widthMove : number = this.CheckPossibleWidth(),
				currentWidth: number = parseInt($("." + NodeStatus[NodeStatus.PlayerCheck]).first().attr("data-x")),
				heightMove: number = parseInt($("." + NodeStatus[NodeStatus.PlayerCheck]).first().attr("data-y"));
			
			this.SetAIMove(heightMove, currentWidth + widthMove);	
			this._firstMove = false; 
		}
		private CheckPossibleWidth():number
		{			
			var widthPosition: number = parseInt($("." + NodeStatus[NodeStatus.PlayerCheck]).attr("data-x"));	
			if(widthPosition ==0){
				return widthPosition + 1;
			}
			else if(widthPosition == 9){
				return widthPosition - 1;
			}
			else{
				return Math.floor(Math.random() * 10) > 5 ? 1 : -1;
			}
		}
		//not using
		private CheckPossibleHeight():boolean
		{
			var heightPosition : number = parseInt($("." + NodeStatus[NodeStatus.PlayerCheck]).attr("data-y"));
			if (heightPosition == 0) {
				return false;
			}
			else if (heightPosition == 9) {
				return true;
			}
			else{
				return Math.floor(Math.random() * 10) > 5;
			}

		}
	}
}