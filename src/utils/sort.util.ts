const sortByCreatedAt = (
  a: { createdAt?: string | Date },
  b: { createdAt?: string | Date }
) => {
  return new Date(a.createdAt || '').getTime() >
    new Date(b.createdAt || '').getTime()
    ? 1
    : -1;
};

export const SortUtil = {
  sortByCreatedAt: sortByCreatedAt,
};
