"use server";
import { Redis } from "@upstash/redis";

// Initialize Redis
const redis = Redis.fromEnv();

export type Notification = {
  created_at: number;
  device_id: string;
  notification_type: string;
  org_id: string;
  image_url: string;
  video_url: string;
  fulldata: string;
};

// Get notifications for a specific org_id
export async function GetNotifications(org_id: string): Promise<Notification[]> {
  const redisKey = `notifications:${org_id}`;
  const notifications = await redis.lrange(redisKey, 0, -1); // Get all items from the list

  return notifications.map((body: any) => {
    const notification: Notification = {
      created_at: body.created_at,
      device_id: body.data.device_id ? body.data.device_id : (body.data.camera_id ? body.data.camera_id : ""),
      notification_type: body.data.notification_type
        ? body.data.notification_type
        : body.webhook_type,
      org_id: body.org_id,
      image_url: body.data.image_url ? body.data.image_url : "",
      video_url: body.data.video_url ? body.data.video_url : "",
      fulldata: JSON.stringify(body, null, 2),
    };
    return notification;
  });
}

// Get all notifications across all org_ids
export async function GetAllNotifications(): Promise<Notification[]> {
  const orgIds = await redis.smembers("org_ids"); // Get all tracked org_ids
  let allNotifications: Notification[] = [];

  for (const orgId of orgIds) {
    const notifications = await GetNotifications(orgId);
    allNotifications = allNotifications.concat(notifications);

    // Sort all notifications by created_at in descending order (newest first)
  allNotifications.sort((a, b) => b.created_at - a.created_at);
  }

  return allNotifications;
}

// Add a notification for a specific org_id
export async function AddNotification(request: any) {
  try {
    const org_id = request.org_id;
    if (!org_id) {
      throw new Error("org_id is required in the notification data");
    }
    console.log(request);
    const redisKey = `notifications:${org_id}`;
    const notifString = JSON.stringify(request); // Stringify the request to store it

    // Add org_id to the set of tracked org_ids
    await redis.sadd("org_ids", org_id);

    // Add notification to the list and trim to 50 items
    await redis.lpush(redisKey, notifString);
    await redis.ltrim(redisKey, 0, 49);

    if(request.webhook_type == 'lpr' && request.data.license_plate_number == 'SBP1818T')
    {
      console.log("PLATE MATCH")
       // Use fetch to call your GET endpoint
      // NOTE: This assumes AddNotification runs in the same Next.js app.
      // If not, you'll need the full URL: 'https://your-domain.com/api/remoteunlock'
      const unlockResponse = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/remoteunlock`);

      if (!unlockResponse.ok) {
        const errorDetails = await unlockResponse.json();
        console.error('Failed to trigger remote unlock:', errorDetails);
      } else {
        const successDetails = await unlockResponse.json();
        console.log('Remote unlock successfully triggered:', successDetails);
      }
    }
    
  } catch (error) {
    console.log("Error adding notification:", error);
  }
}
