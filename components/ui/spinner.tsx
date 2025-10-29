import * as React from "react"

type SpinnerProps = React.SVGProps<SVGSVGElement>

export function Spinner(props: SpinnerProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      className={"animate-spin text-current " + (props.className ?? "")}
      width={props.width ?? 16}
      height={props.height ?? 16}
      {...props}
    >
      <circle
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
        fill="none"
        opacity="0.25"
      />
      <path
        d="M22 12a10 10 0 0 1-10 10"
        stroke="currentColor"
        strokeWidth="4"
        strokeLinecap="round"
        fill="none"
      />
    </svg>
  )
}

export default Spinner


