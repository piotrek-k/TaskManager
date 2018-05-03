export class LinkDTO {
    id: number;
    url?: string | undefined;
    description?: string | undefined;
    projectId: number;

    init(data?: any) {
        if (data) {
            this.id = data["id"];
            this.url = data["url"];
            this.description = data["description"];
            this.projectId = data["projectId"];
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
        data["id"] = this.id;
        data["url"] = this.url;
        data["description"] = this.description;
        data["projectId"] = this.projectId;
        return data; 
    }
}