import Phaser from 'phaser';

type SandGrain = Phaser.GameObjects.Image;

type SandSlot = {
  x: number;
  y: number;
  slideStartY: number;
};

type MainMenuItem = {
  key: string;
  label: string;
  status: string;
};

type MenuButton = {
  item: MainMenuItem;
  container: Phaser.GameObjects.Container;
  background: Phaser.GameObjects.Rectangle;
  label: Phaser.GameObjects.Text;
  close: Phaser.GameObjects.Text;
};

type BorderSegments = {
  top: Phaser.GameObjects.Rectangle[];
  left: Phaser.GameObjects.Rectangle;
  right: Phaser.GameObjects.Rectangle;
  bottom: Phaser.GameObjects.Rectangle;
};

type ResourceKey = 'resource-sand' | 'resource-dirt' | 'resource-stone' | 'resource-gold' | 'resource-emerald';

type ResourceDrop = {
  key: ResourceKey;
  label: string;
  chance: number;
};

export class GameScene extends Phaser.Scene {
  private readonly grainSize = 16;
  private readonly playfieldPadding = 24;
  private readonly floorHeight = 56;
  private readonly dropSpeed = 3200;
  private readonly slideSpeed = 2600;
  private readonly terminalInset = 34;
  private readonly minWorldScale = 0.24;
  private readonly zoomStep = 0.76;
  private readonly pileTopLimit = 176;
  private readonly resourceDrops: ResourceDrop[] = [
    { key: 'resource-sand', label: 'SAND', chance: 58 },
    { key: 'resource-dirt', label: 'DIRT', chance: 20 },
    { key: 'resource-stone', label: 'STONE', chance: 14 },
    { key: 'resource-gold', label: 'GOLD', chance: 6 },
    { key: 'resource-emerald', label: 'EMERALD', chance: 2 }
  ];
  private readonly mainMenuItems: MainMenuItem[] = [
    {
      key: 'upgrades',
      label: 'UPGRADES',
      status: '> upgrades menu selected'
    },
    {
      key: 'research',
      label: 'LAB',
      status: '> lab research menu selected'
    },
    {
      key: 'traders',
      label: 'TRADERS',
      status: '> traders menu selected'
    },
    {
      key: 'marketplace',
      label: 'MARKET',
      status: '> marketplace menu selected'
    },
    {
      key: 'ascend',
      label: 'ASCEND',
      status: '> prestige ascend menu selected'
    },
    {
      key: 'leaderboards',
      label: 'BOARDS',
      status: '> leaderboards menu selected'
    }
  ];

  private sand!: Phaser.GameObjects.Group;
  private playfieldBackground!: Phaser.GameObjects.Image;
  private scanlineBackground!: Phaser.GameObjects.TileSprite;
  private ground!: Phaser.GameObjects.Rectangle;
  private borderSegments!: BorderSegments;
  private moneyText!: Phaser.GameObjects.Text;
  private zoomText!: Phaser.GameObjects.Text;
  private resourcePreview!: Phaser.GameObjects.Container;
  private resourceCounterTexts = new Map<ResourceKey, Phaser.GameObjects.Text>();
  private menuTitle!: Phaser.GameObjects.Text;
  private menuButtons: MenuButton[] = [];
  private menuPanel?: Phaser.GameObjects.Container;
  private money = 0;
  private resourceCounts: Record<ResourceKey, number> = {
    'resource-sand': 0,
    'resource-dirt': 0,
    'resource-stone': 0,
    'resource-gold': 0,
    'resource-emerald': 0
  };
  private settledSand = 0;
  private lastAutoDrop = 0;
  private worldScale = 1;
  private worldOriginX = 0;
  private worldBaseY = 0;

  constructor() {
    super('GameScene');
  }

  create(): void {
    this.createWorld();

    this.sand = this.add.group({
      classType: Phaser.GameObjects.Image
    });

    this.createResourcePreview();
    this.createMainMenu();

    this.input.on('pointerdown', (pointer: Phaser.Input.Pointer) => {
      this.mineSand(pointer.x, pointer.y, 8);
    });

    this.scale.on('resize', this.resizeWorld, this);
  }

