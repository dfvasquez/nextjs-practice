export default async function getUserPosts(userId: string) {
  const res = await fetch(
    `https://jsonplaceholder.typicode.com/posts?userId=${userId}`,
    { next: { revalidate: 60 } } // default is cache: force-cache that doesnt request again but if theres too much variable data you should use and no-store
  ) // it will request after the 60 secs if you change of page
  // you can use revalidate in every page if you need it, you just need to export a const like export const revalidate = 60; and you will have it done
  if (!res.ok) return undefined
  return res.json()
}
