import { ArrowDownToLine, ArrowUpFromLine } from 'lucide-react';
import type { LogisticsTransaction } from '../../../types/dashboard';
import { Tag } from '../../../components/common/Tag';
import { formatRelativeTime } from '../../../utils/format';

interface RecentLogisticsProps {
  transactions: LogisticsTransaction[];
}

export function RecentLogistics({ transactions }: RecentLogisticsProps) {
  return (
    <div className="glass-card p-5 animate-slide-up" style={{ animationDelay: '400ms' }}>
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-sm font-semibold text-white">Recent Logistics</h3>
          <p className="text-xs text-slate-500 mt-0.5">Latest warehouse transactions</p>
        </div>
        <button className="text-xs text-indigo-400 hover:text-indigo-300 transition-colors font-medium">
          View All →
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-slate-700/50">
              <th className="pb-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Transaction</th>
              <th className="pb-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Type</th>
              <th className="pb-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Supplier</th>
              <th className="pb-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Items</th>
              <th className="pb-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Status</th>
              <th className="pb-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Time</th>
              <th className="pb-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Handler</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map(trx => (
              <tr
                key={trx.id}
                className="border-b border-slate-800/50 hover:bg-slate-800/40 transition-colors cursor-pointer"
              >
                <td className="py-3 pr-4">
                  <span className="font-mono text-xs font-semibold text-indigo-400">{trx.trxCode}</span>
                </td>
                <td className="py-3 pr-4">
                  <span className={`flex items-center gap-1.5 text-xs ${trx.type === 'inbound' ? 'text-emerald-400' : 'text-amber-400'}`}>
                    {trx.type === 'inbound' ? <ArrowDownToLine size={12} /> : <ArrowUpFromLine size={12} />}
                    {trx.type === 'inbound' ? 'IN' : 'OUT'}
                  </span>
                </td>
                <td className="py-3 pr-4 text-slate-300 text-xs">{trx.supplier}</td>
                <td className="py-3 pr-4 text-slate-300 text-xs font-medium">{trx.itemCount}</td>
                <td className="py-3 pr-4">
                  <Tag status={trx.status} />
                </td>
                <td className="py-3 pr-4 text-slate-500 text-xs">{formatRelativeTime(trx.timestamp)}</td>
                <td className="py-3 text-slate-400 text-xs">{trx.handler}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
