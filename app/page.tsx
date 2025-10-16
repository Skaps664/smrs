import { redirect } from "next/navigation"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import Link from "next/link"

export default async function Home() {
  const session = await getServerSession(authOptions)

  if (session) {
    redirect("/dashboard")
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Hero Section */}
        <div className="text-center">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
            Startup Management &<br />
            <span className="text-blue-600">Reporting System</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Track your startup journey from ideation to scale. Generate professional reports, 
            monitor KPIs, and stay aligned with your incubation center's requirements.
          </p>
          <div className="flex gap-4 justify-center">
            <Link
              href="/register"
              className="bg-blue-600 text-white px-8 py-3 rounded-lg text-lg font-semibold hover:bg-blue-700 transition-colors"
            >
              Get Started Free
            </Link>
            <Link
              href="/login"
              className="bg-white text-blue-600 px-8 py-3 rounded-lg text-lg font-semibold border-2 border-blue-600 hover:bg-blue-50 transition-colors"
            >
              Sign In
            </Link>
          </div>
        </div>

        {/* Features Section */}
        <div className="mt-24 grid md:grid-cols-3 gap-8">
          <div className="bg-white p-8 rounded-xl shadow-lg">
            <div className="text-blue-600 text-4xl mb-4">📊</div>
            <h3 className="text-xl font-bold mb-3">Track Progress</h3>
            <p className="text-gray-600">
              Log weekly and monthly activities, milestones, and challenges in one place.
            </p>
          </div>

          <div className="bg-white p-8 rounded-xl shadow-lg">
            <div className="text-blue-600 text-4xl mb-4">📈</div>
            <h3 className="text-xl font-bold mb-3">Monitor KPIs</h3>
            <p className="text-gray-600">
              Visualize marketing, sales, product, and operational metrics with interactive charts.
            </p>
          </div>

          <div className="bg-white p-8 rounded-xl shadow-lg">
            <div className="text-blue-600 text-4xl mb-4">📄</div>
            <h3 className="text-xl font-bold mb-3">Generate Reports</h3>
            <p className="text-gray-600">
              Auto-generate professional PDF reports for your incubation center with one click.
            </p>
          </div>
        </div>

        {/* Stages Section */}
        <div className="mt-24">
          <h2 className="text-3xl font-bold text-center mb-12">Track Every Stage</h2>
          <div className="flex flex-wrap justify-center gap-4">
            {['Ideation', 'Prototype', 'Validation', 'Incubation', 'Acceleration', 'Growth', 'Scale'].map((stage) => (
              <div key={stage} className="bg-white px-6 py-3 rounded-full shadow-md">
                <span className="font-semibold text-gray-800">{stage}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
