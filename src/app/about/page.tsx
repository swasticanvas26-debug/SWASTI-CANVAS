import MainLayout from '@/components/layout/MainLayout'
import Navbar from '@/components/layout/Navbar'
import MobileBottomNav from '@/components/layout/MobileBottomNav'
import { getAppUser } from '@/lib/auth'

export const dynamic = 'force-dynamic'

export default async function AboutPage() {
  const user = await getAppUser()

  return (
    <MainLayout>
      <Navbar user={user} />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12 md:py-20 animate-fade-in">
        <h1 className="font-display font-bold text-4xl text-canvas-dark mb-4">About Us</h1>
        <p className="text-canvas-muted mb-10">Art for Everyone.</p>
        
        <div className="space-y-6 bg-white/60 backdrop-blur-md rounded-2xl p-6 md:p-10 shadow-card border border-canvas-border text-canvas-muted leading-relaxed">
          
          <p>
            <strong className="text-canvas-dark font-bold">Swasti Canvas</strong> is a vibrant art platform based in <strong className="text-canvas-dark font-bold">Haryana</strong>, dedicated to celebrating, promoting, and making Indian art accessible to all. Guided by our belief that <strong className="text-canvas-dark font-bold">“Art for Everyone,”</strong> we aim to create meaningful connections between artists, art lovers, collectors, connoisseurs, and enthusiasts across India and beyond.
          </p>
          
          <p>
            We believe that art is not limited to galleries or collectors—it is an experience that can inspire, connect, and enrich everyone. Every artwork tells a unique story: a story of heritage, culture, imagination, innovation, emotion, and bold creativity. At Swasti Canvas, we strive to bring these stories closer to people and encourage a deeper appreciation of Indian art and its diverse artistic traditions.
          </p>
          
          <p>
            Swasti Canvas provides a platform for <strong className="text-canvas-dark font-bold">emerging, mid-career, and established artists</strong> to showcase their creativity and reach a wider audience. Our thoughtfully curated collection brings together diverse artistic expressions, allowing art enthusiasts and collectors to discover original and inspiring works by talented artists.
          </p>
          
          <p>
            Born out of a deep love for Indian art and a vision to share its creative richness with the world, <strong className="text-canvas-dark font-bold">Swasti Canvas is more than an art platform—it is a space for artistic discovery, dialogue, and engagement.</strong> We are committed to nurturing meaningful relationships between artists and audiences while supporting talented artists in their creative journeys.
          </p>
          
          <p>
            Imagine entering a space where every piece of art speaks to you—where tradition meets contemporary expression, heritage blends with innovation, and creativity knows no boundaries. That is the spirit of Swasti Canvas.
          </p>
          
          <p>
            Our mission is to make art more approachable, accessible, and engaging while promoting exceptional artistic talent. We endeavour to create a welcoming space where everyone—from a first-time art enthusiast to a seasoned collector—can discover, appreciate, and connect with art.
          </p>
          
          <p>
            At Swasti Canvas, we celebrate creativity in all its forms and believe that art has the power to inspire, connect, and transform.
          </p>

          <p className="text-xl font-display font-bold text-teal mt-8 text-center">
            Swasti Canvas — Art for Everyone
          </p>

        </div>
      </div>
      <MobileBottomNav />
    </MainLayout>
  )
}
