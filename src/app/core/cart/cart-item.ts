import { Model } from '../../core/model.model';
export interface CartItem {
  model: Model;
  price: number;
  imgUrl: string;
  itemTotal: number;
  printStatus: string;
  boundingVolume: string;
}
