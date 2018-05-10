export class LinkDTO {
    id: number;
    url?: string | undefined;
    description?: string | undefined;
    projectId: number;

    init(data?: any) {
        if (data) {
            this.id = data["Id"];
            this.url = data["Url"];
            this.description = data["Description"];
            this.projectId = data["ProjectId"];
        }
    }

    static fromJS(data: any): LinkDTO {
        data = typeof data === 'object' ? data : {};
        let result = new LinkDTO();
        result.init(data);
        return result;
    }

    toJSON(data?: any) {
        data = typeof data === 'object' ? data : {};
        data["Id"] = this.id;
        data["Url"] = this.url;
        data["Description"] = this.description;
        data["ProjectId"] = this.projectId;
        return data; 
    }
}