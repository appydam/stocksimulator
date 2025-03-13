
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { formatPercentage, getColorForChange } from '@/lib/utils';
import { Trophy, ArrowUp, ArrowDown, Minus } from 'lucide-react';

// Dummy data for leaderboard
const mockLeaderboardData = [
  { userId: '1', name: 'Rahul Sharma', returnPercent: 15.72, rank: 1 },
  { userId: '2', name: 'Priya Singh', returnPercent: 12.38, rank: 2 },
  { userId: '3', name: 'Amit Patel', returnPercent: 8.64, rank: 3 },
  { userId: '4', name: 'Neha Gupta', returnPercent: 5.29, rank: 4 },
  { userId: '5', name: 'Vikram Reddy', returnPercent: 4.17, rank: 5 },
  { userId: '6', name: 'Sneha Kumar', returnPercent: 3.52, rank: 6 },
  { userId: '7', name: 'Raj Malhotra', returnPercent: 2.18, rank: 7 },
  { userId: '8', name: 'Kavita Joshi', returnPercent: 1.45, rank: 8 },
  { userId: '9', name: 'Deepak Verma', returnPercent: -1.32, rank: 9 },
  { userId: '10', name: 'Meera Rao', returnPercent: -2.76, rank: 10 },
];

export function Leaderboard() {
  // Get a random user to highlight as 'you'
  const currentUserRank = Math.floor(Math.random() * 10) + 1;
  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Trophy className="h-5 w-5 mr-2 text-yellow-500" />
          Top Traders
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="relative overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs uppercase bg-muted/50">
              <tr>
                <th scope="col" className="px-4 py-3 w-16">Rank</th>
                <th scope="col" className="px-4 py-3">Trader</th>
                <th scope="col" className="px-4 py-3 text-right">Return</th>
              </tr>
            </thead>
            <tbody>
              {mockLeaderboardData.map((user) => (
                <tr 
                  key={user.userId} 
                  className={`border-b hover:bg-muted/50 ${user.rank === currentUserRank ? 'bg-primary/10' : ''}`}
                >
                  <td className="px-4 py-3">
                    {user.rank <= 3 ? (
                      <span className={`text-sm font-bold
                        ${user.rank === 1 ? 'text-yellow-500' : 
                          user.rank === 2 ? 'text-gray-400' : 
                          'text-amber-700'}`
                      }>
                        #{user.rank}
                      </span>
                    ) : (
                      <span className="text-sm">#{user.rank}</span>
                    )}
                  </td>
                  <td className="px-4 py-3 font-medium">
                    {user.name} {user.rank === currentUserRank && <span className="text-xs text-muted-foreground ml-1">(You)</span>}
                  </td>
                  <td className={`px-4 py-3 text-right font-medium ${getColorForChange(user.returnPercent)}`}>
                    <span className="flex items-center justify-end">
                      {user.returnPercent > 0 ? (
                        <ArrowUp className="h-3 w-3 mr-1" />
                      ) : user.returnPercent < 0 ? (
                        <ArrowDown className="h-3 w-3 mr-1" />
                      ) : (
                        <Minus className="h-3 w-3 mr-1" />
                      )}
                      {formatPercentage(user.returnPercent)}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}
