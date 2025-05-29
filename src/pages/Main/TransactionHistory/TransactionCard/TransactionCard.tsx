import { parseISO, formatDistanceToNow } from 'date-fns';
import { format } from 'date-fns-tz';
import { Tooltip } from 'react-tooltip';
import { OverlayTrigger, Popover } from 'react-bootstrap';
import { Button } from '@heroui/react';
import './TransactionCard.css';

export interface TransactionDetails {
  to_user_fullname?: string;
  to_user_handle?: string;
  from_user_fullname?: string;
  from_user_handle?: string;
  memo?: string;
  paymentIntentId?: string;
}

export interface Transaction {
  created_at: string;
  type: 'SENT' | 'RECEIVED' | 'PURCHASE' | 'INITIAL BALANCE';
  amount: number;
  status: string;
  details: TransactionDetails;
}

interface TransactionCardProps {
  transaction: Transaction;
}

const formatDate = (isoDate: string): string => {
  const parsedDate = parseISO(isoDate);
  return formatDistanceToNow(parsedDate, { addSuffix: true });
};

const formatTooltipDate = (isoDate: string): string => {
  const parsedDate = parseISO(isoDate);
  return format(parsedDate, "eee MM/dd/yyyy hh:mm:ss a zzz");
};

const getTransactionDetails = (type: Transaction['type'], details: TransactionDetails): string => {
  switch (type) {
    case 'SENT':
      return `Receiver: ${details.to_user_fullname || ""} (${
        details.to_user_handle || ""
      })${details.memo ? `\nMemo: ${details.memo}` : ""}`;
    case 'RECEIVED':
      return `Sender: ${details.from_user_fullname || ""} (${
        details.from_user_handle || ""
      })${details.memo ? `\nMemo: ${details.memo}` : ""}`;
    case 'PURCHASE':
      return `Stripe Payment Intent ID: ${details.paymentIntentId || ""}`;
    case 'INITIAL BALANCE':
      return "Welcome!";
    default:
      return "";
  }
};

export default function TransactionCard({ transaction }: TransactionCardProps) {
  const { created_at, type, amount, status, details } = transaction;

  const detailsPopover = (
    <Popover id="details-popover">
      <Popover.Header as="h3">Transaction Details</Popover.Header>
      <Popover.Body>
        <pre>{getTransactionDetails(type, details)}</pre>
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
          <Button
            className="transaction-details"
            aria-haspopup="true"
            aria-expanded="false"
          >
            Show Details
          </Button>
        </OverlayTrigger>
      </div>
    </div>
  );
}