  update(time: number): void {
    if (time - this.lastAutoDrop > 14) {
      this.lastAutoDrop = time;
      this.dropSand(this.worldOriginX);
    }

    this.sand.children.each((child) => {
      const grain = child as SandGrain;
      const phase = String(grain.getData('phase') ?? 'settled');

      if (!grain.active || phase === 'settled') {
        return true;
      }

      const deltaSeconds = this.game.loop.delta / 1000;
      const targetX = Number(grain.getData('targetX'));
      const targetY = Number(grain.getData('targetY'));

      if (phase === 'drop') {
        grain.x = Number(grain.getData('spawnX'));
        grain.y += this.dropSpeed * deltaSeconds;

        if (grain.y >= Number(grain.getData('slideStartY'))) {
          grain.setData('phase', 'slide');
        }
      } else if (phase === 'slide') {
        grain.x = this.moveTowards(grain.x, targetX, this.slideSpeed * deltaSeconds);
        grain.y = this.moveTowards(grain.y, targetY, this.slideSpeed * deltaSeconds);

        if (grain.x === targetX && grain.y === targetY) {
          grain.setPosition(targetX, targetY);
          grain.setData('phase', 'settled');
          grain.setDepth(3);
        }
      }

      return true;
    });
  }

  private moveTowards(current: number, target: number, maxDelta: number): number {
    if (Math.abs(target - current) <= maxDelta) {
      return target;
    }

    return current + Math.sign(target - current) * maxDelta;
  }

  private createWorld(): void {
    this.cameras.main.setBackgroundColor('#050604');
    this.worldOriginX = this.scale.width / 2;
    this.worldBaseY = this.innerBottomY(this.scale.height);

    this.add.rectangle(0, 0, this.scale.width, this.scale.height, 0x050604)
      .setOrigin(0)
      .setDepth(-10);

    this.createTerminalBackgroundTexture();

    this.playfieldBackground = this.add.image(
      this.scale.width / 2,
      this.scale.height / 2,
      'background-main'
    )
      .setDepth(-9)
      .setAlpha(0.72);
    this.fitPlayfieldBackground(this.scale.width, this.scale.height);

    this.scanlineBackground = this.add.tileSprite(
      this.scale.width / 2,
      this.scale.height / 2,
      this.innerWidth(this.scale.width),
      this.innerHeight(this.scale.height),
      'terminal-scanline'
    )
      .setAlpha(0.22)
      .setDepth(-7);

    this.add.text(this.scale.width / 2, this.playfieldPadding + 18, 'SANDSATIONAL MINING TERMINAL', {
      color: '#164f24',
      fontFamily: 'monospace',
      fontSize: '13px'
    }).setOrigin(0.5).setDepth(-6);

    this.borderSegments = this.createBorderSegments();

    this.ground = this.add.rectangle(
      this.scale.width / 2,
      this.innerBottomY(this.scale.height),
      this.scale.width - this.playfieldPadding * 2,
      2,
      0x050604,
      0
    ).setDepth(2);
  }

  private resizeWorld(gameSize: Phaser.Structs.Size): void {
    this.fitPlayfieldBackground(gameSize.width, gameSize.height);
    this.playfieldBackground.setPosition(gameSize.width / 2, this.innerCenterY(gameSize.height));
    this.scanlineBackground.setPosition(gameSize.width / 2, this.innerCenterY(gameSize.height));
    this.scanlineBackground.setSize(
      this.innerWidth(gameSize.width),
      this.innerHeight(gameSize.height)
    );
    this.ground.setPosition(gameSize.width / 2, this.innerBottomY(gameSize.height));
    this.ground.setSize(gameSize.width - this.playfieldPadding * 2, 2);

    this.layoutMainMenu(gameSize.width, gameSize.height);
    this.layoutResourcePreview(gameSize.width);
  }

  private fitPlayfieldBackground(width: number, height: number): void {
    const innerWidth = this.innerWidth(width);
    const innerHeight = this.innerHeight(height);

    this.playfieldBackground.setPosition(width / 2, this.innerCenterY(height));
    this.playfieldBackground.setDisplaySize(
      innerWidth,
      innerHeight
    );
  }

  private innerWidth(width: number): number {
    return width - this.playfieldPadding * 2;
  }

  private innerHeight(height: number): number {
    return height - this.playfieldPadding * 2;
  }

  private innerCenterY(height: number): number {
    return height / 2;
  }

  private innerBottomY(height: number): number {
    return height - this.playfieldPadding;
  }

  private createBorderSegments(): BorderSegments {
    const top = Array.from({ length: this.mainMenuItems.length + 1 }, () =>
      this.add.rectangle(0, 0, 1, 2, 0x17ff5f, 0.72).setOrigin(0, 0.5).setDepth(19)
    );
    const left = this.add.rectangle(0, 0, 2, 1, 0x17ff5f, 0.72).setOrigin(0.5, 0).setDepth(19);
    const right = this.add.rectangle(0, 0, 2, 1, 0x17ff5f, 0.72).setOrigin(0.5, 0).setDepth(19);
    const bottom = this.add.rectangle(0, 0, 1, 2, 0x17ff5f, 0.72).setOrigin(0, 0.5).setDepth(19);

    return {
      top,
      left,
      right,
      bottom
    };
  }

