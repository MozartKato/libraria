import { BorrowWithBook } from '@/types';
import { useLanguage } from '@/hooks/useLanguage';
import commonId from '@/locales/id/common.json';
import commonEn from '@/locales/en/common.json';

const translations = {
  id: commonId,
  en: commonEn,
};

interface BorrowHistoryTableProps {
  borrows: BorrowWithBook[];
}

export const BorrowHistoryTable = ({ borrows }: BorrowHistoryTableProps) => {
  const { currentLocale } = useLanguage();
  const t = translations[currentLocale].dashboard;

  if (borrows.length === 0) {
    return <p className="text-center text-gray-500">{t.borrowHistory.empty}</p>;
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              {t.borrowHistory.table.book}
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              {t.borrowHistory.table.borrowDate}
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              {t.borrowHistory.table.dueDate}
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              {t.borrowHistory.table.status}
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              {t.borrowHistory.table.returnedAt}
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              {t.borrowHistory.table.fine}
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {borrows.map((borrow) => (
            <tr key={borrow.id}>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {borrow.book?.title || t.borrowHistory.table.bookNotFound}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {new Date(borrow.borrowedAt).toLocaleDateString()}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {new Date(borrow.dueDate).toLocaleDateString()}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                  borrow.status === 'returned' 
                    ? 'bg-green-100 text-green-800'
                    : borrow.status === 'overdue'
                    ? 'bg-red-100 text-red-800'
                    : 'bg-blue-100 text-blue-800'
                }`}>
                  {t.borrowHistory.status[borrow.status]}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {borrow.returnedAt ? new Date(borrow.returnedAt).toLocaleDateString() : '-'}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {borrow.fine > 0 ? `Rp ${borrow.fine.toLocaleString()}` : '-'}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}; 