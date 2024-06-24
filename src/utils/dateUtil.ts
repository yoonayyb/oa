/**
 * Independent time operation tool to facilitate subsequent switch to dayjs
 * 日期方法
 */
import dayjs from 'dayjs';

const DATE_TIME_FORMAT = 'YYYY-MM-DD HH:mm:ss';
const DATE_FORMAT = 'YYYY-MM-DD';

export function formatToDateTime(date?: dayjs.ConfigType, format = DATE_TIME_FORMAT): string {
  return dayjs(date).format(format);
}

export function formatToDate(date?: dayjs.ConfigType, format = DATE_FORMAT): string {
  return dayjs(date).format(format);
}
/* 计算两个日期中的天数差异 */
export function daysDiff(date1: dayjs.ConfigType, date2: dayjs.ConfigType): Number {

  const firstDate = dayjs(date1);
  const lastDate = dayjs(date2);
  return lastDate.diff(firstDate, 'day') + 1;
}
// 返回前后日期
export function calculateDates(date, days) {
  const inputDate = dayjs(date)
  days = days - 1
  const addedDate = inputDate.add(days, 'day')
  const subtractedDate = inputDate.subtract(days, 'day')

  return [subtractedDate.format('YYYY-MM-DD'), addedDate.format('YYYY-MM-DD')]
}
export const dateUtil = dayjs;
