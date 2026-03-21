import type { RouteOption, WaypointJson } from '../../types/route'
import { OptionWaypointBlock } from '../OptionWaypointBlock'

interface Props {
  options: RouteOption[]
  optionWaypoints: Record<string, WaypointJson[]>
}

export function RouteOptionsPlanning({ options, optionWaypoints }: Props) {
  if (!options.length) return null

  return (
    <section className="planning-options-rich" aria-labelledby="rich-options-heading">
      <h2 id="rich-options-heading" className="visually-hidden">
        Route options in detail
      </h2>
      <div className="planning-options-grid">
        {options.map((opt) => (
          <article
            key={opt.id}
            className={`planning-option-rich ${opt.id === 'option-a' ? 'is-primary' : ''}`}
          >
            <header className="planning-option-rich-head">
              {opt.tag ? <span className="planning-option-rich-tag">{opt.tag}</span> : null}
              <h3 className="planning-option-rich-title">{opt.name}</h3>
            </header>
            {opt.reason ? <p className="planning-option-rich-lead">{opt.reason}</p> : null}
            {opt.lineDescription ? (
              <>
                <h4 className="planning-option-rich-sub">Suggested line</h4>
                <p className="planning-option-rich-narrative">{opt.lineDescription}</p>
              </>
            ) : opt.suggestedLine?.length ? (
              <>
                <h4 className="planning-option-rich-sub">Suggested line</h4>
                <ol className="planning-option-rich-ol">
                  {opt.suggestedLine.map((step, i) => (
                    <li key={i}>{step}</li>
                  ))}
                </ol>
              </>
            ) : null}
            {opt.whyPick ? (
              <>
                <h4 className="planning-option-rich-sub">Why pick this one</h4>
                <p className="planning-option-rich-prose">{opt.whyPick}</p>
              </>
            ) : null}
            {opt.tradeoff ? (
              <>
                <h4 className="planning-option-rich-sub planning-option-rich-sub--trade">
                  Tradeoff
                </h4>
                <p className="planning-option-rich-prose">{opt.tradeoff}</p>
              </>
            ) : null}
            {opt.explanation && !opt.whyPick ? (
              <p className="planning-option-rich-prose">{opt.explanation}</p>
            ) : null}
            <OptionWaypointBlock
              waypoints={optionWaypoints[opt.id] ?? []}
              waypointFile={opt.waypointFile}
            />
          </article>
        ))}
      </div>
    </section>
  )
}
