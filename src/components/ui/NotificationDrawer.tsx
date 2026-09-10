import React, { useState, useEffect } from 'react';
import { X, Bell, CheckCheck, ExternalLink, Clock, AlertTriangle, CheckCircle2, Info } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import api, { formatDateTime } from '../../lib/api';
import { useAuth } from '../../context/AuthContext';
import type { PublicNotification } from '../../types';

interface NotificationDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export const NotificationDrawer: React.FC<NotificationDrawerProps> = ({
  isOpen,
  onClose,
}) => {
  const [notifications, setNotifications] = useState<PublicNotification[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { setUnreadNotifications } = useAuth();
  const navigate = useNavigate();

  const fetchNotifications = async () => {
    setIsLoading(true);
    try {
      const res = await api.get('/notifications');
      if (res.data.status === 'success') {
        setNotifications(res.data.data.notifications || []);
        setUnreadNotifications(res.data.data.unreadCount || 0);
      }
    } catch (error) {
      console.error('Failed to fetch notifications', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchNotifications();
    }
  }, [isOpen]);

  const handleMarkAllAsRead = async () => {
    try {
      await api.patch('/notifications/read-all');
      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
      setUnreadNotifications(0);
    } catch {}
  };

  const handleNotificationClick = async (notification: PublicNotification) => {
    if (!notification.isRead) {
      try {
        await api.patch(`/notifications/${notification.id}/read`);
        setNotifications((prev) =>
          prev.map((n) => (n.id === notification.id ? { ...n, isRead: true } : n))
        );
        setUnreadNotifications((prev) => Math.max(0, prev - 1));
      } catch {}
    }

    if (notification.link) {
      onClose();
      navigate(notification.link);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white dark:bg-[#172019] shadow-2xl border-l border-border flex flex-col animate-in slide-in-from-right duration-200">
          {/* Header */}
          <div className="p-5 border-b border-border flex items-center justify-between bg-muted/30">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                <Bell className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-base font-bold text-foreground">Pemberitahuan</h3>
                <p className="text-xs text-muted-foreground">Status & tindak lanjut permohonan</p>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button
                onClick={handleMarkAllAsRead}
                className="text-xs text-primary font-medium hover:underline p-1.5 flex items-center gap-1 rounded-lg hover:bg-muted"
                title="Tandai semua dibaca"
              >
                <CheckCheck className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Tandai Dibaca</span>
              </button>
              <button
                onClick={onClose}
                className="p-1.5 text-muted-foreground hover:text-foreground rounded-lg hover:bg-muted"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* List */}
          <div className="flex-1 overflow-y-auto p-4 space-y-2.5">
            {isLoading ? (
              <div className="py-12 text-center text-muted-foreground text-xs">
                Memuat notifikasi...
              </div>
            ) : notifications.length === 0 ? (
              <div className="py-16 text-center">
                <Bell className="w-10 h-10 text-muted-foreground/40 mx-auto mb-3" />
                <h4 className="text-sm font-semibold text-foreground">Belum ada notifikasi</h4>
                <p className="text-xs text-muted-foreground mt-1">
                  Pembaruan mengenai pengajuan Anda akan muncul di sini.
                </p>
              </div>
            ) : (
              notifications.map((n) => {
                const getIcon = () => {
                  switch (n.type) {
                    case 'SUCCESS':
                      return <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />;
                    case 'ACTION_REQUIRED':
                    case 'WARNING':
                      return <AlertTriangle className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />;
                    default:
                      return <Info className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />;
                  }
                };

                return (
                  <div
                    key={n.id}
                    onClick={() => handleNotificationClick(n)}
                    className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex gap-3 ${
                      n.isRead
                        ? 'bg-white dark:bg-slate-900/40 border-border/60 hover:border-primary/40'
                        : 'bg-emerald-50/50 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-800/60 shadow-subtle'
                    }`}
                  >
                    {getIcon()}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-1 mb-1">
                        <h4
                          className={`text-xs truncate ${
                            n.isRead ? 'font-medium text-foreground' : 'font-bold text-primary dark:text-emerald-300'
                          }`}
                        >
                          {n.title}
                        </h4>
                        {!n.isRead && (
                          <span className="w-2 h-2 rounded-full bg-primary flex-shrink-0" />
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                        {n.message}
                      </p>
                      <div className="flex items-center justify-between mt-2 pt-1.5 border-t border-border/40 text-[10px] text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {formatDateTime(n.createdAt)}
                        </span>
                        {n.link && (
                          <span className="text-primary font-medium flex items-center gap-0.5">
                            Buka <ExternalLink className="w-2.5 h-2.5" />
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
