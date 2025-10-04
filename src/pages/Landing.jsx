import { Link } from 'react-router-dom';
import { CreditCard, Users, Zap, CheckCircle, ArrowRight } from 'lucide-react';

export default function Landing() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100">
      <nav className="fixed top-0 w-full bg-white/80 backdrop-blur-md border-b border-slate-200 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <CreditCard className="w-8 h-8 text-blue-600" />
            <span className="text-2xl font-bold text-slate-800">CardPro</span>
          </div>
          <div className="flex gap-4">
            <Link
              to="/login"
              className="px-6 py-2.5 text-slate-700 font-medium hover:text-blue-600 transition-colors"
            >
              Login
            </Link>
            <Link
              to="/signup"
              className="px-6 py-2.5 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-all shadow-lg shadow-blue-600/30 hover:shadow-xl hover:shadow-blue-600/40"
            >
              Get Started
            </Link>
          </div>
        </div>
      </nav>

      <section className="pt-32 pb-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-6xl font-bold text-slate-900 mb-6 leading-tight">
              Your Digital Business Card,{' '}
              <span className="text-blue-600">Reimagined</span>
            </h1>
            <p className="text-xl text-slate-600 mb-10 leading-relaxed">
              Create stunning, shareable business cards in seconds. Connect with clients,
              manage appointments, and grow your network effortlessly.
            </p>
            <div className="flex gap-4 justify-center">
              <Link
                to="/signup"
                className="px-8 py-4 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-all shadow-xl shadow-blue-600/30 hover:shadow-2xl hover:shadow-blue-600/40 flex items-center gap-2 text-lg"
              >
                Start Free Trial <ArrowRight className="w-5 h-5" />
              </Link>
              <a
                href="#features"
                className="px-8 py-4 bg-white text-slate-700 rounded-lg font-semibold hover:bg-slate-50 transition-all shadow-lg border border-slate-200 text-lg"
              >
                Learn More
              </a>
            </div>
          </div>
        </div>
      </section>

      <section id="features" className="py-20 px-6 bg-white">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-bold text-center text-slate-900 mb-16">
            Everything You Need to Stand Out
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="p-8 rounded-2xl bg-gradient-to-br from-blue-50 to-blue-100/50 border border-blue-200 hover:shadow-xl transition-shadow">
              <div className="w-14 h-14 bg-blue-600 rounded-xl flex items-center justify-center mb-6">
                <CreditCard className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-4">Digital Business Cards</h3>
              <p className="text-slate-600 leading-relaxed">
                Create beautiful, professional business cards with custom designs. Share instantly
                via QR codes or unique links.
              </p>
            </div>

            <div className="p-8 rounded-2xl bg-gradient-to-br from-green-50 to-green-100/50 border border-green-200 hover:shadow-xl transition-shadow">
              <div className="w-14 h-14 bg-green-600 rounded-xl flex items-center justify-center mb-6">
                <Users className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-4">Appointment Management</h3>
              <p className="text-slate-600 leading-relaxed">
                Track client inquiries and appointment requests in one place. Never miss an
                opportunity to connect.
              </p>
            </div>

            <div className="p-8 rounded-2xl bg-gradient-to-br from-amber-50 to-amber-100/50 border border-amber-200 hover:shadow-xl transition-shadow">
              <div className="w-14 h-14 bg-amber-600 rounded-xl flex items-center justify-center mb-6">
                <Zap className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-4">Instant Sharing</h3>
              <p className="text-slate-600 leading-relaxed">
                Share your card instantly with anyone, anywhere. QR codes make networking seamless
                at events and meetings.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 px-6 bg-slate-900 text-white">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-bold mb-6">
                Why Choose CardPro?
              </h2>
              <div className="space-y-4">
                <div className="flex gap-4 items-start">
                  <CheckCircle className="w-6 h-6 text-green-400 flex-shrink-0 mt-1" />
                  <div>
                    <h4 className="font-semibold text-lg mb-1">Quick Setup</h4>
                    <p className="text-slate-300">Create your digital card in under 2 minutes</p>
                  </div>
                </div>
                <div className="flex gap-4 items-start">
                  <CheckCircle className="w-6 h-6 text-green-400 flex-shrink-0 mt-1" />
                  <div>
                    <h4 className="font-semibold text-lg mb-1">Always Accessible</h4>
                    <p className="text-slate-300">Your card is available 24/7 from any device</p>
                  </div>
                </div>
                <div className="flex gap-4 items-start">
                  <CheckCircle className="w-6 h-6 text-green-400 flex-shrink-0 mt-1" />
                  <div>
                    <h4 className="font-semibold text-lg mb-1">Professional Image</h4>
                    <p className="text-slate-300">Modern design that makes you stand out</p>
                  </div>
                </div>
                <div className="flex gap-4 items-start">
                  <CheckCircle className="w-6 h-6 text-green-400 flex-shrink-0 mt-1" />
                  <div>
                    <h4 className="font-semibold text-lg mb-1">Track Engagement</h4>
                    <p className="text-slate-300">See who's interested and manage inquiries</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-gradient-to-br from-blue-600 to-blue-800 rounded-2xl p-12 text-center">
              <h3 className="text-3xl font-bold mb-4">Ready to Get Started?</h3>
              <p className="text-blue-100 mb-8 text-lg">
                Join thousands of professionals already using CardPro
              </p>
              <Link
                to="/signup"
                className="inline-block px-8 py-4 bg-white text-blue-600 rounded-lg font-semibold hover:bg-blue-50 transition-all shadow-xl"
              >
                Create Your Card Now
              </Link>
            </div>
          </div>
        </div>
      </section>

      <footer className="bg-slate-900 border-t border-slate-800 py-8 px-6">
        <div className="max-w-7xl mx-auto text-center text-slate-400">
          <p>&copy; 2025 CardPro. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
