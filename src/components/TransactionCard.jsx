
export default function TransactionCard({ date, sender, receiver, amount }){

    return (
        <>
            <div>
                <p>{date}</p>
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