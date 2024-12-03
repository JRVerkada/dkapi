"use client"
import NotificationLine from './Notification';
import { useState, useEffect } from 'react';
import {GetNotifications} from "@/components/NotificationList"  
import { Notification } from './NotificationList';

export default function Notifications() {

  const [notifications, setNotifications] = useState<Notification[]>([]);

  const fetchNotifications = async () => {
    const data = await GetNotifications();
    console.log(data);
    setNotifications(data);
  };

  useEffect(() => {
    // Fetch notifications initially and set up polling
    fetchNotifications();

    const interval = setInterval(() => {
      fetchNotifications();

    }, 5000); // Poll every 5 seconds

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col w-full">
      
    <div className="flex items-center px-2 py-3 justify-between font-bold">
        <span className="mr-2 text-gray-600 dark:text-gray-200">
        </span>
        <span className="t">org_id</span>
        <span className="text-gray-600 dark:text-gray-200 flex-1 text-center">created_at</span>
        <span className="text-gray-600 dark:text-gray-200 flex-1 text-center">device_id</span>
        <span className="text-gray-600 dark:text-gray-200 flex-1 text-center">notification_type</span>
      </div>
      {notifications
  //.filter((notification: any) => notification.data.notification_type == "person_of_interest")
  .map((notification: Notification) => (
    <NotificationLine 
      notification={notification}
    />
  ))}
        </div>

  );
}
