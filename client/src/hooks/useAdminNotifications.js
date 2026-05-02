import { useState, useEffect } from 'react';
import API_BASE from '../config/api';
import { getAuthHeaders, clearAuthToken } from '../config/auth';

const NOTIF_POLL_MS = 28_000;

/**
 * Polls admin dashboard notifications when enabled and API is configured.
 */
export function useAdminNotifications(enabled) {
  const [notifications, setNotifications] = useState([]);
  const [notifLoading, setNotifLoading] = useState(false);
  const [lastPolled, setLastPolled] = useState(null);

  useEffect(() => {
    if (!enabled || !API_BASE) return;

    const ac = new AbortController();

    const fetchNotifications = async () => {
      setNotifLoading(true);
      try {
        const res = await fetch(`${API_BASE}/api/dashboard/admin/notifications`, {
          headers: getAuthHeaders(),
          credentials: 'include',
          signal: ac.signal,
        });
        if (res.status === 401) {
          clearAuthToken();
          localStorage.removeItem('isAdmin');
          window.location.href = '/login';
          return;
        }
        const data = await res.json().catch(() => ({}));
        if (data.success && Array.isArray(data.notifications)) {
          setNotifications(data.notifications);
          setLastPolled(data.polledAt || new Date().toISOString());
        }
      } catch (e) {
        if (e?.name === 'AbortError') return;
      } finally {
        setNotifLoading(false);
      }
    };

    fetchNotifications();
    const t = setInterval(fetchNotifications, NOTIF_POLL_MS);
    return () => {
      ac.abort();
      clearInterval(t);
    };
  }, [enabled]);

  return { notifications, notifLoading, lastPolled };
}
