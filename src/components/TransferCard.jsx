import { parseISO, format } from 'date-fns';

export default function TransferCard({ date, sender, receiver, amount }){

    const formatDate = (unformattedDate) => {
        const formattedDate = parseISO(unformattedDate);
        return format(formattedDate, "MMMM do, yyyy, hh:mma");
    }

    return (
        <>
            <div>
                <p>{formatDate(date)}</p>
            </div>
            <div>
                <p>{sender}</p>
            </div>
            <div>
                <p>{receiver}</p>
            </div>
            <div>
                <p>{amount} Sirch Coins</p>
            </div>
        </>
    )
}