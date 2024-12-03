const notifications: Notification[] = [];


export type Notification = {
  created_at:number,
  device_id:string,
  notification_type:string, 
  org_id:string, 
  fulldata:string
};

export async function GetNotifications():Promise<Notification[]> {    
  console.log(notifications.length);
    return notifications;
  }
  
export async function AddNotification(body: any) {
    console.log(body);
    const notif: Notification = 
    {
      created_at: body.created_at ,
      device_id: body.data.device_id,
      notification_type: body.data.notification_type,
      org_id: body.org_id,
      fulldata: body
    }
    notifications.push(notif);
  }