  private createTerminalBackgroundTexture(): void {
    const graphics = this.make.graphics({ x: 0, y: 0 }, false);
    graphics.fillStyle(0x17ff5f, 0.16);
    graphics.fillRect(0, 0, 4, 1);
    graphics.fillStyle(0x000000, 0);
    graphics.fillRect(0, 1, 4, 3);
    graphics.generateTexture('terminal-scanline', 4, 4);
    graphics.destroy();
  }

  private createResourcePreview(): void {
    this.resourcePreview = this.add.container(20, 58).setDepth(20);

    const title = this.add.text(0, 0, 'COUNTS', {
      color: '#8dffad',
      fontFamily: 'monospace',
      fontSize: '13px'
    });

    this.resourcePreview.add(title);

    this.moneyText = this.add.text(86, 0, 'MONEY: $0', {
      color: '#efca76',
      fontFamily: 'monospace',
      fontSize: '13px'
    });

    this.zoomText = this.add.text(188, 0, 'VIEW: 100%', {
      color: '#8dffad',
      fontFamily: 'monospace',
      fontSize: '13px'
    });

    this.resourcePreview.add([this.moneyText, this.zoomText]);

    this.resourceDrops.forEach((asset, index) => {
      const y = 32 + index * 26;
      const icon = this.add.image(0, y + 10, asset.key);
      icon.setDisplaySize(22, 22);
      icon.setOrigin(0, 0.5);

      const label = this.add.text(30, y, `${asset.label}: 0`, {
        color: '#d8ffdf',
        fontFamily: 'monospace',
        fontSize: '12px'
      });

      this.resourceCounterTexts.set(asset.key, label);
      this.resourcePreview.add([icon, label]);
    });

    this.layoutResourcePreview(this.scale.width);
  }

  private layoutResourcePreview(width: number): void {
    if (!this.resourcePreview) {
      return;
    }

    const compact = width < 920;
    this.resourcePreview.setPosition(this.playfieldPadding + 8, compact ? 64 : 58);
    this.resourcePreview.setScale(compact ? 0.76 : 0.86);
  }

  private createMainMenu(): void {
    this.menuTitle = this.add.text(0, 0, 'TERMINAL TABS', {
      color: '#8dffad',
      fontFamily: 'monospace',
      fontSize: '12px'
    }).setDepth(20);
    this.menuTitle.setVisible(false);

    this.menuButtons = this.mainMenuItems.map((item) => this.createMenuButton(item));
    this.layoutMainMenu(this.scale.width, this.scale.height);
  }

  private createMenuButton(item: MainMenuItem): MenuButton {
    const container = this.add.container(0, 0).setDepth(20);
    const background = this.add.rectangle(0, 0, 148, 34, 0x071207, 0.96)
      .setOrigin(0, 0)
      .setStrokeStyle(1, 0x17ff5f, 0.9)
      .setInteractive({ useHandCursor: true });
    const label = this.add.text(74, 17, item.label, {
      color: '#d8ffdf',
      fontFamily: 'monospace',
      fontSize: '12px'
    }).setOrigin(0.5);
    const close = this.add.text(126, 9, 'x', {
      color: '#baffc8',
      fontFamily: 'monospace',
      fontSize: '12px'
    });

    background.on('pointerover', () => {
      background.setFillStyle(0x103d19, 1);
      label.setColor('#ffffff');
    });

    background.on('pointerout', () => {
      background.setFillStyle(0x071207, 0.96);
      label.setColor('#d8ffdf');
    });

    background.on('pointerdown', (pointer: Phaser.Input.Pointer, _localX: number, _localY: number, event: Phaser.Types.Input.EventData) => {
      event.stopPropagation();
      this.openMenuPanel(item);
    });

    container.add([background, label, close]);

    return {
      item,
      container,
      background,
      label,
      close
    };
  }

