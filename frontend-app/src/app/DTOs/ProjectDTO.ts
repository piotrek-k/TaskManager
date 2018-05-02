export class ProjectDTO {
    id: number;
    name?: string | undefined;

    init(data?: any) {
        if (data) {
            this.id = data["Id"];
            this.name = data["Name"];
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
        return data; 
    }
}