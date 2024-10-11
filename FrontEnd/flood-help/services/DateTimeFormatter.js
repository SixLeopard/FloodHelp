export const formatDateTime = (dateTimeStr) => {

    if (dateTimeStr != null) {
        // Split the input string into date and time parts
        const [date, time] = dateTimeStr.split(' ');

        const [day, month] = date.split('/');

        // Extract the hour and minutes from the time
        const [hours, minutes] = time.split(':');

        // Format the new string
        return `${hours}:${minutes} ${day}/${month}`;
    } else {
        return "00:00 00/00"
    }
};
