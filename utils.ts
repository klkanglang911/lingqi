/**
 * 将阿拉伯数字转换为中文数字
 * 支持范围：1-125
 * @param num 要转换的数字
 * @returns 中文数字字符串
 * @example
 * numberToChinese(1) // "一"
 * numberToChinese(10) // "十"
 * numberToChinese(11) // "十一"
 * numberToChinese(20) // "二十"
 * numberToChinese(101) // "一百零一"
 * numberToChinese(125) // "一百二十五"
 */
export function numberToChinese(num: number): string {
  if (num < 1 || num > 125) {
    return num.toString(); // 超出范围返回原数字
  }

  const digits = ['', '一', '二', '三', '四', '五', '六', '七', '八', '九'];

  // 1-9: 直接返回
  if (num < 10) {
    return digits[num];
  }

  // 10: 返回"十"
  if (num === 10) {
    return '十';
  }

  // 11-19: 十一、十二...十九
  if (num < 20) {
    return '十' + digits[num - 10];
  }

  // 20-99
  if (num < 100) {
    const tens = Math.floor(num / 10);
    const ones = num % 10;
    return digits[tens] + '十' + (ones > 0 ? digits[ones] : '');
  }

  // 100-125
  const hundreds = Math.floor(num / 100);
  const remainder = num % 100;

  let result = digits[hundreds] + '百';

  if (remainder === 0) {
    return result; // 整百
  }

  if (remainder < 10) {
    // 101-109: 需要加"零"
    result += '零' + digits[remainder];
  } else if (remainder === 10) {
    // 110: 一百一十
    result += '一十';
  } else if (remainder < 20) {
    // 111-119: 一百一十一...一百一十九
    result += '一十' + digits[remainder - 10];
  } else {
    // 120-125
    const tens = Math.floor(remainder / 10);
    const ones = remainder % 10;
    result += digits[tens] + '十' + (ones > 0 ? digits[ones] : '');
  }

  return result;
}
