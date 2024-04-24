export function extend(...args: any[]) {
  const destination = typeof arguments[0] === 'object' ? arguments[0] : {};
  for (var i = 1; i < arguments.length; i++) {
    if (arguments[i] && typeof arguments[i] === 'object')
      for (var property in arguments[i])
        destination[property] = arguments[i][property];
  }
  return destination;
}

export function getTypeOf(obj: any): string {
  if (typeof obj === 'undefined' || obj === null)
    return '' + obj;
  return Object.prototype.toString.call(obj).replace(/^\[object\s(.*)\]$/, function ($0, $1) { return $1.toLowerCase(); });
}

export function toKeyName(namespace: string, key: string, delimiter: string) {
  if (!isValidKey(namespace)) {
    return key;
  }
  return key.replace(new RegExp('^' + namespace + delimiter), '');
}

export function isValidKey(key: any) {
  const type = getTypeOf(key);
  return (type === 'string' && key) || type === 'number' || type === 'boolean';
}

export function toStoredValue(value: any) {
  return JSON.stringify(value);
}

export function fromStoredValue(value: any) {
  return value ? JSON.parse(value) : null;
};

export function isString(val: any): val is String {
  return getTypeOf(val) === 'String';
}

export function isFunction(val: any) {
  return getTypeOf(val) === 'Function';
}

function each(obj: any, fnIterator: any, context: any) {
  if (Array.isArray(obj)) {
    for (let i = 0; i < obj.length; i++)
      if (fnIterator.call(context, obj[i], i) === false) return;
  } else if (obj) {
    for (var key in obj)
      if (fnIterator.call(context, obj[key], key) === false) return;
  }
}

export function tryEach(obj: any, fnIterator: any, fnError: any, context: any) {
  each(obj, function (value: any, key: number) {
    try {
      return fnIterator.call(context, value, key);
    } catch (error) {
      if (isFunction(fnError)) {
        try {
          fnError.call(context, value, key, error);
        } catch (error) {}
      }
    }
  // @ts-ignore
  }, this);
}
