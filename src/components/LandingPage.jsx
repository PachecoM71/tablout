import { ArrowRight, Circle, Square, RectangleHorizontal, Hexagon, Move, Users, Zap, Download, UserX, ShieldCheck, HardDrive, Cookie } from 'lucide-react'

const FEATURES = [
  { icon: Hexagon, title: '7 Table Shapes', desc: 'Round, rectangle, square, oval, U-shape, L-shape, and banquet tables to match any venue layout.' },
  { icon: Users, title: 'Smart Guest Groups', desc: 'Organize guests into color-coded groups like Family, Friends, and Colleagues for easy management.' },
  { icon: Zap, title: 'Auto-Seat', desc: 'One-click automatic guest assignment fills empty seats by group — saving you hours of planning.' },
  { icon: Move, title: 'Drag & Drop', desc: 'Intuitively position tables on the canvas and drag guests directly onto seats.' },
  { icon: Download, title: 'Export to PNG', desc: 'Download a high-resolution image of your floor plan to share with venues and coordinators.' },
  { icon: UserX, title: 'No Account Needed', desc: 'Start planning instantly — no sign-up, no email, no password. Just open and go.' },
]

const STEPS = [
  { num: '01', title: 'Add Your Tables', desc: 'Choose from 7 table shapes and place them anywhere on the canvas. Resize and rotate to match your venue.' },
  { num: '02', title: 'Add Your Guests', desc: 'Create your guest list and organize into custom groups. Import from a list or add one by one.' },
  { num: '03', title: 'Assign & Export', desc: 'Drag guests onto seats, use auto-assign, then export your finished floor plan as a PNG image.' },
]

const USE_CASES = [
  { title: 'Wedding Receptions', desc: 'Plan the perfect table arrangement for your big day.' },
  { title: 'Corporate Events', desc: 'Organize conference dinners and team-building seating.' },
  { title: 'Birthday Parties', desc: 'Arrange family and friends around the celebration.' },
  { title: 'Galas & Fundraisers', desc: 'Create professional layouts for formal events.' },
]

