
//拼接规格字符串
export function getSpecsStr(data, keyName) {
  let quantity = data[keyName + 'Quantity']
  let unit = data[keyName + 'Unit']
  if (keyName === 'package') { //包装规格
    let specs = data[keyName + 'Specs']
    return `${specs}${data.dosageUnit}*${quantity}${unit}`
  }

  if (keyName === 'boxing') {//装盒规格
    return `${quantity}${data.packageUnit}/${unit}`
  }

  if (keyName === 'packing') {//装箱规格
    return `${quantity}${data.boxingUnit}/${unit}`
  }

}

