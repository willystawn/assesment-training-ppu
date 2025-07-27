
import { Training } from "../types";

export const getDayNumber = (training: Training, selectedDate: string): number => {
    const startDate = new Date(training.start_date);
    const currentDate = new Date(selectedDate);
    startDate.setUTCHours(0, 0, 0, 0);
    currentDate.setUTCHours(0, 0, 0, 0);

    const diffTime = currentDate.getTime() - startDate.getTime();
    if (diffTime < 0) return -1;
    return Math.floor(diffTime / (1000 * 60 * 60 * 24)) + 1;
};
