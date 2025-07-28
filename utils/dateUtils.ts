
import { Training } from "../types";

export const getDayNumber = (training: Training, selectedDate: string): number => {
    const startDate = new Date(training.start_date);
    const currentDate = new Date(selectedDate);
    startDate.setUTCHours(0, 0, 0, 0);
    currentDate.setUTCHours(0, 0, 0, 0);

    // If selected date is before start date
    if (currentDate.getTime() < startDate.getTime()) {
        return -1;
    }

    const dayOfWeek = currentDate.getUTCDay(); // Sunday = 0, Saturday = 6
    if (dayOfWeek === 0 || dayOfWeek === 6) {
        return -2; // Indicates a weekend
    }
    
    let workingDays = 0;
    const iterDate = new Date(startDate);

    while(iterDate.getTime() <= currentDate.getTime()) {
        const iterDayOfWeek = iterDate.getUTCDay();
        if (iterDayOfWeek !== 0 && iterDayOfWeek !== 6) { // It's a weekday
            workingDays++;
        }
        iterDate.setUTCDate(iterDate.getUTCDate() + 1);
    }

    return workingDays;
};
