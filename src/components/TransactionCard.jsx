
export default function TransactionCard({ date, sender, receiver, amount}){

    return (
        <>
        <p>{date}</p>
        <p>{sender}</p>
        <p>{receiver}</p>
        <p>{amount}</p>
        </>
    )
}