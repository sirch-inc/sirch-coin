import coinSymbol from "../../../public/ⓢ.png"


export default function Offline() {
  return (
    <>
      <div className="offline-container">
        <div className="offline-img">
          <img src={coinSymbol}></img>
        </div>
        <div className="offline-text">
          <h1>Sirch Coins is currently unavailable.</h1>
          <br/>
          <p>We are working on making our services available soon. Stay tuned!</p>
        </div>
      </div>
    </>
  )
}