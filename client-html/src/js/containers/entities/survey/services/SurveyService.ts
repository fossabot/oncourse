import { DefaultHttpService } from "../../../../common/services/HttpService";
import { SurveyApi, SurveyItem } from "@api/model";

class SurveyService {
  readonly surveyApi = new SurveyApi(new DefaultHttpService());

  public getSurveyItem(id: number): Promise<SurveyItem> {
    return this.surveyApi.get(id);
  }

  public updateSurveyItem(id: number, surveyItem: SurveyItem): Promise<any> {
    return this.surveyApi.update(id, surveyItem);
  }
}

export default new SurveyService();
