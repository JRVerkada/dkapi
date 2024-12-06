"use client"
import NotificationLine from './Notification';
import { useState, useEffect } from 'react';
import {GetAllNotifications, GetNotifications} from "@/components/NotificationList"  
import { Notification } from './NotificationList';
import { format, parseISO, isWithinInterval } from "date-fns";

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
    created_at_from: "",
    created_at_to: "",
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

    const createdAtDate = new Date(notification.created_at * 1000); // Convert epoch to Date object

    const isWithinDateRange =
      (!filters.created_at_from || 
        new Date(filters.created_at_from) <= createdAtDate) &&
      (!filters.created_at_to || 
        createdAtDate <= new Date(filters.created_at_to));

        return (
          (filters.org_id === "" || notification.org_id.includes(filters.org_id)) &&
          (filters.device_id === "" || notification.device_id.includes(filters.device_id)) &&
          (filters.notification_type === "" ||
            notification.notification_type.includes(filters.notification_type)) &&
          isWithinDateRange
        );
  });



  return (
    <div className="flex flex-col w-full">
      
      <div className="flex items-center px-2 py-3 justify-between font-bold">
        <span className="mr-2 text-gray-600 dark:text-gray-200"></span>

        <span className="text-gray-600 dark:text-gray-200 flex-1 text-center">
        <label className="block">Org_id</label>
          <input
            type="text"
            placeholder="Filter by org_id"
            className="bg-gray-100 dark:bg-gray-800 border rounded px-2 py-1"
            value={filters.org_id}
            onChange={(e) => handleFilterChange("org_id", e.target.value)}
          />
        </span>
        <span className="text-gray-600 dark:text-gray-200 flex-1 text-center">
          <div>
            <label className="block">From</label>
            <input
              type="datetime-local"
              className="bg-gray-100 dark:bg-gray-800 border rounded px-2 py-1"
              value={filters.created_at_from}
              onChange={(e) =>
                handleFilterChange("created_at_from", e.target.value)
              }
            />
          </div>
          <div>
            <label className="block">To</label>
            <input
              type="datetime-local"
              className="bg-gray-100 dark:bg-gray-800 border rounded px-2 py-1"
              value={filters.created_at_to}
              onChange={(e) =>
                handleFilterChange("created_at_to", e.target.value)
              }
            />
          </div>
        </span>
        <span className="text-gray-600 dark:text-gray-200 flex-1 text-center">
        <label className="block">Device_id</label>
          <input
            type="text"
            placeholder="Filter by device_id"
            className="bg-gray-100 dark:bg-gray-800 border rounded px-2 py-1"
            value={filters.device_id}
            onChange={(e) => handleFilterChange("device_id", e.target.value)}
          />
        </span>
        <span className="text-gray-600 dark:text-gray-200 flex-1 text-center">
        <label className="block">Notification_type</label>
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
