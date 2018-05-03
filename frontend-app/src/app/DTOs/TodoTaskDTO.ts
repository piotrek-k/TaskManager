export class TodoTaskDTO {
    id: number;
    content?: string | undefined;
    date?: Date | undefined;
    columnId: number;

    init(data?: any) {
        if (data) {
            this.id = data["Id"];
            this.content = data["Content"];
            this.date = data["Date"] ? new Date(data["Date"].toString()) : <any>undefined;
            this.columnId = data["ColumnId"];
        }
    }

    static fromJS(data: any): TodoTaskDTO {
        data = typeof data === 'object' ? data : {};
        let result = new TodoTaskDTO();
        result.init(data);
        return result;
    }

    toJSON(data?: any) {
        data = typeof data === 'object' ? data : {};
        data["Id"] = this.id;
        data["Content"] = this.content;
        data["Date"] = this.date ? this.date.toISOString() : <any>undefined;
        data["ColumnId"] = this.columnId;
        return data; 
    }
}