"use client"
import NotificationLine from './Notification';
import { useState, useEffect } from 'react';
import {GetAllNotifications, GetNotifications} from "@/components/NotificationList"  
import { Notification } from './NotificationList';

export default function Notifications() {

  const [notifications, setNotifications] = useState<Notification[]>([]);

  const fetchNotifications = async () => {
    const data = await GetAllNotifications();
    setNotifications(data);
  };

  useEffect(() => {
    // Fetch notifications initially and set up polling
    fetchNotifications();
  
    const interval = setInterval(() => {
      fetchNotifications();
    }, 20000); // Poll every 20 seconds
  
    const timeout = setTimeout(() => {
      clearInterval(interval); // Stop polling after 10 minutes
    }, 600000); // 10 minutes = 600000 milliseconds
  
    return () => {
      clearInterval(interval);
      clearTimeout(timeout);
    };
  }, []);


  const [filters, setFilters] = useState({
    org_id: "",
    created_at: "",
    device_id: "",
    notification_type: "",
  });

  // Update filter values
  const handleFilterChange = (key: string, value: string) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
    }));
  };
  

  // Apply filters
  const filteredNotifications = notifications.filter((notification) => {
    return (
      (filters.org_id === "" || notification.org_id.includes(filters.org_id)) &&
      (filters.created_at === "" || notification.created_at.toString().includes(filters.created_at)) &&
      (filters.device_id === "" || notification.device_id.includes(filters.device_id)) &&
      (filters.notification_type === "" ||
        notification.notification_type.includes(filters.notification_type))
    );
  });



  return (
    <div className="flex flex-col w-full">
      
      <div className="flex items-center px-2 py-3 justify-between font-bold">
        <span className="mr-2 text-gray-600 dark:text-gray-200"></span>

        <span className="text-gray-600 dark:text-gray-200 flex-1 text-center">
          <input
            type="text"
            placeholder="Filter by org_id"
            className="bg-gray-100 dark:bg-gray-800 border rounded px-2 py-1"
            value={filters.org_id}
            onChange={(e) => handleFilterChange("org_id", e.target.value)}
          />
        </span>
        <span className="text-gray-600 dark:text-gray-200 flex-1 text-center">
          <input
            type="text"
            placeholder="Filter by created_at"
            className="bg-gray-100 dark:bg-gray-800 border rounded px-2 py-1"
            value={filters.created_at}
            onChange={(e) => handleFilterChange("created_at", e.target.value)}
          />
        </span>
        <span className="text-gray-600 dark:text-gray-200 flex-1 text-center">
          <input
            type="text"
            placeholder="Filter by device_id"
            className="bg-gray-100 dark:bg-gray-800 border rounded px-2 py-1"
            value={filters.device_id}
            onChange={(e) => handleFilterChange("device_id", e.target.value)}
          />
        </span>
        <span className="text-gray-600 dark:text-gray-200 flex-1 text-center">
          <input
            type="text"
            placeholder="Filter by notification_type"
            className="bg-gray-100 dark:bg-gray-800 border rounded px-2 py-1"
            value={filters.notification_type}
            onChange={(e) => handleFilterChange("notification_type", e.target.value)}
          />
        </span>
      </div>

      {/* Filtered notifications */}
      {filteredNotifications.map((notification, index) => (
        <NotificationLine key={index} notification={notification} />
      ))}
    </div>

  );
}
