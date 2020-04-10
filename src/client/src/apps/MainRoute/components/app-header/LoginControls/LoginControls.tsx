import React from 'react'
import { User } from 'rt-types'
import { AdaptiveLoader } from 'rt-components'
import { LoadingButton, UserWrapper, UserContainer, UserAvatar } from './styled'

interface Props {
  user?: User
}

const LoginControls = ({ user }: Props) => (
  <React.Fragment>
    {!user ? (
      <LoadingButton>
        <AdaptiveLoader size={18} color={'white'} />
      </LoadingButton>
    ) : (
      <UserWrapper>
        <UserContainer>
          <UserAvatar src={user.avatar} />
          {user.code}
        </UserContainer>
      </UserWrapper>
    )}
  </React.Fragment>
)

export default LoginControls
