const sortByDate = (a?: string | Date, b?: string | Date) => {
  return new Date(a || '').getTime() > new Date(b || '').getTime() ? 1 : -1;
};

export const SortUtil = {
  sortByDate: sortByDate,
};
