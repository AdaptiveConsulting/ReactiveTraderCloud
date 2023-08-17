import { ROUTES_CONFIG } from "client/constants"
import { FEATURE_FLAG, useFeature } from "client/utils/featureFlag"
import { constructUrl } from "client/utils/url"
import { openWindow } from "client/utils/window/openWindow"

export const AdminButton = () => {
  const canUseAdmin = useFeature(FEATURE_FLAG.ADMIN)

  const onClick = () =>
    openWindow({
      url: `${constructUrl(ROUTES_CONFIG.admin)}?${FEATURE_FLAG.ADMIN}`,
      name: "Reactive Trader Admin",
      width: 320,
      height: 400,
    })

  return canUseAdmin ? (
    <div>
      <button onClick={onClick} className="fas fa-cog" title="Open Admin" />
    </div>
  ) : null
}
