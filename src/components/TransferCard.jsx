import { parseISO, formatDistanceToNow } from 'date-fns';


export default function TransferCard({ date, target, amount }) {
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
        <p>{target}</p>
      </div>
      <div>
        <p>{amount}</p>
      </div>
    </>
  );
}