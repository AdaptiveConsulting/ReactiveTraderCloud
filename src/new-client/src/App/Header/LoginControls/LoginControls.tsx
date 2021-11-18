import { Subscribe } from "@react-rxjs/core"
import { AdaptiveLoader } from "@/components/AdaptiveLoader"
import { currentUser$, useUser } from "@/services/currentUser"
import { User as UserProps } from "@/services/currentUser"
import { LoadingButton, UserWrapper, UserContainer, UserAvatar } from "./styled"

export const User: React.FC<{ user?: UserProps }> = ({ user = useUser() }) => {
  return (
    <UserWrapper>
      <UserContainer>
        <UserAvatar src={user.avatar} alt={`${user.code}'s avatar`} />
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
        <AdaptiveLoader
          ariaLabel="Loading user information"
          size={18}
          color={"white"}
        />
      </LoadingButton>
    }
  >
    <User />
  </Subscribe>
)

export default LoginControls
