import { parseISO, formatDistanceToNow} from 'date-fns';
import { format } from 'date-fns-tz';
import { Tooltip } from 'react-tooltip'
import { OverlayTrigger, Popover } from 'react-bootstrap';

// eslint-disable-next-line react/prop-types
export default function TransactionCard({ date, type, amount, status, details }) {
  const formatDate = (unformattedDate) => {
    const parsedDate = parseISO(unformattedDate);
    return formatDistanceToNow(
      parsedDate,
      { addSuffix: true }
    );
  };
  const formatTooltipDate = (unformattedDate) => {
    const parsedDate = parseISO(unformattedDate);
    return format(parsedDate, "MM/dd/yyyy hh:mm a 'MST'", { timeZone: 'America/Denver' });
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
    <>
      <div>
        <Tooltip
          id="date-tooltip"
          content={formatTooltipDate(date)}
          place="top"
          delayShow={200}
        />
        <p data-tooltip-id="date-tooltip">
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
          <p className="details-text-primary" style={{ cursor: 'pointer' }}>Details...</p>
        </OverlayTrigger>
      </div>
    </>
  );
}