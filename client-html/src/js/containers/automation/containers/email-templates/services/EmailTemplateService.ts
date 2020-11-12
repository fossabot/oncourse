/*
 * Copyright ish group pty ltd. All rights reserved. https://www.ish.com.au
 * No copying or use of this code is allowed without permission in writing from ish.
 */

import {DefaultHttpService} from "../../../../../common/services/HttpService";
import {EmailTemplate, EmailTemplateApi} from "@api/model";

class EmailTemplateService {
  readonly emailTemplateService = new EmailTemplateApi(new DefaultHttpService());

  public get(id: number): Promise<EmailTemplate> {
    return this.emailTemplateService.get(id);
  }

  public update(id: number, emailTemplate: EmailTemplate): Promise<any> {
    return this.emailTemplateService.update(id, emailTemplate);
  }

  public updateInternal(emailTemplate: EmailTemplate): Promise<any> {
    return this.emailTemplateService.updateInternal(emailTemplate);
  }

  public create(emailTemplate: EmailTemplate): Promise<any> {
    return this.emailTemplateService.create(emailTemplate);
  }

  public remove(id: number): Promise<any> {
    return this.emailTemplateService.remove(id);
  }
}

export default new EmailTemplateService();

