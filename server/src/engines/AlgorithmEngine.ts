import { AlgorithmInput} from "../../../shared/types";
import { AlgorithmResult } from "../algorithms/interface";

export interface AlgorithmEngine {
  run(input: AlgorithmInput): AlgorithmResult;
}
