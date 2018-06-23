import { BaseDTO } from './BaseDTO';
export class LinkDTO extends BaseDTO{
    id: number;
    url?: string | undefined;
    description?: string | undefined;
    projectId: number;

    init(data?: any) {
        data = this.prepareDataIndexes(data);
        if (data) {
            this.id = data["Id".toLowerCase()];
            this.url = data["Url".toLowerCase()];
            this.description = data["Description".toLowerCase()];
            this.projectId = data["ProjectId".toLowerCase()];
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