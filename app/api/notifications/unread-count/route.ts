import { getUnreadNotificationCount } from "@/lib/notifications"
import { getSession } from "@/lib/session"

export async function GET() {
  const session = await getSession()
  const count = session ? await getUnreadNotificationCount(session.user.id) : 0

  return Response.json({ count })
}
