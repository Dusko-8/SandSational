import Phaser from 'phaser';

type Particle = Phaser.Physics.Arcade.Image;

export class GameScene extends Phaser.Scene {
  private particles!: Phaser.Physics.Arcade.Group;
  private scoreText!: Phaser.GameObjects.Text;
  private particlesMined = 0;

  constructor() {
    super('GameScene');
  }

  create(): void {
    this.createParticleTexture();

    this.particles = this.physics.add.group({
      classType: Phaser.Physics.Arcade.Image,
      maxSize: 250
    });

    this.scoreText = this.add.text(20, 20, 'Particles: 0', {
      color: '#f7f4e8',
      fontFamily: 'monospace',
      fontSize: '20px'
    });

    this.input.on('pointerdown', (pointer: Phaser.Input.Pointer) => {
      this.mineParticle(pointer.x, pointer.y);
    });
  }

  update(): void {
    const height = this.scale.height;

    this.particles.children.each((child) => {
      const particle = child as Particle;

      if (particle.active && particle.y > height + 40) {
        this.particles.killAndHide(particle);
        particle.body?.stop();
      }

      return true;
    });
  }

  private mineParticle(x: number, y: number): void {
    const particle = this.particles.get(x, y, 'particle') as Particle | null;

    if (!particle) {
      return;
    }

    particle.setActive(true);
    particle.setVisible(true);
    particle.setCircle(5);
    particle.setVelocity(Phaser.Math.Between(-70, 70), Phaser.Math.Between(-260, -120));
    particle.setBounce(0.35);
    particle.setCollideWorldBounds(false);
    particle.setTint(Phaser.Display.Color.RandomRGB(140, 255).color);

    this.particlesMined += 1;
    this.scoreText.setText(`Particles: ${this.particlesMined}`);
    this.showFloatingNumber(x, y);
  }

  private showFloatingNumber(x: number, y: number): void {
    const text = this.add.text(x, y, '+1', {
      color: '#f6d365',
      fontFamily: 'monospace',
      fontSize: '16px'
    });

    this.tweens.add({
      targets: text,
      y: y - 36,
      alpha: 0,
      duration: 650,
      ease: 'Cubic.easeOut',
      onComplete: () => text.destroy()
    });
  }

  private createParticleTexture(): void {
    const graphics = this.make.graphics({ x: 0, y: 0 }, false);
    graphics.fillStyle(0xffffff, 1);
    graphics.fillCircle(6, 6, 6);
    graphics.generateTexture('particle', 12, 12);
    graphics.destroy();
  }
}

