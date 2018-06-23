export class BaseDTO {
    prepareDataIndexes(data: any) {
        var newData = {};
        for (var d in data) {
            var newDataIndex = d.toLowerCase().trim();
            newData[newDataIndex] = data[d];
        }

        return newData;
    }
}