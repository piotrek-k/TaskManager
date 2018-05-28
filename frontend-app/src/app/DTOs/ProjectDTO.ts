export class ProjectDTO {
    id: number;
    name: string;
    archived: boolean;

    init(data?: any) {
        if (data) {
            this.id = data["Id"];
            this.name = data["Name"];
            this.archived = data["Archived"];
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