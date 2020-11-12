/*
 * Copyright ish group pty ltd. All rights reserved. https://www.ish.com.au
 * No copying or use of this code is allowed without permission in writing from ish.
 */
import { generateArraysOfRecords } from "../../mockUtils";
export function mockScripts() {
    this.getScripts = () => {
        return this.scripts;
    };
    this.getScript = id => {
        const row = this.scripts.rows.find(row => row.id == id);
        return {
            id: row.id,
            name: row.values[1],
            enabled: row.values[2],
            description: "test script",
            trigger: {
                type: "Schedule",
                entityName: null,
                cron: {
                    scheduleType: "Custom",
                    custom: "0 0 3 ? * *"
                }
            },
            content: "  def enrolment = args.entity\n" +
                "\n" +
                "   email {\n" +
                '      template "Enrolment Confirmation"\n' +
                "      bindings enrolment: enrolment\n" +
                '      to "blake@acwa.asn.au"\n' +
                '      if (enrolment.courseClass.course.hasTag("ACWA Events", true)==true){\n' +
                '        from ("acwa@acwa.asn.au", "ACWA Events")\n' +
                "      }\n" +
                '      else if (enrolment.courseClass.course.hasTag("Disability Justice Project", true)==true){\n' +
                '        from ("training@disabilityjustice.edu.au", "Disability Justice Project")\n' +
                "      }\n" +
                "    }\n" +
                "    \n" +
                "    args.context.commitChanges()",
            lastRun: [
                "2018-06-04T05:20:48.000Z",
                "2018-06-04T05:14:40.000Z",
                "2018-04-17T07:06:01.000Z",
                "2018-04-17T07:03:48.000Z",
                "2018-04-17T07:00:19.000Z",
                "2018-04-17T06:57:43.000Z",
                "2018-03-16T10:31:37.000Z"
            ],
            created: "2018-01-16T08:51:46.000Z",
            modified: "2019-10-10T10:00:15.000Z"
        };
    };
    this.getPlainScripts = () => {
        const rows = generateArraysOfRecords(20, [
            { name: "id", type: "number" },
            { name: "name", type: "string" },
            { name: "enabled", type: "string" }
        ]).map(l => ({
            id: l.id,
            values: [l.name, l.enabled]
        }));
        const columns = [];
        const response = { rows, columns };
        response.entity = "Script";
        response.columns = [];
        response.count = null;
        response.filterColumnWidth = null;
        response.filteredCount = null;
        response.layout = null;
        response.sort = [];
        return response;
    };
    this.createScript = item => {
        const data = JSON.parse(item);
        const scripts = this.scripts;
        const totalRows = scripts.rows;
        data.id = totalRows.length + 1;
        scripts.rows.push({
            id: data.id,
            values: [data.name, data.enabled, data.nextRun]
        });
        this.scripts = scripts;
    };
    this.removeScript = id => {
        this.scripts.rows = this.scripts.rows.filter(a => a.id !== id);
    };
    const rows = generateArraysOfRecords(20, [
        { name: "id", type: "number" },
        { name: "name", type: "string" },
        { name: "enabled", type: "string" },
        { name: "nextRun", type: "string" }
    ]).map(l => ({
        id: l.id,
        values: [l.id, l.name, l.enabled, l.nextRun]
    }));
    const columns = [
        {
            title: "Id",
            attribute: "id",
            sortable: true,
            visible: false,
            width: 100
        },
        {
            title: "Name",
            attribute: "name",
            sortable: true,
            visible: true,
            width: 200
        },
        {
            title: "Enabled",
            attribute: "enabled",
            sortable: true,
            visible: true,
            width: 200
        },
        {
            title: "Next run",
            attribute: "nextRun",
            sortable: false,
            visible: true,
            width: 200
        }
    ];
    const response = { rows, columns };
    response.entity = "Script";
    response.offset = 0;
    response.pageSize = 10;
    response.search = "";
    response.count = rows.length;
    response.sort = response.columns.map(col => ({
        attribute: col.attribute,
        ascending: true
    }));
    return response;
}
//# sourceMappingURL=scripts.js.map