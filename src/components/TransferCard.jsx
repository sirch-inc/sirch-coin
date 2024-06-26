import { parseISO, formatDistanceToNow } from 'date-fns';


export default function TransferCard({ date, target, amount }) {
    const formatDate = (unformattedDate) => {
        const formattedDate = parseISO(unformattedDate);
        return formatDistanceToNow(
            formattedDate,
            { addSuffix: true }
        );          
    }

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
    )
}