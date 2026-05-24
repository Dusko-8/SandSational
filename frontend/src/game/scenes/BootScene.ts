import Phaser from 'phaser';
import { backgroundAssets, resourceAssets } from '../resourceAssets';

export class BootScene extends Phaser.Scene {
  constructor() {
    super('BootScene');
  }

  preload(): void {
    [...resourceAssets, ...backgroundAssets].forEach((asset) => {
      this.load.image(asset.key, asset.url);
    });
  }

  create(): void {
    this.scene.start('GameScene');
  }
}
