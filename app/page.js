import Link from 'next/link';

export default function Home() {
  return (
    <main className="screen">
      <div className="blob blob-1" />
      <div className="blob blob-2" />
      <div className="blob blob-3" />
      <div className="content" style={{ marginTop: '8vh' }}>
        <span className="eyebrow">Kurz Lean Canvas</span>
        <h1 className="title">
          Ověřte si to <span className="accent">naživo</span>
        </h1>
        <p className="subtitle">
          Kvíz o zákaznících, problémech, řešeních a byznys modelu. Lektor spustí hru na
          velké obrazovce, ostatní se připojí telefonem.
        </p>

        <div className="role-grid">
          <Link href="/host" className="role-card">
            <span className="role-emoji">📺</span>
            <span className="role-title">Jsem lektor</span>
            <span className="role-desc">Spustím hru a promítám otázky</span>
          </Link>
          <Link href="/play" className="role-card">
            <span className="role-emoji">📱</span>
            <span className="role-title">Připojit se jako hráč</span>
            <span className="role-desc">Odpovídám ze svého telefonu</span>
          </Link>
        </div>
      </div>
    </main>
  );
}
