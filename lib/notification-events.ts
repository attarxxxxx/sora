export const NOTIFICATIONS_CHANGED_EVENT = "sora:notifications-changed"

export function notifyNotificationsChanged() {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new Event(NOTIFICATIONS_CHANGED_EVENT))
  }
}
