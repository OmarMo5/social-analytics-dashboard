export default function Loader() {
  return (
    <div style={{ display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', height:'100%', gap:20 }}>
      <div style={{ position:'relative', width:56, height:56 }}>
        <div style={{ position:'absolute', inset:0, borderRadius:'50%', border:'2px solid var(--border)' }} />
        <div style={{ position:'absolute', inset:0, borderRadius:'50%', border:'2px solid transparent', borderTopColor:'var(--gold)', animation:'spin 1s linear infinite' }} />
        <div style={{ position:'absolute', inset:10, borderRadius:'50%', border:'2px solid transparent', borderTopColor:'var(--accent)', animation:'spin 1.3s linear infinite reverse' }} />
      </div>
      <div style={{ textAlign:'center' }}>
        <p style={{ fontSize:14, fontWeight:700, color:'var(--text-1)' }}>جاري جلب البيانات...</p>
        <p style={{ fontSize:12, marginTop:6, color:'var(--text-3)' }}>الاتصال بـ Google Sheets</p>
      </div>
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </div>
  );
}
