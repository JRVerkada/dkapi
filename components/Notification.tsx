"use client"
import { useState } from 'react';
import { format } from 'date-fns';
import { Notification } from './NotificationList';

type NotificationLineProps = {
  key: number,
  notification: Notification;
};

export default function NotificationLine({ key, notification }: NotificationLineProps) {
  // State to control the visibility of additional information
  const [isExpanded, setIsExpanded] = useState(false);

  // Convert epoch time to a Date object and format it
  const formattedDate = format(new Date(notification.created_at * 1000), 'MMMM dd, yyyy HH:mm:ss');

  // Toggle the expanded state
  const toggleExpanded = () => {
    setIsExpanded((prev) => !prev);
  };

  return (
    <div className="flex flex-col w-full bg-white shadow-md dark:bg-gray-800 mb-1">
      {/* Accordion Header */}
      <div className="flex items-center px-2 py-3 justify-between cursor-pointer" onClick={toggleExpanded}>
        <button className="mr-2 text-gray-600 dark:text-gray-200">
          {isExpanded ? '−' : '+'} {/* Display plus/minus based on state */}
        </button>
        <span className="text-gray-600 dark:text-gray-200 flex-1 text-center">{notification.org_id}</span>
        <span className="text-gray-600 dark:text-gray-200 flex-1 text-center">{formattedDate}</span>
        <span className="text-gray-600 dark:text-gray-200 flex-1 text-center">{notification.device_id}</span>
        <span className="text-gray-600 dark:text-gray-200 flex-1 text-center">{notification.notification_type}</span>
      </div>

      {/* Additional Information */}
      {isExpanded && (
        <div className="px-2 py-3 bg-gray-100 dark:bg-gray-700">
          {/* Render additional information from fulldata */}
          {notification.fulldata && (
            <>
            <div className="px-2 py-3">
            <pre className="bg-gray-100 dark:bg-gray-700 p-2 rounded overflow-auto whitespace-pre-wrap break-words">
        <code className="text-gray-600 dark:text-gray-200">{notification.fulldata}</code>
      </pre>
            </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}
