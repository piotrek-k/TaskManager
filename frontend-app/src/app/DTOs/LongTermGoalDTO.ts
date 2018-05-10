export class LongTermGoalDTO {
    id: number;
    name?: string | undefined;
    projectId: number;

    init(data?: any) {
        if (data) {
            this.id = data["Id"];
            this.name = data["Name"];
            this.projectId = data["ProjectId"];
        }
    }

    static fromJS(data: any): LongTermGoalDTO {
        data = typeof data === 'object' ? data : {};
        let result = new LongTermGoalDTO();
        result.init(data);
        return result;
    }

    toJSON(data?: any) {
        data = typeof data === 'object' ? data : {};
        data["Id"] = this.id;
        data["Name"] = this.name;
        data["ProjectId"] = this.projectId;
        return data; 
    }
}