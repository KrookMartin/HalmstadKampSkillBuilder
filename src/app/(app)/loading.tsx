// Shown instantly when navigating between pages while the page's data
// (session, today's date, DB queries) loads. Without it the old page stays
// on screen until everything is fetched, which feels unresponsive on a phone.
// Shapes roughly match a page header + list so the layout doesn't jump.
export default function Loading() {
  return (
    <div aria-busy="true" aria-label="Laddar" className="animate-pulse space-y-8">
      <div className="space-y-3">
        <div className="h-3 w-32 rounded bg-surface-2" />
        <div className="h-12 w-3/4 rounded bg-surface-2" />
      </div>
      <div className="space-y-3">
        {[0, 1, 2].map((i) => (
          <div key={i} className="h-16 rounded-card bg-surface" />
        ))}
      </div>
    </div>
  );
}
