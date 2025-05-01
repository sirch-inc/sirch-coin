import coinSymbol from '../../ⓢ.png'
import { useNavigate } from 'react-router-dom';


export default function About() {
  const navigate = useNavigate();

  return (
    <>
      <div className='about-container'>
        <div className='about-img'>
          <img src={coinSymbol}></img>
        </div>
        <div className='about-text'>
          <p>
            Sirch Coins are a unique form of digital currency integral to the Sirch search platform.
          </p>
          <p>
            <i>Unlike</i> traditional cryptocurrencies, Sirch Coins are specifically tied to the ad space on the Sirch platform. This connection to ad space is reminiscent of the gold standard, where the Federal Reserve held gold to back the value of the dollar. To buy ad space on Sirch, one must use Sirch Coins, which are burned once used, limiting their supply and potentially increasing their value over time.
          </p>
          <p>
            Currently, Sirch Coins are available at a 90% discount, making it an attractive investment opportunity. The platform aims to make these coins a versatile digital currency that can be used both on and off the Sirch platform, potentially replacing traditional payment methods like cash and Venmo. Additionally, Sirch incentivizes users to get local stores to accept Sirch Coins by offering rewards for successful referrals.
          </p>
          <p>
            Read more at <a href='https://sirch.ai/' target='_blank'>Sirch - a democratic AI search engine</a>.
          </p>
        </div>
      </div>
  
      <div className='bottom-btn-container'>
        <button className='big-btn'
          onClick={() => { navigate(-1); }}>
          Back
        </button>
      </div>
    </>
  )
}