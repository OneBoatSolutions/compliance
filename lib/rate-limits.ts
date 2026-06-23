interface AttemptRecord {
  count: number;
  lastAttempt: number;
}

const attempts = new Map<string, AttemptRecord>();

const maxAttempts = 5;
const lockTime = 15 * 60 * 1000;

export function recordFailedAttempt(identifier: string) {
  const record = attempts.get(identifier);

  if (!record) {
    attempts.set(identifier, { count: 1, lastAttempt: Date.now() });
    return;
  }

  record.count += 1;
  record.lastAttempt = Date.now();

  attempts.set(identifier, record);
}

export function isLocked(identifier: string) {
  const record = attempts.get(identifier);

  if (!record) {
    return false;
  }

  if (record.count < maxAttempts) {
    return false;
  }

  const elapsed = Date.now() - record.lastAttempt;

  if (elapsed > lockTime) {
    attempts.delete(identifier);
    return false;
  }

  return true;
}

export function resetAttempts(identifier: string) {
  attempts.delete(identifier);
}
