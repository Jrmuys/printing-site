import { style, animate, animation, keyframes } from '@angular/animations';

// =========================
// Enum for referencing animations
// =========================
export enum AnimationType {
  Slide = 'scale',
}

// =========================
// Scale
// =========================
export const slideIn = animation([
  style({ transform: 'translateX(-100%)' }),
  animate('200ms ease-in', style({ transform: 'translateX(0%)' })),
]);

export const slideOut = animation([
  animate('200ms ease-in', style({ transform: 'translateX(0%)' })),
]);
