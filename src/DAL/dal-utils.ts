/**
 * Returns a select statement  that converts milliseconds to minutes text
 * For example, 66600 which equal to 1.11 minutes will be converted to 1:07.00 text
 * steps:
 *  1. divide the milliseconds by 60,000 in order to get the duration
 *  2. convert to int and then to text in order to get the minutes part of the duration
 *  3. divide the milliseconds by 60,000, then use modulo 1 to get the seconds part, then divide by 60 to convert seconds from duration to time
 *  4. round by 3 decimal points and convert to text
 *  5. concat minutes and seconds to get the time text
 */
export const selectMillisecondsAsMinutesText = (
  millisecondsColumn: string
): string => {
  const minutesPart = `(${millisecondsColumn}::numeric / 60000)::int::text`;
  const secondsPart = `round((${millisecondsColumn}::numeric / 60000 % 1 * 60), 3)::text`;

  return `concat(${minutesPart}, ':', ${secondsPart})`;
};
