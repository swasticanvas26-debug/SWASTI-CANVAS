import Link from 'next/link'
import { Calendar, Trophy, Image as ImageIcon, CheckCircle2, ChevronRight, Mail, Info, FileText } from 'lucide-react'
import MainLayout from '@/components/layout/MainLayout'
import Navbar from '@/components/layout/Navbar'
import MobileBottomNav from '@/components/layout/MobileBottomNav'
import { getAppUser } from '@/lib/auth'

export default async function CompetitionPage() {
  const user = await getAppUser()

  return (
    <MainLayout>
      <Navbar user={user} />

      <main className="min-h-screen bg-canvas-bg pb-24 md:pb-12">
        {/* Hero Section */}
        <section className="relative overflow-hidden bg-gradient-to-br from-teal-900 via-teal-800 to-teal-950 text-white pt-20 pb-24 px-4 sm:px-6">
          <div className="absolute inset-0 overflow-hidden opacity-20">
            <div className="absolute -top-24 -left-24 w-96 h-96 bg-teal-500 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob"></div>
            <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-mustard rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-2000"></div>
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-peach rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-4000"></div>
          </div>

          <div className="relative max-w-4xl mx-auto text-center z-10 animate-slide-up">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-sm font-semibold mb-6">
              <span className="w-2 h-2 rounded-full bg-mustard animate-pulse"></span>
              National Level Event
            </div>
            <h1 className="font-display font-black text-4xl sm:text-5xl md:text-6xl tracking-tight mb-6 leading-tight">
              SWASTI CANVAS <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-peach via-mustard to-yellow-300">
                NATIONAL ART COMPETITION
              </span>
            </h1>
            <p className="text-xl sm:text-2xl text-teal-100 font-medium mb-10 max-w-2xl mx-auto">
              "Art for Everyone" — December 2026
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <a href="#how-to-participate" className="btn-teal w-full sm:w-auto px-8 py-4 text-lg font-bold rounded-xl shadow-lg shadow-teal-500/30 hover:scale-105 transition-transform flex items-center justify-center gap-2">
                Participate Now <ChevronRight className="w-5 h-5" />
              </a>
              <a href="#entry-fee" className="w-full sm:w-auto px-8 py-4 text-lg font-bold rounded-xl bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20 transition-all text-white flex items-center justify-center gap-2">
                View Entry Fees
              </a>
            </div>
          </div>
        </section>

        <div className="max-w-6xl mx-auto px-4 sm:px-6 -mt-12 relative z-20">

          {/* Quick Info Cards */}
          <div className="grid md:grid-cols-3 gap-4 md:gap-6 mb-16">
            <div className="bg-white rounded-2xl p-6 shadow-card border border-canvas-border flex flex-col items-center text-center animate-fade-in" style={{ animationDelay: '0.1s' }}>
              <div className="w-14 h-14 rounded-full bg-teal-pale flex items-center justify-center text-teal mb-4">
                <ImageIcon className="w-7 h-7" />
              </div>
              <h3 className="font-bold text-lg mb-2">Theme & Target</h3>
              <p className="text-canvas-muted text-sm">
                <strong className="text-canvas-dark">Open Theme</strong> (No restriction)<br />
                Children aged <strong className="text-canvas-dark">7 to 16 years</strong>
              </p>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-card border border-canvas-border flex flex-col items-center text-center animate-fade-in" style={{ animationDelay: '0.2s' }}>
              <div className="w-14 h-14 rounded-full bg-peach-pale flex items-center justify-center text-peach mb-4">
                <Calendar className="w-7 h-7" />
              </div>
              <h3 className="font-bold text-lg mb-2">Important Dates</h3>
              <p className="text-canvas-muted text-sm">
                Deadline: <strong className="text-canvas-dark">30.12.2026 (5:00 PM)</strong><br />
                Results: <strong className="text-canvas-dark">04.01.2027</strong>
              </p>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-card border border-canvas-border flex flex-col items-center text-center animate-fade-in" style={{ animationDelay: '0.3s' }}>
              <div className="w-14 h-14 rounded-full bg-mustard/20 flex items-center justify-center text-mustard mb-4">
                <Trophy className="w-7 h-7" />
              </div>
              <h3 className="font-bold text-lg mb-2">Prize Pool</h3>
              <p className="text-canvas-muted text-sm">
                Cash prizes for top 3 winners<br />
                <strong className="text-canvas-dark">E-Certificates</strong> for all!
              </p>
            </div>
          </div>

          <div className="grid lg:grid-cols-2 gap-10 mb-16">

            {/* Left Column */}
            <div className="space-y-10">

              {/* Prize Pool Details */}
              <section className="bg-white rounded-3xl p-8 shadow-card border border-canvas-border relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-mustard/10 rounded-bl-full -z-10"></div>
                <h2 className="font-display font-bold text-2xl text-canvas-dark mb-6 flex items-center gap-3">
                  <Trophy className="w-6 h-6 text-mustard" /> Prize Pool & Rewards
                </h2>
                <div className="space-y-4">
                  {[
                    { rank: '1st Winner', prize: '₹1,100 Cash Prize', cert: 'Winner E-Certificate', color: 'bg-yellow-100 text-yellow-800 border-yellow-200' },
                    { rank: '2nd Winner', prize: '₹500 Cash Prize', cert: 'Winner E-Certificate', color: 'bg-gray-100 text-gray-800 border-gray-200' },
                    { rank: '3rd Winner', prize: '₹300 Cash Prize', cert: 'Winner E-Certificate', color: 'bg-orange-100 text-orange-800 border-orange-200' },
                  ].map((p, i) => (
                    <div key={i} className={`flex items-center justify-between p-4 rounded-2xl border ${p.color}`}>
                      <div>
                        <div className="font-bold text-lg">{p.rank}</div>
                        <div className="text-sm opacity-80">+ {p.cert}</div>
                      </div>
                      <div className="font-black text-2xl">{p.prize.split(' ')[0]}</div>
                    </div>
                  ))}
                  <div className="flex items-center gap-3 p-4 rounded-2xl bg-teal-pale border border-teal-100 text-teal-900 mt-2">
                    <CheckCircle2 className="w-5 h-5 text-teal shrink-0" />
                    <div>
                      <div className="font-bold">All Participants</div>
                      <div className="text-sm">Digital Participation E-Certificate</div>
                    </div>
                  </div>
                </div>
              </section>

              {/* How to Participate */}
              <section id="how-to-participate" className="bg-white rounded-3xl p-8 shadow-card border border-canvas-border relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-peach-pale rounded-bl-full -z-10"></div>
                <h2 className="font-display font-bold text-2xl text-canvas-dark mb-6 flex items-center gap-3">
                  <Mail className="w-6 h-6 text-peach" /> How to Participate
                </h2>

                <div className="space-y-6 relative before:absolute before:content-[''] before:inset-0 before:ml-5 before:-translate-x-px before:h-full before:w-0.5 before:bg-gradient-to-b before:from-peach before:via-mustard before:to-teal">

                  {/* Step 1 */}
                  <div className="relative flex items-start justify-between group">
                    <div className="flex items-center justify-center w-10 h-10 rounded-full border-4 border-white bg-peach text-white font-bold shrink-0 shadow-md relative z-10" style={{ backgroundColor: '#F4A47A' }}>
                      1
                    </div>
                    <div className="w-[calc(100%-3.5rem)] p-4 rounded-2xl border border-canvas-border bg-white shadow-sm">
                      <h3 className="font-bold text-lg mb-1">Create</h3>
                      <p className="text-sm text-canvas-muted">
                        Complete your original artwork on drawing paper or canvas.
                        <br /><span className="text-xs mt-1 block">Mediums allowed: Watercolor, Acrylic, Oil Pastel, Sketching, or Mixed Media.</span>
                      </p>
                    </div>
                  </div>

                  {/* Step 2 */}
                  <div className="relative flex items-start justify-between group">
                    <div className="flex items-center justify-center w-10 h-10 rounded-full border-4 border-white bg-mustard text-white font-bold shrink-0 shadow-md relative z-10" style={{ backgroundColor: '#E8843A' }}>
                      2
                    </div>
                    <div className="w-[calc(100%-3.5rem)] p-4 rounded-2xl border border-canvas-border bg-white shadow-sm">
                      <h3 className="font-bold text-lg mb-1">Pay & Photograph</h3>
                      <p className="text-sm text-canvas-muted">
                        Pay the entry fee (see table) and take a clear, high-resolution photo of your artwork and the payment proof.
                      </p>
                    </div>
                  </div>

                  {/* Step 3 */}
                  <div className="relative flex items-start justify-between group">
                    <div className="flex items-center justify-center w-10 h-10 rounded-full border-4 border-white bg-teal text-white font-bold shrink-0 shadow-md relative z-10" style={{ backgroundColor: '#2A7D6F' }}>
                      3
                    </div>
                    <div className="w-[calc(100%-3.5rem)] p-4 rounded-2xl border border-canvas-border bg-white shadow-sm">
                      <h3 className="font-bold text-lg mb-1">Submit via Email</h3>
                      <p className="text-sm text-canvas-muted">
                        Email the photos to <strong>swasticanvas26@gmail.com</strong> with the required details below.
                      </p>
                    </div>
                  </div>

                </div>

                <div className="mt-8 bg-blue-50 border border-blue-100 rounded-2xl p-5">
                  <h4 className="font-bold text-blue-900 mb-3 flex items-center gap-2">
                    <Info className="w-4 h-4" /> Required Details in Email:
                  </h4>
                  <ul className="text-sm text-blue-800 space-y-2 list-disc list-inside">
                    <li>Participant's Full Name, Age, Sex, Father’s name</li>
                    <li>Contact Phone Number (Mobile/WhatsApp/Email ID)</li>
                    <li>Title of Artwork & Medium Used</li>
                    <li>Proof of Entry Fee Payment</li>
                  </ul>
                </div>

                <a href="mailto:swasticanvas26@gmail.com?subject=Swasti%20Canvas%20National%20Art%20Competition%20Entry" className="mt-6 btn-teal w-full py-4 flex items-center justify-center gap-2 text-lg">
                  <Mail className="w-5 h-5" /> Submit Artwork via Email
                </a>
              </section>

            </div>

            {/* Right Column */}
            <div className="space-y-10">

              {/* Fee Structure */}
              <section id="entry-fee" className="bg-white rounded-3xl p-8 shadow-card border border-canvas-border relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-teal-pale rounded-bl-full -z-10"></div>
                <div className="mb-6">
                  <h2 className="font-display font-bold text-2xl text-canvas-dark flex items-center gap-3">
                    <FileText className="w-6 h-6 text-teal" /> Entry Fee Structure
                  </h2>
                  <p className="text-sm text-mustard font-semibold mt-1">✨ Limited Time Discount Applied!</p>
                </div>

                <div className="overflow-x-auto rounded-2xl border border-canvas-border">
                  <table className="w-full text-left text-sm whitespace-nowrap">
                    <thead className="bg-canvas-bg text-canvas-dark">
                      <tr>
                        <th className="px-6 py-4 font-bold border-b border-canvas-border">Number of Artworks</th>
                        <th className="px-6 py-4 font-bold border-b border-canvas-border">Standard Fee</th>
                        <th className="px-6 py-4 font-bold border-b border-canvas-border text-teal">Discounted Fee</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-canvas-border">
                      {[
                        { num: '1 Artwork', old: '₹300', new: '₹150' },
                        { num: '2 Artworks', old: '₹600', new: '₹270' },
                        { num: '3 Artworks', old: '₹900', new: '₹390' },
                        { num: '4 Artworks', old: '₹1200', new: '₹500' },
                        { num: '5 Artworks', old: '₹1600', new: '₹600' },
                        { num: '10 Artworks', old: '₹3000', new: '₹1000' },
                      ].map((row, i) => (
                        <tr key={i} className="hover:bg-canvas-bg transition-colors">
                          <td className="px-6 py-4 font-medium text-canvas-dark">{row.num}</td>
                          <td className="px-6 py-4 text-canvas-muted line-through">{row.old}</td>
                          <td className="px-6 py-4 font-bold text-teal text-base">{row.new}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </section>

              {/* T&C */}
              <section className="bg-white rounded-3xl p-8 shadow-card border border-canvas-border">
                <h2 className="font-display font-bold text-xl text-canvas-dark mb-6 flex items-center gap-3">
                  <Info className="w-5 h-5 text-canvas-muted" /> Terms & Conditions
                </h2>

                <div className="space-y-4 text-sm text-canvas-muted">
                  <div className="flex gap-3">
                    <div className="w-1.5 h-1.5 rounded-full bg-teal mt-2 shrink-0"></div>
                    <div><strong className="text-canvas-dark">Eligibility:</strong> Open strictly to children between 7 and 16 years of age.</div>
                  </div>
                  <div className="flex gap-3">
                    <div className="w-1.5 h-1.5 rounded-full bg-teal mt-2 shrink-0"></div>
                    <div><strong className="text-canvas-dark">Originality:</strong> All entries must be original creations. Copied, traced, or AI-generated work will lead to immediate disqualification.</div>
                  </div>
                  <div className="flex gap-3">
                    <div className="w-1.5 h-1.5 rounded-full bg-teal mt-2 shrink-0"></div>
                    <div><strong className="text-canvas-dark">Prize Disbursement:</strong> Cash prizes and E-Certificates will be distributed to winners via email/digital transfer after final judging results are declared. Account details of the winner/guardian will be asked later.</div>
                  </div>
                  <div className="flex gap-3">
                    <div className="w-1.5 h-1.5 rounded-full bg-teal mt-2 shrink-0"></div>
                    <div><strong className="text-canvas-dark">Submission Format:</strong> Files must be sent in JPEG, PNG, or PDF format via email. Physical artwork does not need to be posted unless specified for top award verification.</div>
                  </div>
                  <div className="flex gap-3">
                    <div className="w-1.5 h-1.5 rounded-full bg-teal mt-2 shrink-0"></div>
                    <div><strong className="text-canvas-dark">Fee Policy:</strong> Entry fees are strictly non-refundable and non-transferable under any circumstances once registered.</div>
                  </div>
                  <div className="flex gap-3">
                    <div className="w-1.5 h-1.5 rounded-full bg-teal mt-2 shrink-0"></div>
                    <div><strong className="text-canvas-dark">Copyright & Usage:</strong> Participants retain ownership of their artwork, but Swasti Canvas reserves the right to display submissions on social media channels, promotional posters, and the official website.</div>
                  </div>
                  <div className="flex gap-3">
                    <div className="w-1.5 h-1.5 rounded-full bg-teal mt-2 shrink-0"></div>
                    <div><strong className="text-canvas-dark">Judging Criteria:</strong> Evaluation will be based on creativity, original interpretation of theme, technique, and overall artistic impact. The decision of the Swasti Canvas judging panel is final and binding.</div>
                  </div>
                </div>
              </section>

            </div>
          </div>
        </div>
      </main>

      <MobileBottomNav />
    </MainLayout>
  )
}
