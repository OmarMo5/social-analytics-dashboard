import { Inbox } from 'lucide-react';

export default function EmptyState({ message = 'لا توجد بيانات متاحة حاليًا' }) {
  return (
    <div className="flex flex-col items-center justify-center h-64 gap-4 animate-fade-in">
      <div className="w-16 h-16 rounded-2xl bg-bg-700 border border-bg-600 flex items-center justify-center">
        <Inbox size={28} className="text-[#4d7a56]" />
      </div>
      <p className="text-sm text-[#4d7a56]">{message}</p>
    </div>
  );
}
