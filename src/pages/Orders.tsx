
import React from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { Card, CardContent } from '@/components/ui/card';
import { useAppSelector, useAppDispatch } from '@/store/hooks';
import { cancelOrder } from '@/store/tradingSlice';
import { formatCurrency } from '@/lib/utils';
import { Button } from '@/components/ui/button';

export default function OrdersPage() {
  const { orders, stockData } = useAppSelector(state => state.trading);
  const dispatch = useAppDispatch();

  const formatDateTime = (date: Date) => {
    return new Date(date).toLocaleString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  };

  return (
    <AppLayout>
      <div className="space-y-4">
        <h1 className="text-2xl font-bold">Order History</h1>
        
        {orders.length === 0 ? (
          <Card>
            <CardContent className="py-10">
              <div className="text-center">
                <p className="text-muted-foreground">You haven't placed any orders yet</p>
                <p className="text-sm text-muted-foreground mt-1">
                  Start trading to see your order history
                </p>
              </div>
            </CardContent>
          </Card>
        ) : (
          <Card>
            <CardContent className="p-0">
              <div className="relative w-full overflow-auto">
                <table className="w-full caption-bottom text-sm">
                  <thead className="[&_tr]:border-b">
                    <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                      <th className="h-12 px-4 text-left align-middle font-medium">Date & Time</th>
                      <th className="h-12 px-4 text-left align-middle font-medium">Stock</th>
                      <th className="h-12 px-4 text-center align-middle font-medium">Type</th>
                      <th className="h-12 px-4 text-right align-middle font-medium">Quantity</th>
                      <th className="h-12 px-4 text-right align-middle font-medium">Price</th>
                      <th className="h-12 px-4 text-right align-middle font-medium">Total Value</th>
                      <th className="h-12 px-4 text-center align-middle font-medium">Status</th>
                      <th className="h-12 px-4 text-center align-middle font-medium">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="[&_tr:last-child]:border-0">
                    {orders.map((order) => {
                      const stock = stockData.find(s => s.id === order.stockId);
                      return (
                        <tr key={order.id} className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                          <td className="p-4 align-middle">
                            {formatDateTime(order.createdAt)}
                          </td>
                          <td className="p-4 align-middle">
                            <div>
                              <div className="font-medium">{stock?.symbol}</div>
                              <div className="text-xs text-muted-foreground">{stock?.exchange}</div>
                            </div>
                          </td>
                          <td className="p-4 align-middle text-center">
                            <span className={`px-2 py-1 rounded-full text-xs ${
                              order.type === 'BUY' 
                                ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100' 
                                : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100'
                            }`}>
                              {order.type}
                            </span>
                          </td>
                          <td className="p-4 align-middle text-right">{order.quantity}</td>
                          <td className="p-4 align-middle text-right">
                            {formatCurrency(order.executedPrice || (order.limitPrice || 0))}
                          </td>
                          <td className="p-4 align-middle text-right">
                            {formatCurrency((order.executedPrice || (order.limitPrice || 0)) * order.quantity)}
                          </td>
                          <td className="p-4 align-middle text-center">
                            <span className={`px-2 py-1 rounded-full text-xs ${
                              order.status === 'EXECUTED' 
                                ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100' 
                                : order.status === 'PENDING'
                                  ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100'
                                  : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100'
                            }`}>
                              {order.status}
                            </span>
                          </td>
                          <td className="p-4 align-middle text-center">
                            {order.status === 'PENDING' && (
                              <Button 
                                variant="destructive" 
                                size="sm"
                                onClick={() => dispatch(cancelOrder(order.id))}
                              >
                                Cancel
                              </Button>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </AppLayout>
  );
}
