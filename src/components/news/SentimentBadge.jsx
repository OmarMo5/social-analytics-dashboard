export default function SentimentBadge({ value }) {
  if (!value) return <span className="badge badge-und">غير محدد</span>;
  if (value === 'إيجابي') return <span className="badge badge-pos">↑ إيجابي</span>;
  if (value === 'سلبي')   return <span className="badge badge-neg">↓ سلبي</span>;
  if (value === 'محايد')  return <span className="badge badge-neu">— محايد</span>;
  return <span className="badge badge-und">{value}</span>;
}
