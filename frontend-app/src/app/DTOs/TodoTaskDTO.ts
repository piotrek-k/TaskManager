import { BaseDTO } from './BaseDTO';
export class TodoTaskDTO extends BaseDTO {
    id: number;
    content?: string | undefined;
    details?: string | undefined;
    date?: Date | undefined;
    columnId: number;

    init(data?: any) {
        data = this.prepareDataIndexes(data);
        if (data) {
            this.id = data["Id".toLowerCase()];
            this.content = data["Content".toLowerCase()];
            this.details = data["Details".toLowerCase()];
            this.date = data["Date".toLowerCase()] ? new Date(data["Date".toLowerCase()].toString()) : <any>undefined;
            this.columnId = data["ColumnId".toLowerCase()];
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
        data["Details"] = this.details;
        data["Date"] = this.date ? this.date.toISOString() : <any>undefined;
        data["ColumnId"] = this.columnId;
        return data; 
    }
}