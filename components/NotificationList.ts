"use server"
import { Redis } from '@upstash/redis';

// Initialize Redis
const redis = Redis.fromEnv();

export type Notification = {
  created_at:number,
  device_id:string,
  notification_type:string, 
  org_id:string, 
  fulldata:string
};

// Get all notifications from Redis
export async function GetNotifications(): Promise<Notification[]> {
  const notifications = await redis.lrange('notifications', 0, -1); // Get all items from the list

  return notifications
    .map((body: any) => {
      const notification: Notification = {
        created_at: body.created_at,
        device_id: body.data.device_id?body.data.device_id:"",
        notification_type: body.data.notification_type?body.data.notification_type:"",
        org_id: body.org_id,
        fulldata: JSON.stringify(body, null, 2)
      };
        return notification;
    })
}
  
export async function AddNotification(request: any) {
  try
  {
    const notifString = JSON.stringify(request);  // Stringify the request to store it
    await redis.lpush('notifications', notifString);
    await redis.ltrim('notifications', 0, 49);
  }
  catch(error)
  {
    console.log("Error adding notification");
  }
}
  