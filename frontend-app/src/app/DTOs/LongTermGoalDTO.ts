export class LongTermGoalDTO {
    id: number;
    name?: string | undefined;
    projectId: number;

    init(data?: any) {
        if (data) {
            this.id = data["id"];
            this.name = data["name"];
            this.projectId = data["projectId"];
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
        data["id"] = this.id;
        data["name"] = this.name;
        data["projectId"] = this.projectId;
        return data; 
    }
}