  private layoutMainMenu(width: number, height: number): void {
    const compact = width < 860;
    const gap = 8;
    const availableWidth = width - this.playfieldPadding * 2;
    const buttonWidth = compact
      ? Math.max(86, (availableWidth - gap * (this.menuButtons.length - 1)) / this.menuButtons.length)
      : Math.min(150, (availableWidth - gap * (this.menuButtons.length - 1)) / this.menuButtons.length);
    const buttonHeight = compact ? 30 : 34;
    const totalWidth = buttonWidth * this.menuButtons.length + gap * (this.menuButtons.length - 1);
    const startX = this.playfieldPadding + 8;
    const startY = this.playfieldPadding - buttonHeight / 2;
    const topLineY = this.playfieldPadding;
    const rightEdge = width - this.playfieldPadding;

    this.menuTitle.setPosition(startX, startY + buttonHeight + 4);

    this.menuButtons.forEach((button, index) => {
      const x = startX + index * (buttonWidth + gap);
      const y = startY;

      button.background.setSize(buttonWidth, buttonHeight);
      button.label.setPosition(buttonWidth / 2, buttonHeight / 2);
      button.label.setFontSize(compact ? 10 : 12);
      button.close.setPosition(buttonWidth - 18, compact ? 7 : 9);
      button.container.setPosition(x, y);
    });

    const tabRanges = this.menuButtons.map((_button, index) => {
      const x = startX + index * (buttonWidth + gap);
      return {
        start: x,
        end: Math.min(rightEdge, x + buttonWidth)
      };
    });

    this.layoutBorderSegments(width, height, tabRanges, topLineY);

    this.repositionMenuPanel(width, height);
  }

  private layoutBorderSegments(
    width: number,
    height: number,
    tabRanges: Array<{ start: number; end: number }>,
    topLineY: number
  ): void {
    const leftEdge = this.playfieldPadding;
    const rightEdge = width - this.playfieldPadding;
    const bottomY = height - this.playfieldPadding;
    const lineGap = 5;

    let cursor = leftEdge;
    this.borderSegments.top.forEach((segment, index) => {
      const range = tabRanges[index];
      const end = range ? Math.max(cursor, range.start - lineGap) : rightEdge;
      segment.setPosition(cursor, topLineY);
      segment.setSize(Math.max(0, end - cursor), 2);
      cursor = range ? Math.min(rightEdge, range.end + lineGap) : rightEdge;
    });

    this.borderSegments.left.setPosition(leftEdge, topLineY);
    this.borderSegments.left.setSize(2, bottomY - topLineY);
    this.borderSegments.right.setPosition(rightEdge, topLineY);
    this.borderSegments.right.setSize(2, bottomY - topLineY);
    this.borderSegments.bottom.setPosition(leftEdge, bottomY);
    this.borderSegments.bottom.setSize(rightEdge - leftEdge, 2);
  }

  private openMenuPanel(item: MainMenuItem): void {
    this.menuPanel?.destroy();

    const panel = this.add.container(0, 0).setDepth(30);
    const width = Math.min(480, this.scale.width - 36);
    const height = 126;
    const background = this.add.rectangle(0, 0, width, height, 0x020802, 0.96)
      .setOrigin(0.5)
      .setStrokeStyle(1, 0x17ff5f, 0.92);
    const title = this.add.text(-width / 2 + 16, -height / 2 + 16, item.label, {
      color: '#8dffad',
      fontFamily: 'monospace',
      fontSize: '18px'
    });
    const body = this.add.text(-width / 2 + 16, -height / 2 + 50, 'Interface placeholder. Backend endpoints are planned for this menu.', {
      color: '#17ff5f',
      fontFamily: 'monospace',
      fontSize: '13px',
      wordWrap: { width: width - 32 }
    });
    const close = this.add.text(width / 2 - 28, -height / 2 + 12, 'X', {
      color: '#17ff5f',
      fontFamily: 'monospace',
      fontSize: '18px'
    }).setInteractive({ useHandCursor: true });

    close.on('pointerdown', (_pointer: Phaser.Input.Pointer, _localX: number, _localY: number, event: Phaser.Types.Input.EventData) => {
      event.stopPropagation();
      panel.destroy();
      this.menuPanel = undefined;
    });

    panel.add([background, title, body, close]);
    this.menuPanel = panel;
    this.repositionMenuPanel(this.scale.width, this.scale.height);
  }

  private repositionMenuPanel(width: number, height: number): void {
    if (!this.menuPanel) {
      return;
    }

    const compact = width < 760;
    this.menuPanel.setPosition(width / 2, compact ? 238 : 178);
  }

  private mineSand(x: number, y: number, amount: number): void {
    for (let index = 0; index < amount; index += 1) {
      this.dropSand(x);
    }

    this.money += amount;
    this.moneyText.setText(`MONEY: $${this.money}`);
    this.showFloatingNumber(x, y, amount);
  }

