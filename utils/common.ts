import { expect } from "@playwright/test";

/**
 * String format function.
 * Formats a string by replacing placeholders like `{0}`, `{1}`, etc., with corresponding arguments.
 * 
 * @param str - The string to be formatted, containing placeholders.
 * @param args - The arguments to replace the placeholders in the string.
 * @returns A formatted string with placeholders replaced by the provided arguments.
 */
export const stringFormat = (str: string, ...args: (string | number)[]): string =>
   str.replace(/{(\d+)}/g, (match, index) => args[index] !== undefined ? args[index].toString() : "");
