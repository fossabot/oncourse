import { generateArraysOfRecords } from "../../mockUtils";
export function mockModules() {
    this.getModules = () => {
        return this.modules;
    };
    this.getModule = id => {
        const row = this.modules.rows.find(row => row.id == id);
        return {
            id: row.id,
            createdOn: new Date().toISOString(),
            creditPoints: null,
            expiryDays: null,
            fieldOfEducation: "080399",
            isCustom: false,
            modifiedOn: new Date().toISOString(),
            nominalHours: 20,
            specialization: null,
            nationalCode: row.values[0],
            title: row.values[1],
            isOffered: row.values[2],
            type: "UNIT OF COMPETENCY"
        };
    };
    this.createModule = item => {
        const data = JSON.parse(item);
        const modules = this.modules;
        const totalRows = modules.rows;
        data.id = totalRows.length + 1;
        modules.rows.push({
            id: data.id,
            values: [data.nationalCode, data.title, data.isOffered]
        });
        this.modules = modules;
    };
    this.removeModule = id => {
        this.modules = this.modules.rows.filter(m => m.id !== id);
    };
    const rows = generateArraysOfRecords(20, [
        { name: "id", type: "number" },
        { name: "title", type: "string" },
        { name: "nationalCode", type: "string" },
        { name: "isOffered", type: "boolean" }
    ]).map(l => ({
        id: l.id,
        values: [l.nationalCode, l.title, false]
    }));
    const columns = [
        {
            title: "Code",
            attribute: "nationalCode",
            type: null,
            sortable: true,
            visible: true,
            width: 100,
            sortFields: []
        },
        {
            title: "Title",
            attribute: "title",
            type: null,
            sortable: true,
            visible: true,
            width: 100,
            sortFields: []
        },
        {
            title: "Is offered",
            attribute: "isOffered",
            type: "Boolean",
            sortable: true,
            visible: true,
            width: 100,
            sortFields: []
        }
    ];
    const response = { rows, columns };
    response.entity = "Module";
    response.offset = 0;
    response.filterColumnWidth = 200;
    response.layout = "Three column";
    response.pageSize = 20;
    response.search = null;
    response.count = rows.length;
    response.sort = [
        {
            attribute: "nationalCode",
            ascending: true,
            complexAttribute: []
        }
    ];
    return response;
}
//# sourceMappingURL=modules.js.map