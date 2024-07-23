import { parseISO, formatDistanceToNow } from 'date-fns';

// eslint-disable-next-line react/prop-types
export default function TransferCard({ id, date, type, amount, status }) {
  const formatDate = (unformattedDate) => {
    const parsedDate = parseISO(unformattedDate);
    return formatDistanceToNow(
      parsedDate,
      { addSuffix: true }
    );
  };

  return (
    <>
      <div>
        <p>{formatDate(date)}</p>
      </div>
      <div>
        <p>{id}</p>
      </div>
      <div>
        <p>{type}</p>
      </div>
      <div>
        <p>{amount}</p>
      </div>
      <div>
        <p>{status}</p>
      </div>
    </>
  );
}