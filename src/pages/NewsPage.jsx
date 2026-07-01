import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import {
  selectFilteredArticles, selectStatus, selectError, selectAllArticles, selectFilters
} from '../store/slices/newsSlice';
import Filters    from '../components/filters/Filters';
import NewsCard   from '../components/news/NewsCard';
import Loader     from '../components/common/Loader';
import ErrorState from '../components/common/ErrorState';
import EmptyState from '../components/common/EmptyState';

const PAGE_SIZE = 12;

export default function NewsPage() {
  const status   = useSelector(selectStatus);
  const error    = useSelector(selectError);
  const all      = useSelector(selectAllArticles);
  const filtered = useSelector(selectFilteredArticles);
  const filters  = useSelector(selectFilters);

  const [page, setPage] = useState(1);

  useEffect(() => {
    setPage(1);
  }, [filters]);

  if (status === 'loading' && !all.length) return <Loader />;
  if (status === 'failed')  return <ErrorState message={error} />;

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const pagedArticles = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

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
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {pagedArticles.map((article, idx) => (
                <NewsCard key={article.id} article={article} idx={idx} />
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, marginTop: 8 }}>
                <button
                  onClick={() => setPage(p => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="btn-outline"
                  style={{ display: 'flex', alignItems: 'center', gap: 4, padding: '7px 14px', opacity: page === 1 ? 0.5 : 1, cursor: page === 1 ? 'not-allowed' : 'pointer' }}
                >
                  <ChevronRight size={14} />
                  <span style={{ fontSize: 12 }}>السابق</span>
                </button>

                <div style={{ display: 'flex', gap: 6 }}>
                  {Array.from({ length: totalPages }, (_, i) => i + 1)
                    .filter(p => p === 1 || p === totalPages || Math.abs(p - page) <= 1)
                    .reduce((acc, p, idx, arr) => {
                      if (idx > 0 && p - arr[idx - 1] > 1) acc.push('…');
                      acc.push(p);
                      return acc;
                    }, [])
                    .map((p, i) => p === '…' ? (
                      <span key={`e${i}`} style={{ padding: '6px 4px', color: 'var(--text-3)', fontSize: 12 }}>…</span>
                    ) : (
                      <button
                        key={p}
                        onClick={() => setPage(p)}
                        style={{
                          width: 34, height: 34, borderRadius: 8, fontSize: 12, fontWeight: p === page ? 800 : 500,
                          border: p === page ? '1px solid var(--gold)' : '1px solid var(--border)',
                          background: p === page ? 'color-mix(in srgb, var(--gold) 15%, transparent)' : 'transparent',
                          color: p === page ? 'var(--gold)' : 'var(--text-2)',
                          cursor: 'pointer', transition: 'all .15s'
                        }}
                      >
                        {p}
                      </button>
                    ))}
                </div>

                <button
                  onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                  className="btn-outline"
                  style={{ display: 'flex', alignItems: 'center', gap: 4, padding: '7px 14px', opacity: page === totalPages ? 0.5 : 1, cursor: page === totalPages ? 'not-allowed' : 'pointer' }}
                >
                  <span style={{ fontSize: 12 }}>التالي</span>
                  <ChevronLeft size={14} />
                </button>
              </div>
            )}
          </>
        )
      }
    </div>
  );
}
