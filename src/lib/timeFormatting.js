import { DateTime, Interval } from 'luxon'

export function formatTimeModified(timeModifiedString) {
    const timeModified = DateTime.fromISO(timeModifiedString);
    const timeNow = DateTime.now();
    
    const interval = Interval.fromDateTimes(timeModified, timeNow);

    const duration = interval.toDuration(['days', 'hours', 'minutes', 'seconds'])

    if (duration.days > 6) {
        // i.e. "June 11, 2024"
        return timeModified.toFormat('DDD');
    }

    if (duration.days >= 1) {
        // i.e. "Wednesday at 6:10 PM"
        return `${timeModified.toFormat('cccc')} at ${timeModified.toFormat('t')}`;
    }

    if (duration.hours > 1) {
        return `${duration.hours} hours ago`;
    }

    if (duration.hours === 1) {
        return '1 hour ago';
    }

    if (duration.minutes > 1) {
        return `${duration.minutes} minutes ago`;
    }

    if (duration.minutes === 1) {
        return '1 minute ago';
    }

    return 'just now';
}


