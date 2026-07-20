// Briques d'affichage partagées par tous les rapports (rendu HTML fiable dans la modale).

export function ReportHeader({ title, subtitle, meta }) {
  return (
    <header className="mb-6 pb-4 border-b border-divider">
      <h2 className="font-display font-bold text-2xl text-zinc-100 mb-2">{title}</h2>
      {subtitle && <p className="text-sm text-zinc-400">{subtitle}</p>}
      {meta && <p className="text-xs text-zinc-500 mt-1">{meta}</p>}
    </header>
  )
}

export function H2({ children }) {
  return (
    <h3 className="font-display font-bold text-xl text-accent uppercase tracking-wide mt-8 mb-3 first:mt-0">
      {children}
    </h3>
  )
}

export function H3({ children }) {
  return <h4 className="font-display font-semibold text-base text-zinc-100 mt-5 mb-2">{children}</h4>
}

export function Cmd({ term, children }) {
  return (
    <div className="my-3">
      {term && <p className="text-xs font-semibold text-accent mb-1">Terminal : {term}</p>}
      <pre className="bg-bg border border-divider rounded-md p-3 overflow-x-auto">
        <code className="font-mono text-xs text-zinc-200 leading-relaxed whitespace-pre">{children}</code>
      </pre>
    </div>
  )
}

export function Table({ head, rows }) {
  return (
    <div className="overflow-x-auto my-3">
      <table className="w-full text-left border-collapse text-sm">
        <thead>
          <tr>
            {head.map((h, i) => (
              <th key={i} className="border-b-2 border-accent/50 py-2 pr-4 text-xs uppercase tracking-wide text-accent font-semibold">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((r, i) => (
            <tr key={i} className="border-b border-divider">
              {r.map((c, j) => (
                <td key={j} className="py-2 pr-4 text-zinc-300 align-top leading-relaxed">{c}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export function Lead({ children }) {
  return <p className="leading-relaxed">{children}</p>
}
