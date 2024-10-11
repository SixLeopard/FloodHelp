export const formatDateTime = (dateTimeStr) => {
    if (dateTimeStr) {
        // Parse the input dateTimeStr
        const [date, time] = dateTimeStr.split(' ');
        const [day, month, year] = date.split('/');
        const [hours, minutes] = time.split(':');

        // Convert the year to a full year (assuming 2000s for years < 100)
        const fullYear = year.length === 2 ? `20${year}` : year;

        // Create a Date object in local time
        const dateObj = new Date(fullYear, month - 1, day, hours, minutes);

        // Check if the date is valid
        if (isNaN(dateObj.getTime())) {
            return "Invalid date";
        }

        // Calculate time difference
        const now = new Date(); // Current local time
        const timeDiff = now - dateObj; // Difference in milliseconds

        // If date is in the future
        if (timeDiff < 0) {
            return "In the future";
        }

        // Convert time difference to a more readable format
        const seconds = Math.floor(timeDiff / 1000);
        const minutesDiff = Math.floor(seconds / 60);
        const hoursDiff = Math.floor(minutesDiff / 60);
        const daysDiff = Math.floor(hoursDiff / 24);

        let timeAgo;

        if (daysDiff > 0) {
            timeAgo = `${daysDiff} day${daysDiff > 1 ? 's' : ''} ago`;
        } else if (hoursDiff > 0) {
            timeAgo = `${hoursDiff} hour${hoursDiff > 1 ? 's' : ''} ago`;
        } else if (minutesDiff > 0) {
            timeAgo = `${minutesDiff} minute${minutesDiff > 1 ? 's' : ''} ago`;
        } else {
            timeAgo = `${seconds} second${seconds > 1 ? 's' : ''} ago`;
        }

        // Format the time as HH:MM AM/PM
        const hour12 = hours % 12 || 12; // Convert to 12-hour format
        const ampm = hours >= 12 ? 'PM' : 'AM';
        const formattedTime = `${String(hour12).padStart(2, '0')}:${String(minutes).padStart(2, '0')} ${ampm}`;

        // Return the final formatted string
        return `${timeAgo} (${formattedTime})`;
    } else {
        return "Invalid input";
    }
};
