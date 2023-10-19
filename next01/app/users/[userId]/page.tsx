import { Suspense } from 'react'
import type { Metadata } from 'next'
import getUser from '@/lib/getUser'
import getUserPosts from '@/lib/getUserPosts'
import getAllUsers from '@/lib/getAllUsers'
import UserPosts from './components/UserPosts'
import { notFound } from 'next/navigation' // to handle dynamic pages not found (?)

type Params = {
  params: {
    userId: string
  }
}

export async function generateMetadata({
  params: { userId }
}: Params): Promise<Metadata> {
  const userData: Promise<User> = getUser(userId)
  const user: User = await userData

  if (!user?.name) {
    return {
      title: 'User Not Found'
    }
  }

  return {
    title: user.name,
    description: `This is the page of ${user.name}`
  }
}

export default async function UserPage({ params: { userId } }: Params) {
  const userData: Promise<User> = getUser(userId)
  const userPostsData: Promise<Post[]> = getUserPosts(userId)
  // Resolve in parallel
  // const [user, userPosts] = await Promise.all([userData, userPostsData])

  const user = await userData

  if (!user?.name) return notFound()

  return (
    <>
      <h2>{user.name}</h2>
      <br />
      <Suspense fallback={<h2>Loading...</h2>}>
        <UserPosts promise={userPostsData} />
      </Suspense>
    </>
  )
}
// next will know how the parameters will be soo it will be SSG instead of SSR
export async function generateStaticParams() {
  const usersData: Promise<User[]> = getAllUsers()
  const users = await usersData

  return users.map((user) => {
    return { userId: user.id.toString() }
  })
}
