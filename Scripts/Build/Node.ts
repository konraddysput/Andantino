///<reference path='NodeStatus.ts' />
module GameLogic {
	export class Node {
		positionX: number;
		positionY: number;
		currentStatus: NodeStatus;

		constructor(newPositionX: number, newPositionY: number) {

			this.positionX = newPositionX;
			this.positionY = newPositionY;
			this.currentStatus = NodeStatus.UnChecked; 
		}

		public changeNodeStatus(newNodeStatus: NodeStatus) {
			this.currentStatus = newNodeStatus;
		}
	}
}
