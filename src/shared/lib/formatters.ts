export function formatShortDate(value: string | Date) {
  const dateParts = getDateParts(value);
  const monthLabels = [
    'jan',
    'fev',
    'mar',
    'abr',
    'mai',
    'jun',
    'jul',
    'ago',
    'set',
    'out',
    'nov',
    'dez',
  ];

  return `${dateParts.day.toString().padStart(2, '0')} ${monthLabels[dateParts.month]} ${dateParts.year}`;
}

export function formatCurrency(
  value: number,
  options: {
    minimumFractionDigits?: number;
    maximumFractionDigits?: number;
  } = {},
) {
  const minimumFractionDigits = options.minimumFractionDigits ?? 0;
  const maximumFractionDigits = Math.max(
    options.maximumFractionDigits ?? minimumFractionDigits,
    minimumFractionDigits,
  );
  const sign = value < 0 ? '-' : '';
  const absoluteValue = Math.abs(value);
  const fixedValue = absoluteValue.toFixed(maximumFractionDigits);
  const [integerPart, decimalPart = ''] = fixedValue.split('.');
  const integer = formatInteger(Number(integerPart));

  if (maximumFractionDigits === 0) {
    return `${sign}R$ ${integer}`;
  }

  const trimSize = maximumFractionDigits - minimumFractionDigits;
  const normalizedDecimal =
    trimSize > 0
      ? decimalPart.replace(new RegExp(`0{1,${trimSize}}$`), '').padEnd(minimumFractionDigits, '0')
      : decimalPart.padEnd(minimumFractionDigits, '0');

  if (!normalizedDecimal) {
    return `${sign}R$ ${integer}`;
  }

  return `${sign}R$ ${integer},${normalizedDecimal}`;
}

export function formatCompactCurrency(value: number) {
  if (Math.abs(value) >= 1_000_000) {
    return `R$ ${formatDecimal(value / 1_000_000)} mi`;
  }

  if (Math.abs(value) >= 1_000) {
    return `R$ ${formatDecimal(value / 1_000)} mil`;
  }

  return formatCurrency(value);
}

function getDateParts(value: string | Date) {
  if (typeof value === 'string') {
    const [year, month, day] = value.split('-').map(Number);

    if (year && month && day) {
      return { day, month: month - 1, year };
    }
  }

  const date = value instanceof Date ? value : new Date(value);

  return {
    day: date.getDate(),
    month: date.getMonth(),
    year: date.getFullYear(),
  };
}

function formatInteger(value: number) {
  return Math.round(value)
    .toString()
    .replace(/\B(?=(\d{3})+(?!\d))/g, '.');
}

function formatDecimal(value: number) {
  const roundedValue = Math.round(value * 10) / 10;

  if (Number.isInteger(roundedValue)) {
    return String(roundedValue);
  }

  return roundedValue.toFixed(1).replace('.', ',');
}
