import dirtUrl from '../assets/resources/dirt.png';
import emeraldUrl from '../assets/resources/emerald.png';
import goldUrl from '../assets/resources/gold.png';
import sandUrl from '../assets/resources/sand.png';
import stoneUrl from '../assets/resources/stone.png';
import backgroundUrl from '../assets/backgrounds/background.png';

export const resourceAssets = [
  { key: 'resource-sand', label: 'SAND', url: sandUrl },
  { key: 'resource-dirt', label: 'DIRT', url: dirtUrl },
  { key: 'resource-stone', label: 'STONE', url: stoneUrl },
  { key: 'resource-gold', label: 'GOLD', url: goldUrl },
  { key: 'resource-emerald', label: 'EMERALD', url: emeraldUrl }
] as const;

export const backgroundAssets = [
  { key: 'background-main', url: backgroundUrl }
] as const;
