import coinSymbol from "../../../public/ⓢ.png"


export default function ComingSoon() {
  return (
    <>
      <div className="coming-soon-container">
        <div className="coming-soon-img">
          <img src={coinSymbol}></img>
        </div>
        <div className="coming-soon-text">
          <h1>Coming Soon!</h1>
          <br/>
          <p>Sirch Coins are a unique form of digital currency integral to the Sirch platform.</p>
          <p>Please stay tuned!  You'll soon be able to buy, spend, and send Sirch Coins!</p>
        </div>
      </div>
    </>
  )
}