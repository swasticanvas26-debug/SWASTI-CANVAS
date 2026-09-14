'use client'

import Link from 'next/link'
import { Mail, MapPin } from 'lucide-react'

export default function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-white/80 backdrop-blur-md border-t border-canvas-border mt-auto relative z-10 w-full">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          
          {/* Brand Info */}
          <div className="md:col-span-1 space-y-4">
            <Link href="/" className="flex items-center gap-2 inline-flex">
              <img src="/logo.jpg" alt="Logo" className="w-16 h-16 object-cover rounded-full shadow-teal" />
              <div className="flex flex-col justify-center">
                <div className="font-display font-bold text-teal text-xl tracking-tight leading-none">SWASTI</div>
                <div className="font-display font-bold text-teal-light text-[11px] tracking-widest leading-none mt-1">CANVAS</div>
                <div className="font-display font-bold text-teal-light text-[10px] tracking-widest leading-none mt-1">Art Work For Everyone</div>
              </div>
            </Link>
            <p className="text-canvas-muted text-sm leading-relaxed pr-4">
              Discovering, showcasing and purchasing authentic artwork from talented artists.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-display font-bold text-canvas-dark mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li><Link href="/" className="text-canvas-muted hover:text-teal text-sm transition-colors">Home</Link></li>
              <li><Link href="/about" className="text-canvas-muted hover:text-teal text-sm transition-colors">About Us</Link></li>
              <li><Link href="/artworks" className="text-canvas-muted hover:text-teal text-sm transition-colors">Browse Artworks</Link></li>
              <li><Link href="/login" className="text-canvas-muted hover:text-teal text-sm transition-colors">Sign In</Link></li>
              <li><Link href="/signup" className="text-canvas-muted hover:text-teal text-sm transition-colors">Register as Buyer or Seller</Link></li>
            </ul>
          </div>

          {/* Policies */}
          <div>
            <h3 className="font-display font-bold text-canvas-dark mb-4">Legal & Policies</h3>
            <ul className="space-y-2">
              <li><Link href="/faq" className="text-canvas-muted hover:text-teal text-sm transition-colors">FAQ</Link></li>
              <li><Link href="/terms" className="text-canvas-muted hover:text-teal text-sm transition-colors">Terms & Conditions</Link></li>
              <li><Link href="/privacy-policy" className="text-canvas-muted hover:text-teal text-sm transition-colors">Privacy Policy</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-display font-bold text-canvas-dark mb-4">Contact Us</h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-2.5">
                <Mail className="w-4 h-4 text-teal shrink-0 mt-0.5" />
                <a href="mailto:swasticanvas26@gmail.com" className="text-canvas-muted hover:text-teal text-sm transition-colors break-all">
                  swasticanvas26@gmail.com
                </a>
              </li>
              <li className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-teal shrink-0 mt-0.5" />
                <span className="text-canvas-muted text-sm leading-tight">
                  42, Jai Enclave Ext-III,<br/>
                  Near Indian Bank, Delhi Road Sampla,<br/>
                  District Rohtak, Haryana-124501
                </span>
              </li>
              <li className="flex items-center gap-2.5 pt-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="w-4 h-4 text-teal shrink-0"
                >
                  <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                  <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
                </svg>
                <a href="https://www.instagram.com/swasticanvas?stkn=YnNveTFoOXI4NHFy" target="_blank" rel="noopener noreferrer" className="text-canvas-muted hover:text-teal text-sm transition-colors">
                  Instagram
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-canvas-border mt-10 pt-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-canvas-muted text-xs">
            &copy; {currentYear} Swasti Canvas. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}
