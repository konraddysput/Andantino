
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

		constructor(public size: number, public status: GameStatus) {
			this.isPlayerOneMove = true;
			this.boardSize = size;
			this.isGameEnded = false;
			this.gameNodes = [];
			this.gameType = status;		
			this.InitNodes();	
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
			var node = NodeStatus.EnemyCheck	 

			if(!this.isPlayerOneMove){
				node = NodeStatus.PlayerCheck;
			}
			$("input[type='checkbox']:checked[data-x='" + positionX + "'][data-y='" + positionY + "']")
								.addClass(NodeStatus[NodeStatus.PlayerCheck]);
			this.gameNodes[positionX][positionY].changeNodeStatus(node);

			switch (this.gameType) {
				case GameStatus.playerVsBot:
					this.GetAIMove();
					break;
				
				case GameStatus.playerVsPlayer:
					//changing user move
					this.isPlayerOneMove = !this.isPlayerOneMove;
					break;
			}

			if(!this.isPlayerOneMove)
			{
				MainView.nextRound();	
			}	
		}

		private GetAIMove(){
			$("#move-information").slideToggle();
			this.SendData();
			//ajax request to api for next move
			$.ajax({
				type: "POST",
				url: "urlToApi",
				async: false,
				data: this.SendData(),
				success: function(data) {
					//set a new AI move in game table
					var AIMove = JSON.parse(data);
					this.SetAIMove(AIMove.X, AIMove.Y);					
				}
			});
			$("#move-information").slideToggle();
		}
		private SetAIMove(positionX:number, positionY:number){
			$("input[type='checkbox']:checked[data-x='" + positionX + "'][data-y='" + positionY + "']")
				.addClass(NodeStatus[NodeStatus.EnemyCheck]);
		}

		private SendData(){			
			var medium = Math.floor(this.boardSize / 2),
				data = [];

			for (var i = 0; i < this.boardSize; i++) {
				var currentRow = [];
				for (var j = 0; j < this.boardSize; j++) {
					currentRow.push(this.gameNodes[i][j].currentStatus);
				}
				data.push(currentRow);
			}

			return JSON.stringify(data);
		}
	}
}