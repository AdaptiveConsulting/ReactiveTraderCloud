import { Subscribe } from "@react-rxjs/core"

import { AdaptiveLoader } from "@/components/AdaptiveLoader"
import { currentUser$, User as UserType, useUser } from "@/services/currentUser"

import { LoadingButton, UserAvatar, UserContainer, UserWrapper } from "./styled"

export const UserInner = ({ user }: { user: UserType }) => (
  <UserWrapper>
    <UserContainer>
      <UserAvatar src={user.avatar} alt={`${user.code}'s avatar`} />
      {user.code}
    </UserContainer>
  </UserWrapper>
)

const User = () => <UserInner user={useUser()} />

const LoginControls = () => (
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
