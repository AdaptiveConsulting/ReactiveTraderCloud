import { Subscribe } from "@react-rxjs/core"
import { AdaptiveLoader } from "@/components/AdaptiveLoader"
import { currentUser$, useUser, User as UserType } from "@/services/currentUser"
import { LoadingButton, UserWrapper, UserContainer, UserAvatar } from "./styled"

export const UserInner: React.FC<{ user: UserType }> = ({ user }) => (
  <UserWrapper>
    <UserContainer>
      <UserAvatar src={user.avatar} alt={`${user.code}'s avatar`} />
      {user.code}
    </UserContainer>
  </UserWrapper>
)

const User: React.FC = () => <UserInner user={useUser()} />

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
