import dayjs from 'dayjs';

export const formatDate = (value?: string | Date, withTime = false) =>
  value ? dayjs(value).format(withTime ? 'YYYY-MM-DD HH:mm' : 'YYYY-MM-DD') : '—';