  private dropSand(spawnX: number): void {
    this.ensurePileHasRoom();

    const slotIndex = this.settledSand;
    const slot = this.getSandSlot(slotIndex);
    const resourceKey = this.pickResourceKey();
    const clampedSpawnX = this.clampSpawnX(spawnX);
    const grain = this.createGrain(resourceKey, clampedSpawnX);

    if (!grain) {
      return;
    }

    grain.setActive(true);
    grain.setVisible(true);
    grain.setTexture(resourceKey);
    grain.setDisplaySize(this.currentGrainSize, this.currentGrainSize);
    grain.setOrigin(0.5);
    grain.setAngle(0);
    grain.setDepth(4);
    grain.clearTint();
    grain.setData('phase', 'drop');
    grain.setData('slotIndex', slotIndex);
    grain.setData('spawnX', clampedSpawnX);
    grain.setData('targetX', slot.x);
    grain.setData('targetY', slot.y);
    grain.setData('slideStartY', slot.slideStartY);

    this.trackResource(resourceKey);
    this.settlePileCount();
  }

  private createGrain(resourceKey: ResourceKey, spawnX: number): SandGrain {
    const grain = this.add.image(spawnX, this.playfieldPadding, resourceKey);
    this.sand.add(grain);

    return grain;
  }

  private clampSpawnX(spawnX: number): number {
    return Phaser.Math.Clamp(
      spawnX,
      this.playfieldPadding + this.currentGrainSize / 2,
      this.scale.width - this.playfieldPadding - this.currentGrainSize / 2
    );
  }

  private get currentGrainSize(): number {
    return this.grainSize * this.worldScale;
  }

  private pickResourceKey(): ResourceKey {
    const totalChance = this.resourceDrops.reduce((total, resource) => total + resource.chance, 0);
    let roll = Phaser.Math.Between(1, totalChance);

    for (const resource of this.resourceDrops) {
      roll -= resource.chance;

      if (roll <= 0) {
        return resource.key;
      }
    }

    return 'resource-sand';
  }

  private trackResource(resourceKey: ResourceKey): void {
    this.resourceCounts[resourceKey] += 1;

    const resource = this.resourceDrops.find((drop) => drop.key === resourceKey);
    const counterText = this.resourceCounterTexts.get(resourceKey);

    if (resource && counterText) {
      counterText.setText(`${resource.label}: ${this.resourceCounts[resourceKey]}`);
    }
  }

  private ensurePileHasRoom(): void {
    let nextSlot = this.getSandSlot(this.settledSand);

    while (nextSlot.y <= this.pileTopLimit && this.worldScale > this.minWorldScale) {
      this.worldScale = Math.max(this.minWorldScale, this.worldScale * this.zoomStep);
      this.zoomText.setText(`VIEW: ${Math.round(this.worldScale * 100)}%`);
      this.reflowSettledResources();
      nextSlot = this.getSandSlot(this.settledSand);
    }
  }

  private reflowSettledResources(): void {
    this.sand.children.each((child) => {
      const grain = child as SandGrain;

      if (!grain.active) {
        return true;
      }

      const slotIndex = Number(grain.getData('slotIndex'));
      const slot = this.getSandSlot(slotIndex);
      grain.setDisplaySize(this.currentGrainSize, this.currentGrainSize);
      grain.setData('targetX', slot.x);
      grain.setData('targetY', slot.y);
      grain.setData('slideStartY', slot.slideStartY);

      if (grain.getData('phase') === 'settled') {
        grain.setPosition(slot.x, slot.y);
      }

      return true;
    });
  }

  private getSandSlot(pileIndex: number): SandSlot {
    const size = this.currentGrainSize;
    const ring = Math.ceil(Math.sqrt(pileIndex + 1)) - 1;
    const localIndex = pileIndex - ring * ring;
    const { offset, row } = this.getPyramidOffset(ring, localIndex);
    const x = this.worldOriginX + offset * size;
    const y = this.worldBaseY - row * size - size / 2;
    const slideDistance = Math.abs(offset) * size;

    return {
      x,
      y: Math.max(this.playfieldPadding + size / 2, y),
      slideStartY: Math.max(
        this.playfieldPadding + size / 2,
        y - slideDistance
      )
    };
  }

  private getPyramidOffset(ring: number, localIndex: number): { offset: number; row: number } {
    if (ring === 0) {
      return { offset: 0, row: 0 };
    }

    if (localIndex === ring * 2) {
      return { offset: 0, row: ring };
    }

    const pairIndex = Math.floor(localIndex / 2);
    const sign = localIndex % 2 === 0 ? 1 : -1;

    return {
      offset: (ring - pairIndex) * sign,
      row: pairIndex
    };
  }

  private settlePileCount(): void {
    this.settledSand += 1;
  }

  private showFloatingNumber(x: number, y: number, amount: number): void {
    const text = this.add.text(x, y, `+${amount} resources`, {
      color: '#efca76',
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
}
