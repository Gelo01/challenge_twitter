import { AuthChecker } from 'type-graphql'
import { MyContext } from '../types/types'
import { extractJwtToken } from '../utils/utils'
import jwt from 'jsonwebtoken'
import { JWT_SECRET } from '../config/config'
import { AuthenticationError } from 'apollo-server'

export const authChecker: AuthChecker<MyContext, string> = async ({
  root,
  args,
  context,
  info,
}) => {
  const { db, req } = <MyContext>context

  try {
    const token = extractJwtToken(req)
    const {
      data: { id },
    }: any = jwt.verify(token, JWT_SECRET as string)

    const [user] = await db('users').where('id', id)

    if (!user) throw new AuthenticationError('User not found')

    context.userId = user.id
    return true
  } catch (e) {
    throw e
  }
}