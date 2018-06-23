import { BaseDTO } from './BaseDTO';
export class LongTermGoalDTO extends BaseDTO {
    id: number;
    name?: string | undefined;
    projectId: number;
    archived: boolean;

    init(data?: any) {
        data = this.prepareDataIndexes(data);
        if (data) {
            this.id = data["Id".toLowerCase()];
            this.name = data["Name".toLowerCase()];
            this.projectId = data["ProjectId".toLowerCase()];
            this.archived = data["Archived".toLowerCase()];
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
        data["Archived"] = this.archived;
        return data;
    }
}