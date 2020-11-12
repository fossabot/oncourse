/*
 * Copyright ish group pty ltd. All rights reserved. https://www.ish.com.au
 * No copying or use of this code is allowed without permission in writing from ish.
 */

import * as EpicUtils from "../../../../../../common/epics/EpicUtils";
import { State } from "../../../../../../reducers/state";
import FetchErrorHandler from "../../../../../../common/api/fetch-errors-handlers/FetchErrorHandler";
import { Epic } from "redux-observable";
import { UPDATE_COURSE_CLASS_STUDENT_ATTENDANCE } from "../actions";
import CourseClassAttendanceService from "../services/CourseClassAttendanceService";
import { StudentAttendance } from "@api/model";

const request: EpicUtils.Request<any, State, { id: number; studentAttendance: StudentAttendance[] }> = {
  type: UPDATE_COURSE_CLASS_STUDENT_ATTENDANCE,
  getData: ({ id, studentAttendance }) => CourseClassAttendanceService.updateStudentAttendance(id, studentAttendance),
  processData: () => [],
  processError: response => FetchErrorHandler(response, "Failed to update student attendance")
};

export const EpicUpdateCourseClassStudentAttendance: Epic<any, any> = EpicUtils.Create(request);
