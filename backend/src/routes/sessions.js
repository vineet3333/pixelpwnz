import { Router } from 'express';
import { listSessions, getSession, updateSession } from '../store/sessionStore.js';
import { countVectors } from '../brain/chromaClient.js';

const router = Router();

/**
 * GET /api/sessions
 * List all active sessions with summary info.
 * Supports optional search query param for filtering by contact_name.
 *
 * Query params:
 *   - search: string (optional) — filter sessions by contact_name (case-insensitive)
 */
router.get('/', (req, res, next) => {
  try {
    const { search } = req.query;

    let sessions = listSessions();

    if (search && typeof search === 'string' && search.trim()) {
      const q = search.trim().toLowerCase();
      sessions = sessions.filter(
        (s) =>
          s.contact_name.toLowerCase().includes(q) ||
          (s.userName && s.userName.toLowerCase().includes(q))
      );
    }

    res.status(200).json({
      success: true,
      count: sessions.length,
      sessions,
    });
  } catch (err) {
    next(err);
  }
});

/**
 * GET /api/sessions/:sessionId
 * Get detailed session info including tone profile, creation time, and vector count.
 */
router.get('/:sessionId', async (req, res, next) => {
  try {
    const { sessionId } = req.params;
    const session = getSession(sessionId);

    if (!session) {
      return res.status(404).json({
        success: false,
        error: 'Session not found or expired',
      });
    }

    // Get actual vector count from ChromaDB (async, best-effort)
    let vectorCount = session.pairs ? session.pairs.length : 0;
    try {
      vectorCount = await countVectors(sessionId);
    } catch {
      // ChromaDB may not be available — fall back to pairs length
    }

    res.status(200).json({
      success: true,
      session: {
        session_id: session.session_id,
        contact_name: session.contact_name || '',
        userName: session.userName || '',
        label: session.label || null,
        temperature: session.temperature ?? 0.7,
        created_at: session.created_at,
        pair_count: session.pairs ? session.pairs.length : 0,
        vector_count: vectorCount,
        toneProfile: session.toneProfile || null,
        contact_pairs_preview: session.pairs
          ? session.pairs.slice(0, 3).map((p) => ({
              incoming_message: p.incoming_message,
              user_reply: p.user_reply,
            }))
          : [],
      },
    });
  } catch (err) {
    next(err);
  }
});

/**
 * PATCH /api/sessions/:sessionId
 * Update session metadata.
 *
 * Body (JSON):
 *   - label: string (optional) — a user-defined label for the session
 *   - temperature: number (optional) — LLM temperature override (0.0 - 2.0)
 */
router.patch('/:sessionId', (req, res, next) => {
  try {
    const { sessionId } = req.params;
    const { label, temperature } = req.body;

    // Validate body exists
    if (label === undefined && temperature === undefined) {
      return res.status(400).json({
        success: false,
        error: 'No updatable fields provided. Supported fields: label, temperature',
      });
    }

    // Validate label
    if (label !== undefined) {
      if (typeof label !== 'string' || label.trim().length === 0 || label.length > 100) {
        return res.status(400).json({
          success: false,
          error: 'label must be a non-empty string with at most 100 characters',
        });
      }
    }

    // Validate temperature
    if (temperature !== undefined) {
      if (typeof temperature !== 'number' || temperature < 0 || temperature > 2) {
        return res.status(400).json({
          success: false,
          error: 'temperature must be a number between 0.0 and 2.0',
        });
      }
    }

    const updated = updateSession(sessionId, { label, temperature });

    if (!updated) {
      return res.status(404).json({
        success: false,
        error: 'Session not found or expired',
      });
    }

    res.status(200).json({
      success: true,
      session: {
        session_id: updated.session_id,
        contact_name: updated.contact_name || '',
        userName: updated.userName || '',
        label: updated.label || null,
        temperature: updated.temperature ?? 0.7,
        created_at: updated.created_at,
        pair_count: updated.pairs ? updated.pairs.length : 0,
      },
    });
  } catch (err) {
    next(err);
  }
});

/**
 * GET /api/sessions/:sessionId/pairs
 * Get paginated conversation pairs for a session.
 *
 * Query params:
 *   - page: integer (default: 1)
 *   - limit: integer (default: 20, max: 100)
 *   - sort: 'asc' | 'desc' (default: 'desc' — newest first)
 */
router.get('/:sessionId/pairs', (req, res, next) => {
  try {
    const { sessionId } = req.params;
    const session = getSession(sessionId);

    if (!session) {
      return res.status(404).json({
        success: false,
        error: 'Session not found or expired',
      });
    }

    const pairs = session.pairs || [];

    // Parse pagination params
    let page = parseInt(req.query.page, 10);
    let limit = parseInt(req.query.limit, 10);
    const sort = req.query.sort === 'asc' ? 'asc' : 'desc';

    if (Number.isNaN(page) || page < 1) page = 1;
    if (Number.isNaN(limit) || limit < 1) limit = 20;
    if (limit > 100) limit = 100;

    // Sort by timestamp
    const sorted = [...pairs].sort((a, b) => {
      const cmp = (a.timestamp || '').localeCompare(b.timestamp || '');
      return sort === 'desc' ? -cmp : cmp;
    });

    const total = sorted.length;
    const totalPages = Math.max(1, Math.ceil(total / limit));
    const startIdx = (page - 1) * limit;
    const paged = sorted.slice(startIdx, startIdx + limit);

    res.status(200).json({
      success: true,
      pairs: paged,
      pagination: {
        page,
        limit,
        total,
        total_pages: totalPages,
        has_next: page < totalPages,
        has_prev: page > 1,
      },
    });
  } catch (err) {
    next(err);
  }
});

export default router;
