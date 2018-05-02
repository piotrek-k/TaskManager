export class ProjectDTO {
    id: number;
    name?: string | undefined;

    init(data?: any) {
        if (data) {
            this.id = data["id"];
            this.name = data["name"];
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
        data["id"] = this.id;
        data["name"] = this.name;
        return data; 
    }
}