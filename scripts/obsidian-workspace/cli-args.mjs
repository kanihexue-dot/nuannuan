export function parseCliArgs(args) {
  const params = new Map();
  const positional = [];

  for (let index = 0; index < args.length; index += 1) {
    const token = args[index];

    if (!token.startsWith("--")) {
      positional.push(token);
      continue;
    }

    const value = args[index + 1];
    if (!value || value.startsWith("--")) {
      throw new Error(`Missing value for ${token}`);
    }

    params.set(token, value);
    index += 1;
  }

  return {
    positional,
    get(name) {
      return params.get(name);
    },
  };
}

export function requiredArg(args, name, message = `Missing ${name}`) {
  const value = args.get(name);
  if (!value) {
    throw new Error(message);
  }

  return value;
}

export function numberArg(args, name, fallback) {
  const value = args.get(name);
  if (!value) {
    return fallback;
  }

  const parsed = Number(value);
  if (!Number.isFinite(parsed)) {
    throw new Error(`Invalid number for ${name}`);
  }

  return parsed;
}
