import { BaseDTO } from './BaseDTO';
export class ProjectDTO extends BaseDTO {
    id: number;
    name: string;
    archived: boolean;

    init(data?: any) {
        data = this.prepareDataIndexes(data);
        if (data) {
            this.id = data["Id".toLowerCase()];
            this.name = data["Name".toLowerCase()];
            this.archived = data["Archived".toLowerCase()];
        }
    }

    static fromJS(data: any): ProjectDTO {
        data = typeof data === 'object' ? data : {};
        let result = new ProjectDTO();
        result.init(data);
        return result;
    }

    toJSON(data?: any) {
        data = typeof data === 'object' ? data : {};
        data["Id"] = this.id;
        data["Name"] = this.name;
        data["Archived"] = this.archived;
        return data;
    }
}