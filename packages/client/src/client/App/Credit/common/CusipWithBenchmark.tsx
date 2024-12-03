import { memo } from "react"

import { Typography } from "@/client/components/Typography"

interface CusipWithBenchmarkProps {
  cusip?: string
  benchmark?: string
}

export const CusipWithBenchmark = memo(function CusipWithBenchmark({
  cusip,
  benchmark,
}: CusipWithBenchmarkProps) {
  return (
    <Typography
      variant="Text sm/Regular"
      color="Colors/Text/text-tertiary (600)"
    >
      {cusip ?? "No cusip found"} &#160;&#x2022;&#160;{" "}
      {benchmark ?? "No benchmark available"}
    </Typography>
  )
})
