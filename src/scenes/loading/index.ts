import { GameObjects, Scene } from 'phaser';

export class LoadingScene extends Scene {
 private king! : GameObjects.Sprite;

  constructor() {
    super('loading-scene');
  }


  preload(): void {
	this.load.baseURL = 'assets/';
	// key: 'king'
	// path from baseURL to file: 'sprites/king.png'
	this.load.image('king', 'sprites/king.png');
} 

create(): void {
  this.king = this.add.sprite(100, 100, 'king');
}


}
