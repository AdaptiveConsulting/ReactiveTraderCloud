import { Subscribe } from "@react-rxjs/core"
import { AdaptiveLoader } from "components/AdaptiveLoader"
import { currentUser$, useUser } from "services/currentUser"
import { LoadingButton, UserWrapper, UserContainer, UserAvatar } from "./styled"

const User: React.FC = () => {
  const user = useUser()
  return (
    <UserWrapper>
      <UserContainer>
        <UserAvatar src={user.avatar} />
        {user.code}
      </UserContainer>
    </UserWrapper>
  )
}

const LoginControls: React.FC = () => (
  <Subscribe
    source$={currentUser$}
    fallback={
      <LoadingButton>
        <AdaptiveLoader size={18} color={"white"} />
      </LoadingButton>
    }
  >
    <User />
  </Subscribe>
)

export default LoginControls
