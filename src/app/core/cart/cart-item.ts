import { Model } from '../../core/model.model';
export interface CartItem {
  model: Model;
  price: number;
  imgUrl: string;
  itemTotal: number;
  units: string;
  printStatus: string;
  boundingVolume: string;
}
