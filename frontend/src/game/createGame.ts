import Phaser from 'phaser';
import { BootScene } from './scenes/BootScene';
import { GameScene } from './scenes/GameScene';

export function createGame(parent: HTMLElement): Phaser.Game {
  return new Phaser.Game({
    type: Phaser.AUTO,
    parent,
    backgroundColor: '#14151a',
    scale: {
      mode: Phaser.Scale.RESIZE,
      width: window.innerWidth,
      height: window.innerHeight
    },
    physics: {
      default: 'arcade',
      arcade: {
        gravity: { x: 0, y: 420 },
        debug: false
      }
    },
    scene: [BootScene, GameScene]
  });
}
