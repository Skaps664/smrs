import Link from "next/link"
import { 
  Rocket, TrendingUp, Target, FileText, BarChart3, Users, CheckCircle, 
  ArrowRight, Calendar, LineChart, Briefcase, Award, Clock, Shield, Globe,
  Sparkles, MousePointer, Star, ChevronRight
} from "lucide-react"

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gray-900 overflow-x-hidden">
      {/* Animated Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-orange-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-40 right-20 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute bottom-20 left-1/3 w-80 h-80 bg-yellow-500/10 rounded-full blur-3xl animate-pulse delay-2000"></div>
      </div>

      {/* Header/Nav */}
      <nav className="relative bg-black/40 backdrop-blur-md border-b border-orange-500/20 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-orange-500 via-amber-500 to-yellow-500 rounded-xl flex items-center justify-center shadow-lg shadow-orange-500/30 transform hover:rotate-6 transition-transform">
              <Rocket className="w-7 h-7 text-white" />
            </div>
            <span className="text-3xl font-black bg-gradient-to-r from-orange-400 via-amber-400 to-yellow-400 bg-clip-text text-transparent">
              SMRS
            </span>
          </div>
          <div className="flex items-center gap-6">
            <Link
              href="/login"
              className="text-gray-300 font-medium hover:text-orange-400 transition-colors hidden sm:block"
            >
              Sign In
            </Link>
            <Link
              href="/register"
              className="bg-gradient-to-r from-orange-500 to-amber-500 text-white px-6 py-2.5 rounded-xl font-bold hover:from-orange-600 hover:to-amber-600 transition-all shadow-lg shadow-orange-500/30 flex items-center gap-2 group"
            >
              Get Started
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </nav>

      <div className="relative">
        {/* Hero Section */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-32">
          <div className="text-center mb-16">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-orange-500/20 to-amber-500/20 border border-orange-500/30 text-orange-400 px-5 py-2.5 rounded-full mb-8 font-semibold backdrop-blur-sm animate-pulse">
              <Sparkles className="w-4 h-4" />
              <span>Trusted by 500+ Startups</span>
            </div>
            
            {/* Main Heading */}
            <h1 className="text-5xl md:text-8xl font-black mb-8 leading-tight">
              <span className="block text-white mb-2">DESIGNING +</span>
              <span className="block bg-gradient-to-r from-orange-400 via-amber-400 to-yellow-400 bg-clip-text text-transparent animate-gradient">
                BUILDING
              </span>
              <span className="block text-white mt-2">HIGH-PERFORMING</span>
              <span className="block text-white">STARTUPS</span>
            </h1>
            
            {/* Subheading */}
            <p className="text-lg md:text-2xl text-gray-400 mb-12 max-w-3xl mx-auto leading-relaxed">
              Hello there. I&apos;m <span className="text-orange-400 font-bold">SMRS</span> + I craft powerful tools and our user-friendly 
              platform is <span className="text-amber-400 font-bold">designed to inspire</span> growth. We want to create a 
              positive impact with our <span className="text-yellow-400 font-bold">template to inspire growth</span>.
            </p>
            
            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-5 justify-center mb-12">
              <Link
                href="/register"
                className="group bg-gradient-to-r from-orange-500 via-amber-500 to-yellow-500 text-white px-8 sm:px-12 py-5 rounded-2xl text-base sm:text-lg font-black hover:from-orange-600 hover:via-amber-600 hover:to-yellow-600 transition-all shadow-2xl shadow-orange-500/40 flex items-center justify-center gap-3 hover:scale-105 transform"
              >
                <MousePointer className="w-6 h-6" />
                LET&apos;S START BUILDING TODAY!
                <ChevronRight className="w-6 h-6 group-hover:translate-x-2 transition-transform" />
              </Link>
            </div>

            {/* Trust Badges */}
            <div className="flex flex-wrap items-center justify-center gap-6 sm:gap-8 text-sm text-gray-500">
              <div className="flex items-center gap-2">
                <Shield className="w-5 h-5 text-orange-500" />
                <span>Enterprise Security</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-amber-500" />
                <span>24/7 Support</span>
              </div>
              <div className="flex items-center gap-2">
                <Award className="w-5 h-5 text-yellow-500" />
                <span>Award Winning</span>
              </div>
              <div className="flex items-center gap-2">
                <Globe className="w-5 h-5 text-orange-500" />
                <span>Global Reach</span>
              </div>
            </div>
          </div>

          {/* Featured Image/Dashboard Preview */}
          <div className="relative max-w-6xl mx-auto mb-20">
            <div className="relative rounded-3xl overflow-hidden shadow-2xl shadow-orange-500/20 border-4 border-orange-500/30 backdrop-blur-sm bg-black/20 transform hover:scale-105 transition-transform duration-500">
              <div className="aspect-video bg-gradient-to-br from-gray-800 via-gray-900 to-black p-8">
                <div className="h-full rounded-2xl bg-gradient-to-br from-orange-500/10 to-amber-500/10 border border-orange-500/30 flex items-center justify-center">
                  <div className="text-center">
                    <BarChart3 className="w-24 h-24 text-orange-400 mx-auto mb-4 animate-pulse" />
                    <p className="text-2xl font-bold text-white">Your Startup Dashboard</p>
                    <p className="text-gray-400 mt-2">Real-time insights at your fingertips</p>
                  </div>
                </div>
              </div>
            </div>
            {/* Floating Cards */}
            <div className="absolute -top-8 -left-8 bg-white/10 backdrop-blur-md border border-orange-500/30 rounded-2xl p-4 shadow-xl hidden lg:block animate-float">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-amber-500 rounded-xl flex items-center justify-center">
                  <TrendingUp className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="text-white font-bold">Growth</p>
                  <p className="text-orange-400 text-sm">+45% This Month</p>
                </div>
              </div>
            </div>
            <div className="absolute -bottom-8 -right-8 bg-white/10 backdrop-blur-md border border-amber-500/30 rounded-2xl p-4 shadow-xl hidden lg:block animate-float-delayed">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-br from-amber-500 to-yellow-500 rounded-xl flex items-center justify-center">
                  <Users className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="text-white font-bold">Team</p>
                  <p className="text-amber-400 text-sm">12 Active Members</p>
                </div>
              </div>
            </div>
          </div>

          {/* Stats Section */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-32">
            {[
              { number: '500+', label: 'Active Startups', icon: Rocket },
              { number: '10K+', label: 'Reports Generated', icon: FileText },
              { number: '98%', label: 'Satisfaction Rate', icon: Star },
              { number: '24/7', label: 'Support Available', icon: Clock }
            ].map((stat, index) => (
              <div key={index} className="bg-white/5 backdrop-blur-md border border-orange-500/20 rounded-2xl p-6 text-center hover:bg-white/10 transition-all hover:scale-105 transform group">
                <stat.icon className="w-10 h-10 text-orange-400 mx-auto mb-3 group-hover:scale-110 transition-transform" />
                <div className="text-3xl md:text-4xl font-black text-white mb-2">{stat.number}</div>
                <div className="text-gray-400 font-medium text-sm md:text-base">{stat.label}</div>
              </div>
            ))}
          </div>

          {/* Position Yourself Section */}
          <div className="bg-gradient-to-br from-orange-500/10 to-amber-500/10 border border-orange-500/30 rounded-3xl p-8 sm:p-12 mb-32 backdrop-blur-sm hover:from-orange-500/15 hover:to-amber-500/15 transition-all">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-4xl md:text-6xl font-black text-white mb-6 leading-tight">
                POSITION YOURSELF<br />
                <span className="bg-gradient-to-r from-orange-400 to-amber-400 bg-clip-text text-transparent">
                  AS AN EXPERT
                </span> WITH A<br />
                HIGH-PERFORMING<br />
                PLATFORM
              </h2>
              <p className="text-lg md:text-xl text-gray-400 mb-8 leading-relaxed">
                This platform has that awesome vibe! It needed to elevate the brand in a certain way, 
                yet need to make a positive impact. We need our template to inspire growth. 
                If you ever want to stand out from the competition, you need to follow best 
                practices and trends to deliver a <span className="text-orange-400 font-bold">quality product</span>.
              </p>
              <div className="grid md:grid-cols-2 gap-4 mb-8">
                {[
                  '✓ KEEP VISITORS ENGAGED',
                  '✓ EASILY DISCOVERABLE',
                  '✓ FASTER LOADS',
                  '✓ SECURE SSL'
                ].map((feature, index) => (
                  <div key={index} className="flex items-center gap-3 bg-white/5 backdrop-blur-sm border border-orange-500/20 rounded-xl p-4 hover:bg-white/10 transition-all group">
                    <CheckCircle className="w-6 h-6 text-orange-400 flex-shrink-0 group-hover:scale-110 transition-transform" />
                    <span className="text-white font-bold">{feature}</span>
                  </div>
                ))}
              </div>
              <Link
                href="/register"
                className="inline-flex items-center gap-3 bg-white text-gray-900 px-8 py-4 rounded-xl font-black hover:bg-gray-100 transition-all shadow-xl group"
              >
                <ArrowRight className="w-6 h-6 group-hover:translate-x-2 transition-transform" />
                Visit site
              </Link>
            </div>
          </div>

          {/* Features Section */}
          <div className="grid md:grid-cols-3 gap-8 mb-32">
            <div className="group bg-gradient-to-br from-white/5 to-white/10 backdrop-blur-md border border-orange-500/30 p-10 rounded-3xl shadow-xl hover:shadow-2xl hover:shadow-orange-500/20 transition-all hover:scale-105 transform">
              <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-amber-600 rounded-2xl flex items-center justify-center mb-6 group-hover:rotate-12 transition-transform shadow-lg shadow-orange-500/50">
                <TrendingUp className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-black mb-4 text-white">Track Progress</h3>
              <p className="text-gray-400 leading-relaxed text-lg">
                Log weekly and monthly activities, milestones, and challenges. Keep your entire team aligned with real-time updates.
              </p>
            </div>

            <div className="group bg-gradient-to-br from-white/5 to-white/10 backdrop-blur-md border border-amber-500/30 p-10 rounded-3xl shadow-xl hover:shadow-2xl hover:shadow-amber-500/20 transition-all hover:scale-105 transform">
              <div className="w-16 h-16 bg-gradient-to-br from-amber-500 to-yellow-600 rounded-2xl flex items-center justify-center mb-6 group-hover:rotate-12 transition-transform shadow-lg shadow-amber-500/50">
                <BarChart3 className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-black mb-4 text-white">Monitor KPIs</h3>
              <p className="text-gray-400 leading-relaxed text-lg">
                Visualize marketing, sales, product, and operational metrics with beautiful interactive charts and dashboards.
              </p>
            </div>

            <div className="group bg-gradient-to-br from-white/5 to-white/10 backdrop-blur-md border border-yellow-500/30 p-10 rounded-3xl shadow-xl hover:shadow-2xl hover:shadow-yellow-500/20 transition-all hover:scale-105 transform">
              <div className="w-16 h-16 bg-gradient-to-br from-yellow-500 to-orange-600 rounded-2xl flex items-center justify-center mb-6 group-hover:rotate-12 transition-transform shadow-lg shadow-yellow-500/50">
                <FileText className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-black mb-4 text-white">Generate Reports</h3>
              <p className="text-gray-400 leading-relaxed text-lg">
                Auto-generate professional PDF reports for your incubation center with one click. Save hours of manual work.
              </p>
            </div>
          </div>

          {/* Feature Highlight Grid */}
          <div className="grid md:grid-cols-2 gap-8 mb-32">
            <div className="bg-gradient-to-br from-orange-500 to-amber-600 p-12 rounded-3xl shadow-2xl shadow-orange-500/30 text-white group hover:scale-105 transition-transform">
              <Target className="w-14 h-14 mb-6 group-hover:rotate-12 transition-transform" />
              <h3 className="text-3xl font-black mb-4">Timeline & Milestones</h3>
              <p className="text-orange-50 leading-relaxed text-lg mb-6">
                Track your progress through 7 startup stages from ideation to scale. Visualize your journey and celebrate every win along the way.
              </p>
              <div className="flex items-center gap-2 text-orange-100 font-bold cursor-pointer">
                <span>Learn more</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform" />
              </div>
            </div>

            <div className="bg-gradient-to-br from-amber-500 to-yellow-600 p-12 rounded-3xl shadow-2xl shadow-amber-500/30 text-white group hover:scale-105 transition-transform">
              <Users className="w-14 h-14 mb-6 group-hover:rotate-12 transition-transform" />
              <h3 className="text-3xl font-black mb-4">Mentor Feedback</h3>
              <p className="text-amber-50 leading-relaxed text-lg mb-6">
                Log mentor meetings, track feedback, and monitor your progress scores. Never miss important advice that could change your trajectory.
              </p>
              <div className="flex items-center gap-2 text-amber-100 font-bold cursor-pointer">
                <span>Learn more</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform" />
              </div>
            </div>
          </div>

          {/* Tools Showcase */}
          <div className="mb-32">
            <h2 className="text-4xl md:text-5xl font-black text-center mb-4 text-white">
              POWERFUL TOOLS FOR
            </h2>
            <h2 className="text-4xl md:text-5xl font-black text-center mb-12 bg-gradient-to-r from-orange-400 to-amber-400 bg-clip-text text-transparent">
              MODERN STARTUPS
            </h2>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { icon: Briefcase, title: 'Business Model Canvas', desc: 'Map your strategy' },
                { icon: Target, title: 'Value Proposition', desc: 'Define your offering' },
                { icon: LineChart, title: 'KPI Dashboard', desc: 'Track metrics' },
                { icon: Calendar, title: 'Progress Trackers', desc: 'Weekly & monthly' }
              ].map((tool, index) => (
                <div key={index} className="bg-white/5 backdrop-blur-md border border-orange-500/20 rounded-2xl p-8 text-center hover:bg-white/10 transition-all hover:scale-105 transform group">
                  <tool.icon className="w-12 h-12 text-orange-400 mx-auto mb-4 group-hover:scale-110 transition-transform" />
                  <h4 className="text-lg md:text-xl font-bold text-white mb-2">{tool.title}</h4>
                  <p className="text-gray-400 text-sm md:text-base">{tool.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Stages Timeline */}
          <div className="bg-gradient-to-br from-white/5 to-white/10 backdrop-blur-md border border-orange-500/30 rounded-3xl shadow-2xl p-8 sm:p-12 mb-32">
            <h2 className="text-4xl md:text-5xl font-black text-center mb-4 text-white">
              Track Every Stage
            </h2>
            <h3 className="text-xl md:text-2xl text-center mb-12 bg-gradient-to-r from-orange-400 to-amber-400 bg-clip-text text-transparent font-bold">
              From First Idea to Global Scale
            </h3>
            <div className="flex flex-wrap justify-center gap-4">
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
                  className={`bg-gradient-to-r ${stage.color} px-6 sm:px-8 py-3 sm:py-4 rounded-2xl shadow-xl text-white font-black text-lg sm:text-xl hover:scale-110 transition-transform cursor-default`}
                >
                  {stage.name}
                </div>
              ))}
            </div>
          </div>

          {/* Final CTA */}
          <div className="text-center mb-20">
            <div className="bg-gradient-to-r from-orange-500 via-amber-500 to-yellow-500 rounded-3xl p-12 sm:p-16 shadow-2xl shadow-orange-500/40 relative overflow-hidden">
              {/* Decorative elements */}
              <div className="absolute top-0 left-0 w-full h-full opacity-10">
                <div className="absolute top-10 left-10 w-40 h-40 bg-white rounded-full blur-3xl animate-pulse"></div>
                <div className="absolute bottom-10 right-10 w-60 h-60 bg-white rounded-full blur-3xl animate-pulse delay-1000"></div>
              </div>
              <div className="relative z-10">
                <h2 className="text-4xl md:text-6xl font-black text-white mb-6">
                  Ready to Build Your
                  <br />
                  Startup Empire?
                </h2>
                <p className="text-xl md:text-2xl text-white/90 mb-10 max-w-3xl mx-auto font-medium">
                  Join 500+ startups managing their journey with SMRS. 
                  <br />
                  Start free, scale unlimited.
                </p>
                <div className="flex flex-col sm:flex-row gap-5 justify-center">
                  <Link
                    href="/register"
                    className="inline-flex items-center gap-3 bg-white text-orange-600 px-10 sm:px-12 py-4 sm:py-5 rounded-2xl text-lg sm:text-xl font-black hover:bg-gray-50 transition-all shadow-2xl hover:shadow-3xl transform hover:scale-105 group"
                  >
                    <Rocket className="w-6 sm:w-7 h-6 sm:h-7 group-hover:-translate-y-1 transition-transform" />
                    Start Your Journey Free
                  </Link>
                  <Link
                    href="/login"
                    className="inline-flex items-center gap-3 bg-black/20 backdrop-blur-sm border-2 border-white text-white px-10 sm:px-12 py-4 sm:py-5 rounded-2xl text-lg sm:text-xl font-black hover:bg-black/30 transition-all"
                  >
                    Sign In
                    <ArrowRight className="w-6 sm:w-7 h-6 sm:h-7" />
                  </Link>
                </div>
                <div className="mt-8 flex flex-wrap items-center justify-center gap-4 sm:gap-6 text-white/80 text-sm sm:text-base">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-5 sm:w-6 h-5 sm:h-6" />
                    <span className="font-bold">Free Forever Plan</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-5 sm:w-6 h-5 sm:h-6" />
                    <span className="font-bold">No Credit Card</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-5 sm:w-6 h-5 sm:h-6" />
                    <span className="font-bold">Setup in 5 Minutes</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="relative bg-black border-t border-orange-500/20 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-8">
            <div className="col-span-2 md:col-span-1">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-amber-500 rounded-xl flex items-center justify-center">
                  <Rocket className="w-6 h-6 text-white" />
                </div>
                <span className="text-2xl font-black text-white">SMRS</span>
              </div>
              <p className="text-gray-400">
                Empowering startups with powerful management tools.
              </p>
            </div>
            <div>
              <h4 className="text-white font-bold mb-4">Product</h4>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="/register" className="hover:text-orange-400 transition-colors">Features</Link></li>
                <li><Link href="/register" className="hover:text-orange-400 transition-colors">Pricing</Link></li>
                <li><Link href="/register" className="hover:text-orange-400 transition-colors">Use Cases</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-bold mb-4">Company</h4>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="/register" className="hover:text-orange-400 transition-colors">About</Link></li>
                <li><Link href="/register" className="hover:text-orange-400 transition-colors">Blog</Link></li>
                <li><Link href="/register" className="hover:text-orange-400 transition-colors">Careers</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-bold mb-4">Support</h4>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="/register" className="hover:text-orange-400 transition-colors">Help Center</Link></li>
                <li><Link href="/register" className="hover:text-orange-400 transition-colors">Contact</Link></li>
                <li><Link href="/register" className="hover:text-orange-400 transition-colors">Privacy</Link></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-orange-500/20 pt-8 text-center">
            <p className="text-gray-500">
              © 2025 <span className="text-orange-400 font-bold">SMRS</span> - Startup Management & Reporting System. 
              <br className="sm:hidden" />
              <span className="text-gray-600"> Built for entrepreneurs, by entrepreneurs.</span>
            </p>
          </div>
        </div>
      </footer>

      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }
        .animate-float {
          animation: float 3s ease-in-out infinite;
        }
        .animate-float-delayed {
          animation: float 3s ease-in-out 1.5s infinite;
        }
      `}</style>
    </div>
  )
}
