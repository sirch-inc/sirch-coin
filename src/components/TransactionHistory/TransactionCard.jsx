import { parseISO, formatDistanceToNow } from 'date-fns';
import { format } from 'date-fns-tz';
import { Tooltip } from 'react-tooltip';
import { OverlayTrigger, Popover } from 'react-bootstrap';


// eslint-disable-next-line react/prop-types
export default function TransactionCard({ transaction }) {
  const { created_at, type, amount, status, details } = transaction;

  const formatDate = (isoDate) => {
    const parsedDate = parseISO(isoDate);
    return formatDistanceToNow(parsedDate, { addSuffix: true });
  };

  const formatTooltipDate = (isoDate) => {
    const parsedDate = parseISO(isoDate);
    return format(parsedDate, "eee MM/dd/yyyy hh:mm:ss a zzz");
  };

  const getTransactionDetails = () => {
    switch (type) {
      case "SENT":
        return `Receiver: ${details.to_user_fullname || ""} (${
          details.to_user_handle || ""
        })${details.memo ? `\nMemo: ${details.memo}` : ""}`;
      case "RECEIVED":
        return `Sender: ${details.from_user_fullname || ""} (${
          details.from_user_handle || ""
        })${details.memo ? `\nMemo: ${details.memo}` : ""}`;
      case "PURCHASE":
        return `Stripe Payment Intent ID: ${details.paymentIntentId || ""}`;
      case "INITIAL BALANCE":
        return `Welcome!`;
      default:
        return "";
    }
  };

  const detailsPopover = (
    <Popover id="details-popover">
      <Popover.Header as="h3">Transaction Details</Popover.Header>
      <Popover.Body>
        <pre>{getTransactionDetails()}</pre>
      </Popover.Body>
    </Popover>
  );

  return (
    <div className="transaction-row">
      <div>
        <Tooltip
          id="date-tooltip"
          content={formatTooltipDate(created_at)}
          place="top"
          delayShow={200}
        />
        <p data-tooltip-id="date-tooltip">{formatDate(created_at)}</p>
      </div>
      <div>
        <p>{type}</p>
      </div>
      <div>
        <p>ⓢ {amount}</p>
      </div>
      <div>
        <p>{status}</p>
      </div>
      <div>
        <OverlayTrigger
          trigger="click"
          placement="top"
          overlay={detailsPopover}
          rootClose
        >
          <p className="transaction-details">Show Details</p>
        </OverlayTrigger>
      </div>
    </div>
  );
}
