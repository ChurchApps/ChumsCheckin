export class ArrayHelper {
  static getOne(items: any[], field: string, value: any) {
    let result: any = null;
    if (items !== undefined && items !== null) {
      for (let i = 0; i < items.length; i++) {
        if (items[i][field] === value) {
          result = items[i];
          break;
        }
      }
    }
    return result;
  }

  static getAll(items: any[], field: string, value: any) {
    const result: any[] = [];
    if (items !== undefined && items !== null) {
      items.forEach(item => {
        if (item[field] === value) result.push(item);
      });
    }
    return result;
  }

  static add(items: any[], item: any, field: string) {
    if (items.filter(i => i[field] === item[field]).length === 0) items.push(item);
  }

  static addIfNotExists(items: any[], item: any, field: string) {
    if (items.filter(i => i[field] === item[field]).length === 0) items.push(item);
  }

  static remove(items: any[], field: string, value: any) {
    for (let i = items.length - 1; i >= 0; i--) {
      if (items[i][field] === value) items.splice(i, 1);
    }
  }

  static replace(items: any[], item: any, field: string) {
    for (let i = 0; i < items.length; i++) {
      if (items[i][field] === item[field]) {
        items[i] = item;
        break;
      }
    }
  }

  static getIds(items: any[], field: string) {
    const result: string[] = [];
    if (items !== undefined && items !== null) {
      items.forEach(item => {
        if (item[field] && result.indexOf(item[field]) === -1) result.push(item[field]);
      });
    }
    return result;
  }

  static getUniqueValues(items: any[], field: string) {
    const result: any[] = [];
    if (items !== undefined && items !== null) {
      items.forEach(item => {
        if (item[field] !== undefined && item[field] !== null && result.indexOf(item[field]) === -1) {
          result.push(item[field]);
        }
      });
    }
    return result;
  }

  static moveUp(items: any[], field: string, value: any) {
    const index = items.findIndex(item => item[field] === value);
    if (index > 0) {
      const temp = items[index];
      items[index] = items[index - 1];
      items[index - 1] = temp;
    }
  }

  static moveDown(items: any[], field: string, value: any) {
    const index = items.findIndex(item => item[field] === value);
    if (index >= 0 && index < items.length - 1) {
      const temp = items[index];
      items[index] = items[index + 1];
      items[index + 1] = temp;
    }
  }
}