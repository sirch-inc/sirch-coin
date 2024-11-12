import { parseISO, formatDistanceToNow } from 'date-fns';
import { format } from 'date-fns-tz';
import { Tooltip } from 'react-tooltip'
import { OverlayTrigger, Popover } from 'react-bootstrap';

// eslint-disable-next-line react/prop-types
export default function TransactionCard({ date, type, amount, status, details }) {
  const formatDate = (isoDate) => {
    const parsedDate = parseISO(isoDate);
    return formatDistanceToNow(
      parsedDate,
      { addSuffix: true }
    );
  };

  const formatTooltipDate = (isoDate) => {
    const parsedDate = parseISO(isoDate);
    return format(
      parsedDate,
      "MM/dd/yyyy hh:mm a zzz"
    );
  };

  const detailsPopover = (
    <Popover id="details-popover">
      <Popover.Header as="h3">Transaction Details</Popover.Header>
      <Popover.Body>
        <pre>{details}</pre>
      </Popover.Body>
    </Popover>
  );

  return (
    <div className='transaction-row'>
      <div>
        <Tooltip
          id='date-tooltip'
          content={formatTooltipDate(date)}
          place='top'
          delayShow={200}
        />
        <p data-tooltip-id='date-tooltip'>
          {formatDate(date)}
        </p>
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
        <OverlayTrigger trigger="click" placement="top" overlay={detailsPopover} rootClose>
          <p className="transaction-details" style={{ cursor: 'pointer' }}>Show Details</p>
        </OverlayTrigger>
      </div>
    </div>
  );
}