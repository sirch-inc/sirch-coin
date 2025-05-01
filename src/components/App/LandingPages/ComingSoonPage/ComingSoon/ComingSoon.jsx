import coinSymbol from '../../../../../ⓢ.png'
import './ComingSoon.css';


export default function ComingSoon() {
  return (
    <div className='coming-soon-container'>
      <div className='coming-soon-img'>
        <img src={coinSymbol}/>
      </div>
      <div className='coming-soon-text'>
        <h1>Coming Soon!</h1>
        <br/>
        <p>Sirch Coins are a unique form of digital currency integral to the Sirch platform.</p>
        <p>Please stay tuned. You will soon be able to buy, send, and spend Sirch Coins!</p>
      </div>
    </div>
  )
}