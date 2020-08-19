import { User } from './user.model';

export interface Model {
  id: string;
  title: string;
  modelPath: string;
  units: string;
  comment: string;
  quantity: number;
  user: User;
}
