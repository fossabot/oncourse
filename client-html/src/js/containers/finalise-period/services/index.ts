import { DefaultHttpService } from "../../../common/services/HttpService";
import { FinalisePeriodApi, FinalisePeriodInfo } from "@api/model";

class FinaliseService {
  readonly finaliseApi = new FinalisePeriodApi(new DefaultHttpService());

  public getInfo(lockDate: string): Promise<FinalisePeriodInfo> {
    return this.finaliseApi.getInfo(lockDate || "");
  }

  public updateLockDate(lockDate: string): Promise<any> {
    return this.finaliseApi.updateLockDate(lockDate || "");
  }
}

export default new FinaliseService();
