import { parseISO, formatDistanceToNow } from 'date-fns';

// eslint-disable-next-line react/prop-types
export default function TransactionCard({ date, type, amount, status, details }) {
  const formatDate = (unformattedDate) => {
    const parsedDate = parseISO(unformattedDate);
    return formatDistanceToNow(
      parsedDate,
      { addSuffix: true }
    );
  };

  return (
    <div className='transaction-row'>
      <p>{formatDate(date)}</p>
      <p>{type}</p>
      <p>ⓢ {amount}</p>
      <p>{status}</p>
      <p className='transaction-details'>{details}</p>
    </div>
  );
}