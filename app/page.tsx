import { redirect } from "next/navigation"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import Link from "next/link"
import { Rocket, TrendingUp, Target, FileText, BarChart3, Users, Zap, CheckCircle } from "lucide-react"

export default async function Home() {
  const session = await getServerSession(authOptions)

  if (session) {
    redirect("/dashboard")
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50">
      {/* Header/Nav */}
      <nav className="bg-white/80 backdrop-blur-sm border-b border-orange-100 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-amber-600 rounded-lg flex items-center justify-center">
              <Rocket className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-orange-600 to-amber-600 bg-clip-text text-transparent">
              SMRS
            </span>
          </div>
          <Link
            href="/login"
            className="text-orange-600 font-semibold hover:text-orange-700 transition-colors"
          >
            Sign In
          </Link>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Hero Section */}
        <div className="text-center mb-20">
          <div className="inline-flex items-center gap-2 bg-orange-100 text-orange-700 px-4 py-2 rounded-full mb-6 font-medium">
            <Zap className="w-4 h-4" />
            <span>Power Your Startup Journey</span>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-extrabold mb-6 leading-tight">
            <span className="bg-gradient-to-r from-orange-600 via-amber-600 to-yellow-600 bg-clip-text text-transparent">
              Startup Management
            </span>
            <br />
            <span className="text-gray-900">Made Simple</span>
          </h1>
          
          <p className="text-xl md:text-2xl text-gray-700 mb-10 max-w-3xl mx-auto leading-relaxed">
            Track progress, visualize metrics, and generate professional reports. 
            Everything you need to manage your startup in <span className="font-bold text-orange-600">one powerful platform</span>.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/register"
              className="group bg-gradient-to-r from-orange-500 to-amber-600 text-white px-10 py-4 rounded-xl text-lg font-bold hover:from-orange-600 hover:to-amber-700 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 flex items-center justify-center gap-2"
            >
              Get Started Free
              <Rocket className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              href="/login"
              className="bg-white text-orange-600 px-10 py-4 rounded-xl text-lg font-bold border-2 border-orange-500 hover:bg-orange-50 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            >
              Sign In
            </Link>
          </div>

          <div className="mt-8 flex items-center justify-center gap-6 text-sm text-gray-600">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-orange-500" />
              <span>Free Forever</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-orange-500" />
              <span>No Credit Card</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-orange-500" />
              <span>Setup in 5 Minutes</span>
            </div>
          </div>
        </div>

        {/* Features Section */}
        <div className="grid md:grid-cols-3 gap-6 mb-20">
          <div className="group bg-white p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-all border-2 border-orange-100 hover:border-orange-300 transform hover:-translate-y-1">
            <div className="w-14 h-14 bg-gradient-to-br from-orange-500 to-amber-600 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <TrendingUp className="w-7 h-7 text-white" />
            </div>
            <h3 className="text-2xl font-bold mb-3 text-gray-900">Track Progress</h3>
            <p className="text-gray-600 leading-relaxed">
              Log weekly and monthly activities, milestones, and challenges. Keep your entire team aligned.
            </p>
          </div>

          <div className="group bg-white p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-all border-2 border-amber-100 hover:border-amber-300 transform hover:-translate-y-1">
            <div className="w-14 h-14 bg-gradient-to-br from-amber-500 to-orange-600 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <BarChart3 className="w-7 h-7 text-white" />
            </div>
            <h3 className="text-2xl font-bold mb-3 text-gray-900">Monitor KPIs</h3>
            <p className="text-gray-600 leading-relaxed">
              Visualize marketing, sales, product, and operational metrics with beautiful interactive charts.
            </p>
          </div>

          <div className="group bg-white p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-all border-2 border-yellow-100 hover:border-yellow-300 transform hover:-translate-y-1">
            <div className="w-14 h-14 bg-gradient-to-br from-yellow-500 to-orange-600 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <FileText className="w-7 h-7 text-white" />
            </div>
            <h3 className="text-2xl font-bold mb-3 text-gray-900">Generate Reports</h3>
            <p className="text-gray-600 leading-relaxed">
              Auto-generate professional PDF reports for your incubation center with one click.
            </p>
          </div>
        </div>

        {/* Additional Features Grid */}
        <div className="grid md:grid-cols-2 gap-6 mb-20">
          <div className="bg-gradient-to-br from-orange-500 to-amber-600 p-8 rounded-2xl shadow-xl text-white">
            <Target className="w-12 h-12 mb-4" />
            <h3 className="text-2xl font-bold mb-3">Timeline & Milestones</h3>
            <p className="text-orange-50 leading-relaxed">
              Track your progress through 7 startup stages from ideation to scale. Visualize your journey and celebrate wins.
            </p>
          </div>

          <div className="bg-gradient-to-br from-amber-500 to-orange-600 p-8 rounded-2xl shadow-xl text-white">
            <Users className="w-12 h-12 mb-4" />
            <h3 className="text-2xl font-bold mb-3">Mentor Feedback</h3>
            <p className="text-amber-50 leading-relaxed">
              Log mentor meetings, track feedback, and monitor your progress scores. Never miss important advice.
            </p>
          </div>
        </div>

        {/* Stages Section */}
        <div className="bg-white rounded-3xl shadow-2xl p-12 border-2 border-orange-100">
          <h2 className="text-4xl font-bold text-center mb-4 bg-gradient-to-r from-orange-600 to-amber-600 bg-clip-text text-transparent">
            Track Every Stage of Your Journey
          </h2>
          <p className="text-center text-gray-600 mb-10 text-lg">
            From first idea to scaling globally - we&apos;ve got you covered
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            {[
              { name: 'Ideation', color: 'from-red-500 to-orange-500' },
              { name: 'Prototype', color: 'from-orange-500 to-amber-500' },
              { name: 'Validation', color: 'from-amber-500 to-yellow-500' },
              { name: 'Incubation', color: 'from-yellow-500 to-lime-500' },
              { name: 'Acceleration', color: 'from-lime-500 to-green-500' },
              { name: 'Growth', color: 'from-green-500 to-emerald-500' },
              { name: 'Scale', color: 'from-emerald-500 to-teal-500' },
            ].map((stage) => (
              <div 
                key={stage.name} 
                className={`bg-gradient-to-r ${stage.color} px-6 py-3 rounded-full shadow-lg text-white font-bold text-lg hover:scale-105 transition-transform cursor-default`}
              >
                {stage.name}
              </div>
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <div className="mt-20 text-center">
          <div className="bg-gradient-to-r from-orange-500 via-amber-500 to-yellow-500 rounded-3xl p-12 shadow-2xl">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Ready to Power Up Your Startup?
            </h2>
            <p className="text-xl text-orange-50 mb-8 max-w-2xl mx-auto">
              Join hundreds of startups managing their journey with SMRS
            </p>
            <Link
              href="/register"
              className="inline-flex items-center gap-2 bg-white text-orange-600 px-10 py-4 rounded-xl text-lg font-bold hover:bg-gray-50 transition-all shadow-xl hover:shadow-2xl transform hover:-translate-y-0.5"
            >
              <Rocket className="w-6 h-6" />
              Start Your Journey Free
            </Link>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-white border-t border-orange-100 mt-20 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-gray-600">
          <p className="text-sm">
            © 2025 Startup Management & Reporting System. Built for entrepreneurs, by entrepreneurs.
          </p>
        </div>
      </footer>
    </div>
  )
}
