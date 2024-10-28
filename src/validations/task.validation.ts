import { ITaskInput } from "../interfaces/task.interface";
import { isValidString } from "./helpers.validation";

const isValidTaskDate = (initialDate: string, endDate: string): boolean => {
  const start = new Date(initialDate);
  const end = new Date(endDate);

  if (isNaN(start.getTime()) || isNaN(end.getTime())) {
    return false;
  }

  return end >= start;
};

export const validateTaskInput = (taskData: ITaskInput) => {
  const errors: string[] = [];

  if (!isValidString(taskData.title, 3)) {
    errors.push("Title must be at least 3 caracters long");
  }
  if (!isValidString(taskData.description, 3)) {
    errors.push("Description must be at least 3 caracters long");
  }
  if (!isValidString(taskData.tag, 3)) {
    errors.push("Tag must be at least 3 caracters long");
  }
  if (!isValidTaskDate(taskData.initialDate, taskData.endDate)) {
    errors.push("Invalid initial or end dates");
  }

  return errors;
};
