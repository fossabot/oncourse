import { promiseResolve } from "../../MockAdapter";

export function CourseApiMock() {
  this.api.onGet(new RegExp(`v1/list/entity/course/\\d+`)).reply(config => {
    const params = config.url.split("/");
    const id = params[params.length - 1];
    return promiseResolve(config, this.db.getCourse(id));
  });
}
