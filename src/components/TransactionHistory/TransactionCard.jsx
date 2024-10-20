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
    <>
      <div className='transaction-row'>
        <div>
          <p>{formatDate(date)}</p>
        </div>
        <div>
          <p>{type}</p>
        </div>
        <div>
          <p>ⓢ {amount}</p>
        </div>
        <div>
          <p>{status}</p>
        </div>
        <div>
          <p>{details}</p>
        </div>
    </div>
    </>
  );
}