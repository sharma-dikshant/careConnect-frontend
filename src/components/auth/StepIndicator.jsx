/**
 * StepIndicator – shows numbered step bubbles with labels.
 *
 * Props:
 *   steps   : string[]   – label for each step
 *   current : number     – 0-indexed current step
 */
export function StepIndicator({ steps, current }) {
  return (
    <div className="flex items-center w-full mb-6">
      {steps.map((label, index) => {
        const isCompleted = index < current
        const isActive = index === current

        return (
          <div key={index} className="flex-1 flex items-center">
            {/* Step bubble + label */}
            <div className="flex flex-col items-center gap-1 relative">
              <div
                className={`
                  w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold
                  transition-all duration-300
                  ${isCompleted
                    ? 'bg-primary text-white'
                    : isActive
                    ? 'bg-primary text-white ring-4 ring-primary/20'
                    : 'bg-muted text-muted-foreground'
                  }
                `}
              >
                {isCompleted ? (
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                ) : (
                  index + 1
                )}
              </div>
              <span
                className={`text-[10px] font-medium whitespace-nowrap ${
                  isActive ? 'text-primary' : isCompleted ? 'text-primary/70' : 'text-muted-foreground'
                }`}
              >
                {label}
              </span>
            </div>

            {/* Connecting line (not after last step) */}
            {index < steps.length - 1 && (
              <div
                className={`
                  flex-1 h-0.5 mx-2 mb-4 rounded-full transition-all duration-300
                  ${index < current ? 'bg-primary' : 'bg-border'}
                `}
              />
            )}
          </div>
        )
      })}
    </div>
  )
}
