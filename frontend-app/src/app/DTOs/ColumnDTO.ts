import { BaseDTO } from './BaseDTO';
export class ColumnDTO extends BaseDTO {
    id: number;
    name?: string | undefined;
    orderIndex: number;
    longTermGoalId: number;

    init(data?: any) {
        data = this.prepareDataIndexes(data);
        if (data) {
            this.id = data["Id".toLowerCase()];
            this.name = data["Name".toLowerCase()];
            this.orderIndex = data["OrderIndex".toLowerCase()];
            this.longTermGoalId = data["LongTermGoalId".toLowerCase()];
        }
    }

    static fromJS(data: any): ColumnDTO {
        data = typeof data === 'object' ? data : {};
        let result = new ColumnDTO();
        result.init(data);
        return result;
    }

    toJSON(data?: any) {
        data = typeof data === 'object' ? data : {};
        data["Id"] = this.id;
        data["Name"] = this.name;
        data["OrderIndex"] = this.orderIndex;
        data["LongTermGoalId"] = this.longTermGoalId;
        return data;
    }
}