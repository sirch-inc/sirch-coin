import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent, act } from '@testing-library/react';
import TransactionCard from '../TransactionCard';

describe('TransactionCard', () => {
  const mockTransaction = {
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
    
    // Check if all main elements are rendered
    expect(screen.getByText(/ⓢ 100/)).toBeInTheDocument();
    expect(screen.getByText('SENT')).toBeInTheDocument();
    expect(screen.getByText('COMPLETED')).toBeInTheDocument();
    expect(screen.getByText('Show Details')).toBeInTheDocument();
  });

  it('displays relative time for transaction date', () => {
    render(<TransactionCard transaction={mockTransaction} />);
    
    // The exact text will depend on when the test is run
    const dateElement = screen.getByText(/ago/);
    expect(dateElement).toBeInTheDocument();
  });

  it('shows transaction details when details button is clicked', async () => {
    render(<TransactionCard transaction={mockTransaction} />);
    
    const detailsButton = screen.getByText('Show Details');
    
    await act(async () => {
      fireEvent.click(detailsButton);
    });

    // Wait for the popover to appear
    await screen.findByText('Transaction Details');
    
    // Check if details are displayed
    expect(screen.getByText('Transaction Details')).toBeInTheDocument();
    expect(screen.getByText(/Receiver: John Doe \(johndoe\)/)).toBeInTheDocument();
    expect(screen.getByText(/Memo: Test transaction/)).toBeInTheDocument();
  });

  it('handles different transaction types correctly', async () => {
    const receivedTransaction = {
      ...mockTransaction,
      type: 'RECEIVED',
      details: {
        from_user_fullname: 'Jane Smith',
        from_user_handle: 'janesmith',
        memo: 'Received test'
      }
    };

    render(<TransactionCard transaction={receivedTransaction} />);
    
    const detailsButton = screen.getByText('Show Details');
    
    await act(async () => {
      fireEvent.click(detailsButton);
    });

    // Wait for the popover to appear
    await screen.findByText('Transaction Details');
    
    expect(screen.getByText(/Sender: Jane Smith \(janesmith\)/)).toBeInTheDocument();
    expect(screen.getByText(/Memo: Received test/)).toBeInTheDocument();
  });

  it('handles purchase transaction type', async () => {
    const purchaseTransaction = {
      ...mockTransaction,
      type: 'PURCHASE',
      details: {
        paymentIntentId: 'pi_123456789'
      }
    };

    render(<TransactionCard transaction={purchaseTransaction} />);
    
    const detailsButton = screen.getByText('Show Details');
    
    await act(async () => {
      fireEvent.click(detailsButton);
    });

    // Wait for the popover to appear
    await screen.findByText('Transaction Details');
    
    expect(screen.getByText(/Stripe Payment Intent ID: pi_123456789/)).toBeInTheDocument();
  });

  it('handles initial balance transaction type', async () => {
    const initialBalanceTransaction = {
      ...mockTransaction,
      type: 'INITIAL BALANCE',
      details: {}
    };

    render(<TransactionCard transaction={initialBalanceTransaction} />);
    
    const detailsButton = screen.getByText('Show Details');
    
    await act(async () => {
      fireEvent.click(detailsButton);
    });

    // Wait for the popover to appear
    await screen.findByText('Transaction Details');
    
    expect(screen.getByText('Welcome!')).toBeInTheDocument();
  });
}); 