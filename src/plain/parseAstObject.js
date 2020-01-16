




/*
Cоздает объект, 
отдает его поля для парсинга 
и сохраняет положение исходного блока
*/
const parse = (obj) => {
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
        properties[property.key.value] = property.value.value;
    });
    return properties;
};

module.exports.parse = parse;