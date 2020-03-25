import React from 'react'
import { Flex, Modal } from 'rt-components'
import { User as UserType } from 'rt-types'
import { fakeUsers } from './fakeUsers'
import {
  Header,
  SubHeader,
  UserList,
  User,
  Avatar,
  UserRole,
  SignInButton,
  CancelButton,
  UserName,
} from './styled'

interface props {
  shouldShow: boolean
  closeModal: () => void
  selectUser: (user: UserType) => void
}

export const UsersModal: React.FC<props> = ({ shouldShow, closeModal, selectUser }) => (
  <Modal shouldShow={shouldShow}>
    <Flex direction="column" justifyContent="center" alignItems="center">
      <Header>Select an account</Header>
      <SubHeader>You can sign in to any of the following trading accounts. </SubHeader>
      <UserList>
        {fakeUsers.map(user => (
          <User>
            <Avatar src={require(`./fakeAvatars/${user.avatar}`)} />
            <div>
              <UserName>
                {user.firstName} {user.lastName}
              </UserName>
              <UserRole>Account type written here</UserRole>
            </div>
            <SignInButton onClick={() => selectUser(user)}>Sign In</SignInButton>
          </User>
        ))}
      </UserList>
      <CancelButton onClick={closeModal}>Cancel</CancelButton>
    </Flex>
  </Modal>
)

export default UsersModal
