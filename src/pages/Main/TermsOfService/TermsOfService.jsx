import { useNavigate } from 'react-router-dom';
import './TermsOfService.css';


// eslint-disable-next-line react/prop-types
export default function TermsOfService() {
  const navigate = useNavigate();

  return (
    <div className='terms-of-service'>
      <h1>Terms of Service for Sirch Coins</h1>
      <h2>Effective Date: November 26, 2024</h2>
      <h2>Last Updated: November 26, 2024</h2>
      <p>
      These Terms of Service (“Terms”) govern your use of Sirch Coins, a proprietary digital currency issued by The Sirch Engine, Inc. (“Sirch,” “we,” “our,” or “us”). By acquiring, holding, or using Sirch Coins, you agree to comply with and be bound by these Terms. If you do not agree to these Terms, you may not use Sirch Coins.
      </p>
      <ol>
        <li>Nature of Sirch Coins<br/>
        Sirch Coins are a proprietary digital currency issued and maintained by Sirch. Sirch Coins are recorded securely on systems managed by Sirch and serve as a digital medium of exchange within the Sirch ecosystem. Sirch Coins do not represent or confer any rights to monetary redemption, tangible assets, or equity ownership in Sirch.
        </li>
        <li>Risk of Value Loss<br/>
        In the event Sirch ceases operations, declares bankruptcy, or otherwise becomes insolvent, all Sirch Coins will be rendered valueless, and no compensation, refund, or restitution will be provided. Users acknowledge this inherent risk and accept that Sirch Coins are subject to complete loss of value under these circumstances.
        </li>
        <li>Non-Redemption for Legal Tender<br/>
        Sirch Coins cannot be redeemed for cash, fiat currency, or any equivalent legal tender. While users may send Sirch Coins to other individuals or entities, Sirch does not facilitate or guarantee any method for exchanging Sirch Coins for fiat currency or other assets.
        </li>
        <li>Account Access and Security<br/>
        It is your sole responsibility to maintain the security of your account credentials and access. In the event you lose access to your account or Sirch Coins, Sirch bears no responsibility for recovery or restitution. Lost or inaccessible Sirch Coins cannot be retrieved, replaced, or reimbursed under any circumstances.
        </li>
        <li>Irrevocability of Transactions<br/>
        Transactions involving Sirch Coins are final and irrevocable. If you send Sirch Coins to another user or entity, Sirch cannot reverse the transaction or return the coins to your account, regardless of the reason for the transaction or any subsequent disputes.
        </li>
        <li>Use of Sirch Coins for Ad Space<br/>
        Sirch Coins may be used to purchase advertising space through Sirch’s platform. The availability and amount of advertising space are subject to a market-based auction system. Sirch does not guarantee any specific amount of advertising space in exchange for Sirch Coins. The terms and conditions governing the advertising auction system are incorporated by reference into these Terms.
        </li>
        <li>Marketplace Transactions<br/>
        Sirch provides infrastructure to facilitate the transfer of Sirch Coins between users. Sirch does not participate in, oversee, or guarantee the terms, conditions, or outcomes of any market transactions involving Sirch Coins. Users are solely responsible for determining the value, terms, and legality of any exchange of Sirch Coins.
        </li>
        <li>Third-Party Acceptance<br/>
        The acceptance of Sirch Coins as a medium of exchange by third parties is entirely discretionary. Sirch does not require, incentivize, or compel any individual, business, or organization to accept Sirch Coins.
        </li>
        <li>Disclaimer of Warranties<br/>
        Sirch Coins are provided “as is” without warranty of any kind, express or implied. Sirch disclaims all warranties, including but not limited to warranties of merchantability, fitness for a particular purpose, and non-infringement.
        </li>
        <li>Limitation of Liability<br/>
        To the fullest extent permitted by law, Sirch shall not be liable for any direct, indirect, incidental, special, consequential, or exemplary damages arising from or related to the use, misuse, or inability to use Sirch Coins, including but not limited to loss of value, loss of data, or loss of access.
        </li>
        <li>Modifications to the Terms<br/>
        Sirch reserves the right to amend, modify, or discontinue these Terms at any time without prior notice. Continued use of Sirch Coins after any modification constitutes acceptance of the revised Terms.
        </li>
        <li>Governing Law and Dispute Resolution<br/>
        These Terms shall be governed by and construed in accordance with the laws of the State of Colorado. Any disputes arising under or in connection with these Terms shall be resolved through binding arbitration conducted under the rules of the <a target='_blank' href='https://www.adr.org/'>American Arbitration Association</a> (referred to as the "AAA").
        </li>
      </ol>
      <p>
        By using Sirch Coins, you affirm that you have read, understood, and agree to be bound by these Terms of Service.
      </p>
      <p>
        If you have any questions, please contact us at:<br/>
        Email: <a href="mailto:josh@sirch.ai">josh@sirch.ai</a><br/>
        Phone: <a href="tel:+18483293092">+1 (848) 329-3092</a><br/>
        Mail: Josh R. (Sirch), 4821 S. Xenia Street, Denver CO, 80237.
      </p>

      <div className='bottom-btn-container'>
        <button className='big-btn'
          onClick={() => { navigate(-1); }}>
          Back
        </button>
      </div>
    </div>
  );
}