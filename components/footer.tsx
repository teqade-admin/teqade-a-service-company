"use client"

import Link from "next/link"
import { MapPin, Mail, Phone, Linkedin, Twitter } from "lucide-react"

const footerLinks = {
  company: [
    { label: "About", href: "#why-teqade" },
    { label: "Services", href: "#services" },
    { label: "Process", href: "#how-we-work" },
    { label: "Work", href: "#work" },
  ],
  contact: [
    { label: "info@teqade.com", href: "mailto:info@teqade.com", icon: Mail },
    { label: "+91 9952234440", href: "tel:+919952234440", icon: Phone },
  ],
}

export function Footer() {
  return (
    <footer className="border-t border-border/50 bg-card/20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Main Footer */}
        <div className="py-12 grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="md:col-span-2">
            <Link href="/" className="inline-flex items-center gap-2 mb-4">
              <span className="text-xl font-bold tracking-tight text-foreground">
                Teqade
              </span>
              <span className="text-primary">.</span>
            </Link>
            <p className="text-sm text-muted-foreground max-w-xs text-pretty mb-4">
              Product engineering for startups. We build dreams into scalable products.
            </p>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <MapPin className="h-4 w-4 text-primary" />
              <span>Chetpet, Chennai, India</span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-sm font-semibold text-foreground uppercase tracking-wider mb-4">
              Company
            </h3>
            <ul className="flex flex-col gap-3">
              {footerLinks.company.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors duration-200"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-sm font-semibold text-foreground uppercase tracking-wider mb-4">
              Contact
            </h3>
            <ul className="flex flex-col gap-3">
              {footerLinks.contact.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors duration-200"
                  >
                    <link.icon className="h-4 w-4 text-primary" />
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
            
            {/* Social Links */}
            <div className="mt-6 flex items-center gap-4">
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-primary transition-colors duration-200"
                aria-label="LinkedIn"
              >
                <Linkedin className="h-5 w-5" />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-primary transition-colors duration-200"
                aria-label="Twitter"
              >
                <Twitter className="h-5 w-5" />
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="py-6 border-t border-border/50 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-muted-foreground">
            {`© ${new Date().getFullYear()} Teqade Technologies Pvt. Ltd. All rights reserved.`}
          </p>
          <div className="flex items-center gap-6 text-sm text-muted-foreground">
            <Link href="#" className="hover:text-foreground transition-colors duration-200">
              Privacy Policy
            </Link>
            <Link href="#" className="hover:text-foreground transition-colors duration-200">
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
