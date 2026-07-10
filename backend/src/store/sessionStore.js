import config from '../config.js';

const sessions = new Map();
let cleanupInterval = null;

/**
 * Create a new user session.
 * @param {string} sessionId
 * @param {object} data - session data (contact_name, pairs, toneProfile, etc.)
 */
export function createSession(sessionId, data) {
  sessions.set(sessionId, {
    session_id: sessionId,
    ...data,
    created_at: Date.now(),
  });
}

/**
 * Retrieve a session if it exists and has not expired.
 * @param {string} sessionId
 * @returns {object|null}
 */
export function getSession(sessionId) {
  const session = sessions.get(sessionId);
  if (!session) return null;

  const age = (Date.now() - session.created_at) / 1000;
  if (age > config.session.ttl) {
    sessions.delete(sessionId);
    return null;
  }

  return session;
}

/**
 * Delete a session.
 * @param {string} sessionId
 * @returns {boolean} true if the session existed
 */
export function deleteSession(sessionId) {
  return sessions.delete(sessionId);
}

/**
 * Start periodic cleanup of expired sessions.
 */
export function startCleanup() {
  if (cleanupInterval) return;
  cleanupInterval = setInterval(() => {
    const now = Date.now();
    for (const [id, session] of sessions) {
      const age = (now - session.created_at) / 1000;
      if (age > config.session.ttl) {
        sessions.delete(id);
      }
    }
  }, 5 * 60 * 1000); // Every 5 minutes
  cleanupInterval.unref();
}

/**
 * Stop the cleanup interval (for tests).
 */
export function stopCleanup() {
  if (cleanupInterval) {
    clearInterval(cleanupInterval);
    cleanupInterval = null;
  }
}

/**
 * Retrieve a session without expiry check (for internal use only).
 * Does NOT check or update TTL.
 */
function getSessionRaw(sessionId) {
  return sessions.get(sessionId) || null;
}

/**
 * List all active (non-expired) sessions with summary info.
 * Filters out expired sessions. Returns lightweight summaries without full pairs arrays.
 * @returns {Array<{ session_id: string, contact_name: string, userName: string, label: string|null, created_at: number, pair_count: number, toneProfile: object }>}
 */
export function listSessions() {
  const now = Date.now();
  const results = [];

  for (const [id, session] of sessions) {
    const age = (now - session.created_at) / 1000;
    if (age > config.session.ttl) {
      sessions.delete(id);
      continue;
    }

    results.push({
      session_id: id,
      contact_name: session.contact_name || '',
      userName: session.userName || '',
      label: session.label || null,
      created_at: session.created_at,
      pair_count: session.pairs ? session.pairs.length : 0,
      toneProfile: session.toneProfile || null,
    });
  }

  // Sort newest first
  results.sort((a, b) => b.created_at - a.created_at);
  return results;
}

/**
 * Partially update a session's metadata.
 * Only allows updating specific safe fields.
 * @param {string} sessionId
 * @param {object} updates - Fields to update (e.g., { label: "Work Chat" })
 * @returns {object|null} The updated session object, or null if not found
 */
export function updateSession(sessionId, updates) {
  const session = getSessionRaw(sessionId);
  if (!session) return null;

  const allowedFields = ['label', 'temperature'];
  for (const field of allowedFields) {
    if (updates[field] !== undefined) {
      session[field] = updates[field];
    }
  }

  return session;
}

/**
 * Clear all sessions (for tests).
 */
export function clearAll() {
  sessions.clear();
}
