import { AlertTriangle } from 'lucide-react';
import { useDispatch } from 'react-redux';
import { loadArticles } from '../../store/slices/newsSlice';

export default function ErrorState({ message }) {
  const dispatch = useDispatch();
  return (
    <div style={{ display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', height:'100%', gap:20 }}>
      <div style={{ width:64, height:64, borderRadius:20, display:'flex', alignItems:'center', justifyContent:'center', background:'var(--neg-bg)', border:'1px solid var(--neg-border)' }}>
        <AlertTriangle size={28} style={{ color:'var(--neg)' }} />
      </div>
      <div style={{ textAlign:'center', maxWidth:380 }}>
        <p style={{ fontSize:15, fontWeight:700, color:'var(--text-1)' }}>حدث خطأ أثناء تحميل البيانات</p>
        <p style={{ fontSize:12, marginTop:8, color:'var(--text-2)' }}>{message}</p>
        <p style={{ fontSize:11, marginTop:8, color:'var(--text-3)' }}>
          تأكد من صحة البيانات في&nbsp;
          <code style={{ padding:'2px 7px', borderRadius:5, background:'var(--bg-input)', color:'var(--gold)', fontSize:11 }}>
            src/config/config.js
          </code>
        </p>
      </div>
      <button onClick={()=>dispatch(loadArticles())}
        className="btn-outline"
        style={{ padding:'9px 22px', fontSize:13 }}>
        إعادة المحاولة
      </button>
    </div>
  );
}
