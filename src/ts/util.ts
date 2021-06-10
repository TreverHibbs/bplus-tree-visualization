export function zip(arrays: any[][]): any[] {
    return arrays[0].map(function(_,i){
        return arrays.map(function(array){return array[i]})
    });
}
