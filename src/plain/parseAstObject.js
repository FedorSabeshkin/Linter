/**
 * 
 * По сути два этих метода позволяю мне формировать обьекты из 
 * json, полями которого являются literal
 * 
 * Какие еще бывают поля?
 * 
 * Если у узла тип Object, то я могу передать его в этод метод
 * сохраню его loc, а по children пробежится walker
 *  */

/*
Cоздает объект, 
отдает его поля для парсинга 
и сохраняет положение исходного блока
*/
const parseObj = (obj) => {
    let outObj = {};
    outObj = walk(obj.children);
    outObj.location = obj.loc;
    delete outObj.location.start.offset;
    delete outObj.location.end.offset;
    delete outObj.location.source;
    return outObj;
};

/*
Парсит, если проперти являются простыми Literal
*/
const walk = (childrens) => {
    let properties = {};
    childrens.forEach(property => {
        switch (property.value.type) {
            case "Literal": {
                properties[property.key.value] = property.value.value;
                break;
            }
            case "Object": {
                properties[property.key.value] = parseObj(property.value);
                break;
            }
            case "Array": {
                properties[property.key.value] = parseArr(property.value.children);
                break;
            }
        }
    });
    return properties;
};

const parseArr = (arr) =>{
    let newArr = [];
    let newElem;
    arr.forEach(property => {
        switch (property.type) {
            case "Literal": {
                newElem = property.value;
                newArr.push(newElem);
                break;
            }
            case "Object": {
                newElem = parseObj(property);
                newArr.push(newElem);
                break;
            }
            case "Array": {
                newElem = parseArr(property.children);
                newArr.push(newElem);
                break;
            }
        }
    });
    return newArr;
};

module.exports.parseObj = parseObj;