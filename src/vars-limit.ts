export const DEFAULT_VAR_STRING_LIMIT = 100;

const isUnknownArray = (input: unknown): input is unknown[] => Array.isArray(input);

const truncateStringValue = (value: string, limit = DEFAULT_VAR_STRING_LIMIT): string => (
  value.length > limit ? `${value.slice(0, limit)}....` : value
);

const isPlainObject = (value: unknown): value is Record<string, unknown> => {
  if (value === null || typeof value !== 'object' || Array.isArray(value)) return false;
  const proto = Reflect.getPrototypeOf(value);
  return proto === Object.prototype || proto === null;
};

function sanitizeInternal(
  value: unknown,
  limit: number,
  seen: WeakSet<object>,
): unknown {
  if (typeof value === 'string') {
    return truncateStringValue(value, limit);
  }
  if (value === null || typeof value === 'number' || typeof value === 'boolean' || typeof value === 'undefined') {
    return value;
  }
  if (typeof value === 'bigint') {
    return truncateStringValue(value.toString(), limit);
  }
  if (typeof value === 'symbol') {
    return truncateStringValue(value.toString(), limit);
  }
  if (typeof value === 'function') {
    return `[Function ${(value as { name?: string }).name || 'anonymous'}]`;
  }
  if (isUnknownArray(value)) {
    if (seen.has(value)) return '[Circular]';
    seen.add(value);
    const mapped: unknown[] = [];
    for (const item of value) {
      mapped.push(sanitizeInternal(item, limit, seen));
    }
    seen.delete(value);
    return mapped;
  }
  if (isPlainObject(value)) {
    if (seen.has(value)) return '[Circular]';
    seen.add(value);
    const result: Record<string, unknown> = {};
    for (const [key, val] of Object.entries(value)) {
      result[key] = sanitizeInternal(val, limit, seen);
    }
    seen.delete(value);
    return result;
  }
  const tag = Object.prototype.toString.call(value);
  const ctor = (value as { constructor?: unknown }).constructor;
  const ctorName = typeof ctor === 'function' ? ctor.name : undefined;
  const label = ctorName && ctorName !== 'Object' ? ctorName : tag;
  return truncateStringValue(`[${label}]`, limit);
}

export function sanitizeForLog(value: unknown, limit = DEFAULT_VAR_STRING_LIMIT): unknown {
  return sanitizeInternal(value, limit, new WeakSet<object>());
}

export function stringifyForLog(value: unknown, limit = DEFAULT_VAR_STRING_LIMIT): string {
  try {
    const sanitized = sanitizeForLog(value, limit);
    const serialized = JSON.stringify(sanitized);
    if (serialized.length <= limit) {
      return serialized;
    }
    return `${serialized.slice(0, limit)}....`;
  } catch (error) {
    return `[Object too complex to serialize: ${String(error)}]`;
  }
}
