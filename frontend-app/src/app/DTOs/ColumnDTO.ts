export class ColumnDTO {
    id: number;
    name?: string | undefined;
    orderIndex: number;
    longTermGoalId: number;

    init(data?: any) {
        if (data) {
            this.id = data["Id"];
            this.name = data["Name"];
            this.orderIndex = data["OrderIndex"];
            this.longTermGoalId = data["LongTermGoalId"];
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