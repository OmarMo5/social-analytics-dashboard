import { useSelector } from 'react-redux';
import {
  selectFilteredArticles, selectStatus, selectError, selectAllArticles
} from '../store/slices/newsSlice';
import Filters    from '../components/filters/Filters';
import NewsCard   from '../components/news/NewsCard';
import Loader     from '../components/common/Loader';
import ErrorState from '../components/common/ErrorState';
import EmptyState from '../components/common/EmptyState';

export default function NewsPage() {
  const status   = useSelector(selectStatus);
  const error    = useSelector(selectError);
  const all      = useSelector(selectAllArticles);
  const filtered = useSelector(selectFilteredArticles);

  if (status === 'loading' && !all.length) return <Loader />;
  if (status === 'failed')  return <ErrorState message={error} />;

  return (
    <div className="flex flex-col gap-4">
      {/* Header */}
      <div className="fade-up">
        <h1 className="page-title">آخر الأخبار والتغطيات</h1>
        <p className="text-[11px] mt-1" style={{ color: 'var(--text-3)' }}>
          تجميع تلقائي لكل ما يُنشر عن المتحف في المواقع والصحف الإلكترونية
        </p>
      </div>

      {/* Filters */}
      <Filters count={filtered.length} />

      {/* Grid */}
      {filtered.length === 0
        ? <EmptyState message="لا توجد أخبار تطابق التصفية المحددة" />
        : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filtered.map((article, idx) => (
              <NewsCard key={article.id} article={article} idx={idx} />
            ))}
          </div>
        )
      }
    </div>
  );
}
