import { Repository } from "./Repository";

export type SaveData = {
  id: number;
  startingSystem: number;
  access: number[];
};

export default class SaveRepository extends Repository<SaveData> {
  constructor(saveData) {
    super(saveData);
  }
}
