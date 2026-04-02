import type { QualityMeter } from '../../types/route'

interface Props {
  meter: QualityMeter
}

function clampPct(n: number): number {
  return Math.min(100, Math.max(0, n))
}

export function QualityHillDayMeter({ meter }: Props) {
  const pct = clampPct(meter.score)
  const id = 'quality-hill-day-meter-heading'

  return (
    <section className="qhm" aria-labelledby={id}>
      <div className="qhm-inner">
        <h2 id={id} className="qhm-title">
          Quality Hill Day Meter
        </h2>
        <p className="qhm-sub">Not science — mates’ scores. Salt encouraged.</p>

        <div className="qhm-main">
          <div
            className="qhm-score-wrap"
            role="group"
            aria-label={`Overall quality score ${pct} percent`}
          >
            <p className="qhm-score-big">
              {pct}
              <span className="qhm-pct-symbol">%</span>
            </p>
          </div>
          <p className="qhm-headline">{meter.headline}</p>
          <p className="qhm-verdict">{meter.verdict}</p>

          <div className="qhm-track-wrap">
            <div className="qhm-track-labels">
              <span className="qhm-track-low">{meter.lowLabel}</span>
              <span className="qhm-track-high">{meter.highLabel}</span>
            </div>
            <div
              className="qhm-track"
              role="img"
              aria-label={`${pct} out of 100 from ${meter.lowLabel} to ${meter.highLabel}`}
            >
              <div className="qhm-track-fill" style={{ width: `${pct}%` }} />
              <div className="qhm-track-tick" style={{ left: `${pct}%` }} aria-hidden />
            </div>
          </div>
        </div>

        {meter.factors.length > 0 ? (
          <div className="qhm-factors">
            <h3 className="qhm-factors-title">What’s helping and what’s not</h3>
            <ul className="qhm-factor-list">
              {meter.factors.map((f, i) => (
                <li
                  key={`${f.label}-${i}`}
                  className={`qhm-factor qhm-factor--${f.impact}`}
                >
                  <span className="qhm-factor-label">{f.label}</span>
                  <p className="qhm-factor-note">{f.note}</p>
                </li>
              ))}
            </ul>
          </div>
        ) : null}

        {meter.subscores?.length ? (
          <div className="qhm-subs">
            <h3 className="qhm-subs-title">Sub-scores</h3>
            <ul className="qhm-subs-list">
              {meter.subscores.map((s, i) => {
                const sp = clampPct(s.score)
                return (
                  <li key={`${s.label}-${i}`} className="qhm-sub-card">
                    <div className="qhm-sub-top">
                      <span className="qhm-sub-label">{s.label}</span>
                      <span className="qhm-sub-num">{sp}%</span>
                    </div>
                    <div className="qhm-sub-track">
                      <div className="qhm-sub-fill" style={{ width: `${sp}%` }} />
                    </div>
                    <p className="qhm-sub-note">{s.note}</p>
                  </li>
                )
              })}
            </ul>
          </div>
        ) : null}
      </div>
    </section>
  )
}
