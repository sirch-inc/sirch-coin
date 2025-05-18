import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import TransactionCard from '../TransactionCard';
import { Transaction } from '../TransactionCard';

describe('TransactionCard', () => {
  const mockTransaction: Transaction = {
    created_at: '2024-03-20T12:00:00Z',
    type: 'SENT',
    amount: 100,
    status: 'COMPLETED',
    details: {
      to_user_fullname: 'John Doe',
      to_user_handle: 'johndoe',
      memo: 'Test transaction'
    }
  };

  it('renders transaction information correctly', () => {
    render(<TransactionCard transaction={mockTransaction} />);
    
    expect(screen.getByText(/ⓢ 100/)).toBeInTheDocument();
    expect(screen.getByText('SENT')).toBeInTheDocument();
    expect(screen.getByText('COMPLETED')).toBeInTheDocument();
    expect(screen.getByText('Show Details')).toBeInTheDocument();
  });

  it('displays relative time for transaction date', () => {
    const receivedTransaction: Transaction = {
      type: 'RECEIVED',
      details: {
        from_user_fullname: 'Jane Smith',
        from_user_handle: 'jsmith',
        memo: 'Test received'
      },
      created_at: '2024-03-20T12:00:00Z',
      amount: 50,
      status: 'COMPLETED'
    };
    render(<TransactionCard transaction={receivedTransaction} />);
    
    expect(screen.getByText(/ⓢ 50/)).toBeInTheDocument();
    expect(screen.getByText('RECEIVED')).toBeInTheDocument();
  });

  it('handles purchase transaction details', () => {
    const purchaseTransaction: Transaction = {
      type: 'PURCHASE',
      details: {
        paymentIntentId: 'pi_123456'
      },
      created_at: '2024-03-20T12:00:00Z',
      amount: 200,
      status: 'COMPLETED'
    };
    render(<TransactionCard transaction={purchaseTransaction} />);
    
    expect(screen.getByText(/ⓢ 200/)).toBeInTheDocument();
    expect(screen.getByText('PURCHASE')).toBeInTheDocument();
  });

  it('handles initial balance transaction', () => {
    const initialBalanceTransaction: Transaction = {
      type: 'INITIAL BALANCE',
      details: {},
      created_at: '2024-03-20T12:00:00Z',
      amount: 1000,
      status: 'COMPLETED'
    };
    render(<TransactionCard transaction={initialBalanceTransaction} />);
    
    expect(screen.getByText(/ⓢ 1000/)).toBeInTheDocument();
    expect(screen.getByText('INITIAL BALANCE')).toBeInTheDocument();
  });
});