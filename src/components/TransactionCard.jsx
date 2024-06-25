
export default function TransactionCard({ date, sender, receiver, amount }){

    return (
        <>
            <div>
                <p>{date}</p>
                <p>{sender}</p>
                <p>{receiver}</p>
                <p>{amount} Sirch Coins</p>
            </div>
        </>
    )
}