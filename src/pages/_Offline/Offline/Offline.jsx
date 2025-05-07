import coinSymbol from '../../../assets/ⓢ.png'
import './Offline.css';


export default function Offline() {
  return (
    <div className='offline-container'>
      <div className='offline-img'>
        <img src={coinSymbol}/>
      </div>
      <div className='offline-text'>
        <h1>Gone Fishing!</h1>
        <br/>
        <p>Sirch Coins is undergoing systems maintenance for a brief period.</p>
        <p>Please check back soon!</p>
      </div>
    </div>
  )
}