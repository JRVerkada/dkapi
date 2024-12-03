"use client"
import { useState } from 'react';
import { format } from 'date-fns';
import { Notification } from './NotificationList';
import React from 'react';

function makeUrlsClickable(text:string) {
  // Regular expression to match URLs
  const urlRegex = /(https?:\/\/[^\s]+)/g;
  
  // Replace URLs with anchor tags
  return text.replace(urlRegex, (url) => {
    return `<a href="${url}" target="_blank" rel="noopener noreferrer" class="text-blue-500 hover:text-blue-700">${url}</a>`;
  });
}

type NotificationLineProps = {
  key: number,
  notification: Notification;
};

export default function NotificationLine({notification }: NotificationLineProps) {
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
            <img src={notification.image_url} alt={notification.image_url} />
              <a href={notification.video_url} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:text-blue-700">
        Video Link
        </a>
              <br/>Full Event:
            <pre className="bg-gray-100 dark:bg-gray-700 p-2 rounded overflow-auto whitespace-pre-wrap break-words">
            <code 
          className="text-gray-600 dark:text-gray-200"
          dangerouslySetInnerHTML={{ __html: makeUrlsClickable(notification.fulldata) }}
        />
      </pre>

            </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}
