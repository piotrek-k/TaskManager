export class ColumnDTO {
    id: number;
    name?: string | undefined;
    orderIndex: number;

    init(data?: any) {
        if (data) {
            this.id = data["id"];
            this.name = data["name"];
            this.orderIndex = data["orderIndex"];
        }
    }

    static fromJS(data: any): ColumnDTO {
        data = typeof data === 'object' ? data : {};
        let result = new ColumnDTO();
        result.init(data);
        return result;
    }

    toJSON(data?: any) {
        data = typeof data === 'object' ? data : {};
        data["id"] = this.id;
        data["name"] = this.name;
        data["orderIndex"] = this.orderIndex;
        return data; 
    }
}