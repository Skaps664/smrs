import { redirect } from "next/navigation"

export default async function Home() {
  // Redirect to the landing page
  redirect("/landing")
}
