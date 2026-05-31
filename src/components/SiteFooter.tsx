import { Link } from "@tanstack/react-router";
import { Facebook, Instagram, Linkedin, Youtube, Mail, Phone, MapPin } from "lucide-react";
import logo from "@/assets/logo-vsg.png";
import logoScaliolab from "@/assets/logo-scaliolab.png";
import { ADDRESSES, EMAIL, PHONE_NUMBERS, PHONE_TEL, WEBSITE } from "@/lib/contact";

export function SiteFooter() {
  return (
    <footer className="mt-24 border-t border-border bg-foreground text-background">
      <div className="container mx-auto px-4 lg:px-8 py-14">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-4">
          <div>
            <div className="flex items-center gap-2.5 mb-4">
              <img src={logo} alt="Visionary Salva Group" width={44} height={44} className="h-11 w-11 bg-background rounded-lg p-1" />
              <div>
                <div className="font-display font-bold">Visionary Salva Group</div>
                <div className="text-xs opacity-70">A Unit Of Vishwashi Advisory Service</div>
              </div>
            </div>
            <p className="text-sm opacity-80 leading-relaxed">
              Trusted admission consultancy helping students find the right course, university, and career — in India and abroad.
            </p>
            <div className="flex gap-2 mt-5">
              {[Facebook, Instagram, Linkedin, Youtube].map((Icon, i) => (
                <a key={i} href="#" className="h-9 w-9 grid place-items-center rounded-full bg-background/10 hover:bg-secondary transition-colors" aria-label="Social link">
                  <Icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>

          <div>
            <h4 className="font-display font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2 text-sm opacity-80">
              {[["/", "Home"], ["/courses", "Courses"], ["/colleges", "Colleges"], ["/about", "About Us"], ["/contact", "Contact"]].map(([to, label]) => (
                <li key={to}><Link to={to} className="hover:text-secondary transition-colors">{label}</Link></li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-display font-semibold mb-4">Top Courses</h4>
            <ul className="space-y-2 text-sm opacity-80">
              {["MBBS", "B.Tech", "MBA", "BDS", "B.Pharm", "MBBS Abroad"].map((c) => (
                <li key={c}><Link to="/courses" className="hover:text-secondary transition-colors">{c}</Link></li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-display font-semibold mb-4">Get in Touch</h4>
            <ul className="space-y-3 text-sm opacity-90">
              <li className="flex gap-2.5">
                <Phone className="h-4 w-4 mt-0.5 text-secondary shrink-0" />
                <div className="space-y-0.5">
                  {PHONE_NUMBERS.map((p, i) => (
                    <a key={p} href={`tel:${PHONE_TEL[i]}`} className="block hover:text-secondary">{p}</a>
                  ))}
                </div>
              </li>
              <li className="flex gap-2.5">
                <Mail className="h-4 w-4 mt-0.5 text-secondary shrink-0" />
                <a href={`mailto:${EMAIL}`} className="hover:text-secondary break-all">{EMAIL}</a>
              </li>
              {ADDRESSES.map((a) => (
                <li key={a.label} className="flex gap-2.5">
                  <MapPin className="h-4 w-4 mt-0.5 text-secondary shrink-0" />
                  <div>
                    <div className="font-semibold text-background">{a.label}</div>
                    <div className="opacity-80">{a.line}</div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-6 border-t border-background/10 flex flex-col md:flex-row gap-3 justify-between items-center text-xs opacity-70">
          <p>© {new Date().getFullYear()} Visionary Salva Group · {WEBSITE} · All rights reserved.</p>
          <div className="flex items-center gap-4">
            <a
              href="https://scaliolab.com"
              target="_blank"
              rel="noreferrer noopener"
              className="flex items-center gap-2 opacity-70 hover:opacity-100 transition-opacity"
            >
              <img src={logoScaliolab} alt="Scalio Lab" className="h-5 w-5 rounded-sm object-contain" />
              <span>Designed &amp; Managed by <strong>Scalio Lab</strong></span>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