export default function LandingPage({ onEnterApp }) {
  return (
    <div className="min-h-screen bg-[#F5F4F0] font-body">
      {/* Nav */}
      <nav className="sticky top-0 z-50 bg-[#F5F4F0]/95 backdrop-blur-sm border-b border-[#3A3A38]/10">
        <div className="max-w-6xl mx-auto px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <svg width="28" height="28" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
              <rect width="32" height="32" rx="6" fill="#1A3C2B"/>
              <circle cx="16" cy="16" r="7" fill="none" stroke="#F5F4F0" strokeWidth="1.5"/>
              <circle cx="16" cy="7" r="2" fill="#FF8C69"/>
              <circle cx="22.4" cy="10.3" r="2" fill="#FF8C69"/>
              <circle cx="22.4" cy="21.7" r="2" fill="#9EFFBF"/>
              <circle cx="16" cy="25" r="2" fill="#9EFFBF"/>
              <circle cx="9.6" cy="21.7" r="2" fill="#F5F4F0" opacity="0.6"/>
              <circle cx="9.6" cy="10.3" r="2" fill="#F5F4F0" opacity="0.6"/>
            </svg>
            <span className="font-display text-[15px] font-bold text-[#1A3C2B] tracking-tight">tablout</span>
          </div>
          <button
            onClick={onEnterApp}
            className="px-4 py-2 bg-[#1A3C2B] text-white text-sm font-semibold rounded-md hover:bg-[#1A3C2B]/90 transition-colors"
          >
            Open Planner
          </button>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 blueprint-grid opacity-50" />
        <div className="relative max-w-6xl mx-auto px-6 py-20 md:py-28 flex flex-col md:flex-row items-center gap-12">
          <div className="flex-1 space-y-6">
            <h1 className="font-display text-4xl md:text-5xl font-bold text-[#1A3C2B] leading-tight tracking-tight">
              Free Drag & Drop Seating Planner
            </h1>
            <p className="text-lg text-[#3A3A38]/70 max-w-md leading-relaxed">
              Create beautiful seating arrangements for weddings, events, and parties. Drag tables, assign guests by group, auto-seat, and export to PNG. No sign-up required.
            </p>
            <button
              onClick={onEnterApp}
              className="inline-flex items-center gap-2 px-8 py-4 bg-[#1A3C2B] text-white font-display font-semibold text-lg rounded-md hover:bg-[#1A3C2B]/90 transition-colors shadow-lg shadow-[#1A3C2B]/20"
            >
              Start Planning — Free
              <ArrowRight size={20} />
            </button>
            <p className="text-xs text-[#3A3A38]/50 font-mono uppercase tracking-wider">
              No sign-up • No credit card • Works instantly
            </p>
          </div>
          <div className="flex-1 max-w-md">
            {/* App mockup */}
            <div className="bg-white rounded-xl shadow-2xl shadow-black/10 border border-[#3A3A38]/10 overflow-hidden">
              <div className="h-8 bg-[#F5F4F0] border-b border-[#3A3A38]/10 flex items-center px-3 gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-[#3A3A38]/15" />
                <div className="w-2.5 h-2.5 rounded-full bg-[#3A3A38]/15" />
                <div className="w-2.5 h-2.5 rounded-full bg-[#3A3A38]/15" />
              </div>
              <div className="p-4 bg-[#F5F4F0] relative" style={{ backgroundImage: 'linear-gradient(to right, rgba(58,58,56,0.08) 1px, transparent 1px), linear-gradient(to bottom, rgba(58,58,56,0.08) 1px, transparent 1px)', backgroundSize: '24px 24px' }}>
                <div className="h-48 relative">
                  {/* Round table */}
                  <div className="absolute top-6 left-8 w-20 h-20 rounded-full border-[2.5px] border-[#1A3C2B] bg-[rgba(26,60,43,0.04)]">
                    <div className="absolute -top-2 left-7 w-4 h-4 rounded-full bg-[#FF8C69] border border-[#FF8C69]/60" />
                    <div className="absolute top-3 -right-2 w-4 h-4 rounded-full bg-[#9EFFBF] border border-[#9EFFBF]/60" />
                    <div className="absolute -bottom-2 left-7 w-4 h-4 rounded-full bg-[#7EB8D0] border border-[#7EB8D0]/60" />
                    <div className="absolute top-3 -left-2 w-4 h-4 rounded-full border-[1.5px] border-dashed border-[#3A3A38]/30" />
                  </div>
                  {/* Rectangle table */}
                  <div className="absolute top-24 left-36 w-28 h-14 rounded-lg border-[2.5px] border-[#1A3C2B] bg-[rgba(26,60,43,0.04)]">
                    <div className="absolute -top-2 left-4 w-4 h-4 rounded-full bg-[#D4A574] border border-[#D4A574]/60" />
                    <div className="absolute -top-2 left-12 w-4 h-4 rounded-full bg-[#B088D4] border border-[#B088D4]/60" />
                    <div className="absolute -top-2 left-20 w-4 h-4 rounded-full border-[1.5px] border-dashed border-[#3A3A38]/30" />
                    <div className="absolute -bottom-2 left-4 w-4 h-4 rounded-full bg-[#FF8C69] border border-[#FF8C69]/60" />
                    <div className="absolute -bottom-2 left-12 w-4 h-4 rounded-full bg-[#9EFFBF] border border-[#9EFFBF]/60" />
                  </div>
                  {/* Square table */}
                  <div className="absolute top-2 right-6 w-14 h-14 rounded-md border-[2.5px] border-[#1A3C2B] bg-[rgba(26,60,43,0.04)]">
                    <div className="absolute -top-2 left-4 w-4 h-4 rounded-full bg-[#7EB8D0] border border-[#7EB8D0]/60" />
                    <div className="absolute top-4 -right-2 w-4 h-4 rounded-full bg-[#D4A574] border border-[#D4A574]/60" />
                    <div className="absolute -bottom-2 left-4 w-4 h-4 rounded-full border-[1.5px] border-dashed border-[#3A3A38]/30" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="bg-white py-20">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="font-display text-3xl font-bold text-[#1A3C2B] text-center mb-12">
            Everything You Need
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {FEATURES.map((feature) => (
              <div key={feature.title} className="p-6 rounded-xl border border-[#3A3A38]/10 hover:border-[#1A3C2B]/30 transition-colors">
                <feature.icon size={24} className="text-[#1A3C2B] mb-3" />
                <h3 className="font-display font-semibold text-[#1A3C2B] mb-2">{feature.title}</h3>
                <p className="text-sm text-[#3A3A38]/70 leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="font-display text-3xl font-bold text-[#1A3C2B] text-center mb-12">
            How It Works
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {STEPS.map(({ num, title, desc }) => (
              <div key={num} className="text-center space-y-4">
                <div className="w-14 h-14 rounded-full bg-[#1A3C2B] text-white font-mono text-lg font-bold flex items-center justify-center mx-auto">
                  {num}
                </div>
                <h3 className="font-display font-semibold text-[#1A3C2B] text-lg">{title}</h3>
                <p className="text-sm text-[#3A3A38]/70 leading-relaxed max-w-xs mx-auto">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Use Cases */}
      <section className="bg-white py-20">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="font-display text-3xl font-bold text-[#1A3C2B] text-center mb-12">
            Perfect For Any Event
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {USE_CASES.map(({ title, desc }) => (
              <div key={title} className="p-5 rounded-xl bg-[#F5F4F0] border border-[#3A3A38]/5">
                <h3 className="font-display font-semibold text-[#1A3C2B] mb-2">{title}</h3>
                <p className="text-sm text-[#3A3A38]/60">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Privacy Trust */}
      <section className="py-20">
        <div className="max-w-3xl mx-auto px-6 text-center space-y-6">
          <ShieldCheck size={40} className="text-[#1A3C2B] mx-auto" />
          <h2 className="font-display text-3xl font-bold text-[#1A3C2B]">
            Your Privacy, Protected
          </h2>
          <p className="text-[#3A3A38]/70 text-lg leading-relaxed">
            tablout stores nothing on our servers. All your data stays in your browser using local storage. 
            No personal information is collected, tracked, or shared. No cookies, no analytics, no sign-up required.
          </p>
          <div className="flex flex-wrap justify-center gap-4 pt-4">
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#1A3C2B]/5 border border-[#1A3C2B]/10 text-sm text-[#1A3C2B] font-medium">
              <ShieldCheck size={14} /> No Data Collected
            </span>
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#1A3C2B]/5 border border-[#1A3C2B]/10 text-sm text-[#1A3C2B] font-medium">
              <HardDrive size={14} /> Browser-Only Storage
            </span>
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#1A3C2B]/5 border border-[#1A3C2B]/10 text-sm text-[#1A3C2B] font-medium">
              <Cookie size={14} /> No Cookies
            </span>
          </div>
        </div>
      </section>

      {/* CTA Footer */}
      <section className="relative bg-[#1A3C2B] overflow-hidden">
        <div className="absolute inset-0 opacity-40" style={{ backgroundImage: 'linear-gradient(to right, rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.05) 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
        {/* Corner brackets */}
        <div className="absolute top-8 left-8 w-6 h-6 border-l border-t border-white/20" />
        <div className="absolute top-8 right-8 w-6 h-6 border-r border-t border-white/20" />
        <div className="absolute bottom-8 left-8 w-6 h-6 border-l border-b border-white/20" />
        <div className="absolute bottom-8 right-8 w-6 h-6 border-r border-b border-white/20" />
        
        <div className="relative py-20 text-center space-y-8">
          <h2 className="font-display text-3xl md:text-4xl font-semibold text-white">
            Ready to plan your seating?
          </h2>
          <button
            onClick={onEnterApp}
            className="inline-flex items-center gap-2 px-10 py-5 border-2 border-white text-white font-display text-lg font-semibold tracking-wide hover:bg-white hover:text-[#1A3C2B] transition-colors"
          >
            Start Planning — Free
            <ArrowRight size={20} />
          </button>
          <div className="flex flex-wrap justify-center gap-8 pt-6 text-white/40 text-xs font-mono uppercase tracking-wider">
            <span>Free Forever</span>
            <span>No Sign-Up</span>
            <span>7 Table Shapes</span>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#1A3C2B] border-t border-white/10">
        <div className="max-w-6xl mx-auto px-6 py-6 flex flex-col sm:flex-row justify-between items-center gap-4 text-white/40 text-sm">
          <p>© 2026 tablout</p>
          <div className="flex gap-6">
            <a href="/privacy" className="hover:text-white transition-colors">Privacy</a>
            <a href="https://buymeacoffee.com/henmar28" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">Buy Me a Coffee ♥</a>
          </div>
        </div>
      </footer>
    </div>
  )
}
