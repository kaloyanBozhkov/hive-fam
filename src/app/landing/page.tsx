import { Button } from "../_components/shadcn/Button.shadcn";
import {
  Calendar,
  ChevronRight,
  BarChart3,
  Globe,
  Ticket,
  QrCode,
  Palette,
  CheckCircle,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <header className="border-b border-gray-800">
        <div className="container mx-auto flex items-center justify-between px-4 py-4">
          <div className="flex items-center gap-2">
            <Ticket className="h-6 w-6 text-primary" />
            <span className="text-xl font-bold">EventRave</span>
          </div>
          <nav className="hidden items-center gap-8 md:flex">
            <Link
              href="#features"
              className="text-sm text-gray-400 transition-colors hover:text-white"
            >
              Features
            </Link>
            <Link
              href="#how-it-works"
              className="text-sm text-gray-400 transition-colors hover:text-white"
            >
              How it works
            </Link>
            <Link
              href="#pricing"
              className="text-sm text-gray-400 transition-colors hover:text-white"
            >
              Pricing
            </Link>
          </nav>
          <div className="flex items-center gap-4">
            <Button variant="ghost" className="text-gray-400 hover:text-white">
              Log in
            </Button>
            <Button>Sign up</Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 md:py-32">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-3xl text-center">
            <h1 className="mb-6 text-4xl font-bold md:text-6xl">
              Your events deserve a{" "}
              <span className="text-primary">better platform</span>
            </h1>
            <p className="mb-8 text-xl text-gray-400">
              All-in-one solution for event organizers to create websites, sell
              tickets, and track metrics with customizable branding.
            </p>
            <div className="flex flex-col justify-center gap-4 sm:flex-row">
              <Button size="lg" className="text-lg">
                Get started for free
                <ChevronRight className="ml-2 h-5 w-5" />
              </Button>
              <Button size="lg" variant="outline" className="text-lg">
                See demo
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Trusted By Section */}
      <section className="border-b border-t border-gray-800 py-12">
        <div className="container mx-auto px-4">
          <p className="mb-8 text-center text-gray-500">
            Trusted by event organizers worldwide
          </p>
          <div className="flex flex-wrap items-center justify-center gap-8 md:gap-16">
            {[1, 2, 3, 4, 5].map((i) => (
              <div
                key={i}
                className="opacity-50 transition-opacity hover:opacity-100"
              >
                <Image
                  src={`/placeholder.svg?height=30&width=120`}
                  alt={`Partner logo ${i}`}
                  width={120}
                  height={30}
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20">
        <div className="container mx-auto px-4">
          <div className="mb-16 text-center">
            <h2 className="mb-4 text-3xl font-bold md:text-4xl">
              Everything you need to run successful events
            </h2>
            <p className="mx-auto max-w-2xl text-xl text-gray-400">
              Our platform provides all the tools you need to create, promote,
              and manage your events.
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            <FeatureCard
              icon={<Globe className="h-8 w-8 text-primary" />}
              title="Custom Website & SEO"
              description="Create a beautiful event website optimized for search engines to attract more attendees."
            />
            <FeatureCard
              icon={<Calendar className="h-8 w-8 text-primary" />}
              title="Event Management"
              description="Easily manage past and upcoming events from a single dashboard."
            />
            <FeatureCard
              icon={<Ticket className="h-8 w-8 text-primary" />}
              title="Ticket Sales"
              description="Sell tickets directly through your website with secure payment processing."
            />
            <FeatureCard
              icon={<BarChart3 className="h-8 w-8 text-primary" />}
              title="Analytics & Metrics"
              description="Track attendance, sales, and engagement with detailed analytics."
            />
            <FeatureCard
              icon={<Palette className="h-8 w-8 text-primary" />}
              title="Brand Customization"
              description="Customize your event pages to match your brand identity and style."
            />
            <FeatureCard
              icon={<QrCode className="h-8 w-8 text-primary" />}
              title="Custom QR Codes"
              description="Generate branded QR codes for easy check-in and ticket validation."
            />
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="bg-gray-950 py-20">
        <div className="container mx-auto px-4">
          <div className="mb-16 text-center">
            <h2 className="mb-4 text-3xl font-bold md:text-4xl">
              How EventRave works
            </h2>
            <p className="mx-auto max-w-2xl text-xl text-gray-400">
              Get your event online in minutes with our simple setup process.
            </p>
          </div>

          <div className="mx-auto grid max-w-4xl gap-8 md:grid-cols-3">
            <StepCard
              number="1"
              title="Create your event"
              description="Add your event details, upload images, and customize your event page."
            />
            <StepCard
              number="2"
              title="Set up tickets"
              description="Create custom ticket types with different prices and limited availability."
            />
            <StepCard
              number="3"
              title="Share & sell"
              description="Publish your event page and start selling tickets immediately."
            />
          </div>
        </div>
      </section>

      {/* Showcase Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid items-center gap-12 md:grid-cols-2">
            <div>
              <h2 className="mb-6 text-3xl font-bold md:text-4xl">
                Customizable to match your brand
              </h2>
              <p className="mb-6 text-gray-400">
                Your event deserves a unique identity. With EventRave, you can
                customize every aspect of your event page to match your brand.
              </p>
              <ul className="space-y-4">
                {[
                  "Custom color schemes and typography",
                  "Branded QR codes for check-in",
                  "Custom ticket designs",
                  "Personalized email notifications",
                  "Custom domain support",
                ].map((item, i) => (
                  <li key={i} className="flex items-start">
                    <CheckCircle className="mr-2 h-6 w-6 flex-shrink-0 text-primary" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
              <Button className="mt-8">Explore customization options</Button>
            </div>
            <div className="rounded-xl bg-gray-900 p-6">
              <Image
                src="/placeholder.svg?height=400&width=500"
                alt="EventRave customization dashboard"
                width={500}
                height={400}
                className="rounded-lg"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="bg-gray-950 py-20">
        <div className="container mx-auto px-4">
          <div className="mb-16 text-center">
            <h2 className="mb-4 text-3xl font-bold md:text-4xl">
              What event organizers say
            </h2>
            <p className="mx-auto max-w-2xl text-xl text-gray-400">
              Join thousands of satisfied event organizers using EventRave.
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-3">
            <TestimonialCard
              quote="EventRave transformed how we manage our music festivals. The analytics alone have increased our revenue by 30%."
              author="Sarah Johnson"
              role="Festival Director"
            />
            <TestimonialCard
              quote="The customizable tickets and QR codes made our tech conference look so professional. Our attendees were impressed!"
              author="Michael Chen"
              role="Conference Organizer"
            />
            <TestimonialCard
              quote="Setting up limited availability tickets created urgency and helped us sell out our workshop series faster than ever."
              author="Emma Rodriguez"
              role="Workshop Coordinator"
            />
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20">
        <div className="container mx-auto px-4">
          <div className="mb-16 text-center">
            <h2 className="mb-4 text-3xl font-bold md:text-4xl">
              Simple, transparent pricing
            </h2>
            <p className="mx-auto max-w-2xl text-xl text-gray-400">
              Start for free, upgrade as you grow.
            </p>
          </div>

          <div className="mx-auto grid max-w-5xl gap-8 md:grid-cols-3">
            <PricingCard
              title="Free"
              price="$0"
              description="Perfect for getting started"
              features={[
                "Up to 3 events",
                "Basic customization",
                "Standard QR codes",
                "Basic analytics",
                "Email support",
              ]}
              buttonText="Get started"
              popular={false}
            />
            <PricingCard
              title="Pro"
              price="$29"
              period="/month"
              description="For growing event businesses"
              features={[
                "Unlimited events",
                "Advanced customization",
                "Branded QR codes",
                "Detailed analytics",
                "Priority support",
                "Custom ticket types",
                "Limited availability features",
              ]}
              buttonText="Try Pro"
              popular={true}
            />
            <PricingCard
              title="Enterprise"
              price="Custom"
              description="For large-scale event operations"
              features={[
                "Everything in Pro",
                "Custom domain",
                "API access",
                "Dedicated account manager",
                "Custom integrations",
                "On-site support",
                "Advanced security features",
              ]}
              buttonText="Contact sales"
              popular={false}
            />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-primary py-20 text-primary-foreground">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="mb-6 text-3xl font-bold md:text-4xl">
              Ready to transform your events?
            </h2>
            <p className="mb-8 text-xl">
              Join thousands of event organizers who trust EventRave to power
              their events.
            </p>
            <Button size="lg" variant="secondary" className="text-lg">
              Get started for free
              <ChevronRight className="ml-2 h-5 w-5" />
            </Button>
            <p className="mt-4 text-sm opacity-80">
              No credit card required. Cancel anytime.
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-800 py-12">
        <div className="container mx-auto px-4">
          <div className="grid gap-8 md:grid-cols-4">
            <div>
              <div className="mb-4 flex items-center gap-2">
                <Ticket className="h-6 w-6 text-primary" />
                <span className="text-xl font-bold">EventRave</span>
              </div>
              <p className="text-gray-400">
                The all-in-one platform for event organizers to create, manage,
                and grow their events.
              </p>
            </div>
            <div>
              <h3 className="mb-4 font-semibold">Product</h3>
              <ul className="space-y-2">
                <li>
                  <Link
                    href="#"
                    className="text-gray-400 transition-colors hover:text-white"
                  >
                    Features
                  </Link>
                </li>
                <li>
                  <Link
                    href="#"
                    className="text-gray-400 transition-colors hover:text-white"
                  >
                    Pricing
                  </Link>
                </li>
                <li>
                  <Link
                    href="#"
                    className="text-gray-400 transition-colors hover:text-white"
                  >
                    Testimonials
                  </Link>
                </li>
                <li>
                  <Link
                    href="#"
                    className="text-gray-400 transition-colors hover:text-white"
                  >
                    Integrations
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="mb-4 font-semibold">Resources</h3>
              <ul className="space-y-2">
                <li>
                  <Link
                    href="#"
                    className="text-gray-400 transition-colors hover:text-white"
                  >
                    Blog
                  </Link>
                </li>
                <li>
                  <Link
                    href="#"
                    className="text-gray-400 transition-colors hover:text-white"
                  >
                    Help Center
                  </Link>
                </li>
                <li>
                  <Link
                    href="#"
                    className="text-gray-400 transition-colors hover:text-white"
                  >
                    Guides
                  </Link>
                </li>
                <li>
                  <Link
                    href="#"
                    className="text-gray-400 transition-colors hover:text-white"
                  >
                    API Docs
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="mb-4 font-semibold">Company</h3>
              <ul className="space-y-2">
                <li>
                  <Link
                    href="#"
                    className="text-gray-400 transition-colors hover:text-white"
                  >
                    About
                  </Link>
                </li>
                <li>
                  <Link
                    href="#"
                    className="text-gray-400 transition-colors hover:text-white"
                  >
                    Careers
                  </Link>
                </li>
                <li>
                  <Link
                    href="#"
                    className="text-gray-400 transition-colors hover:text-white"
                  >
                    Contact
                  </Link>
                </li>
                <li>
                  <Link
                    href="#"
                    className="text-gray-400 transition-colors hover:text-white"
                  >
                    Privacy Policy
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          <div className="mt-12 flex flex-col items-center justify-between border-t border-gray-800 pt-8 md:flex-row">
            <p className="text-sm text-gray-500">
              © {new Date().getFullYear()} EventRave. All rights reserved.
            </p>
            <div className="mt-4 flex gap-4 md:mt-0">
              <Link
                href="#"
                className="text-gray-400 transition-colors hover:text-white"
              >
                <span className="sr-only">Twitter</span>
                <svg
                  className="h-5 w-5"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                </svg>
              </Link>
              <Link
                href="#"
                className="text-gray-400 transition-colors hover:text-white"
              >
                <span className="sr-only">LinkedIn</span>
                <svg
                  className="h-5 w-5"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path
                    fillRule="evenodd"
                    d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"
                    clipRule="evenodd"
                  />
                </svg>
              </Link>
              <Link
                href="#"
                className="text-gray-400 transition-colors hover:text-white"
              >
                <span className="sr-only">Instagram</span>
                <svg
                  className="h-5 w-5"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path
                    fillRule="evenodd"
                    d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z"
                    clipRule="evenodd"
                  />
                </svg>
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

// Component for feature cards
function FeatureCard({ icon, title, description }) {
  return (
    <div className="rounded-xl border border-gray-800 bg-gray-900 p-6 transition-colors hover:border-primary">
      <div className="mb-4">{icon}</div>
      <h3 className="mb-2 text-xl font-semibold">{title}</h3>
      <p className="text-gray-400">{description}</p>
    </div>
  );
}

// Component for step cards
function StepCard({ number, title, description }) {
  return (
    <div className="text-center">
      <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary text-xl font-bold text-primary-foreground">
        {number}
      </div>
      <h3 className="mb-2 text-xl font-semibold">{title}</h3>
      <p className="text-gray-400">{description}</p>
    </div>
  );
}

// Component for testimonial cards
function TestimonialCard({ quote, author, role }) {
  return (
    <div className="rounded-xl border border-gray-800 bg-gray-900 p-6">
      <div className="mb-4 text-primary">
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M11.9999 2C6.47691 2 1.99991 6.477 1.99991 12C1.99991 17.523 6.47691 22 11.9999 22C17.5229 22 21.9999 17.523 21.9999 12C21.9999 6.477 17.5229 2 11.9999 2Z"
            fill="currentColor"
            fillOpacity="0.2"
          />
          <path
            d="M9.08008 8.99999C9.32313 8.33166 9.78919 7.76807 10.4 7.40999C11.0108 7.05192 11.729 6.91902 12.4272 7.03873C13.1254 7.15843 13.7588 7.52152 14.215 8.06353C14.6713 8.60553 14.9211 9.29152 14.9201 9.99999C14.9201 12 11.9201 13 11.9201 13"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M12 17H12.01"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>
      <p className="mb-6 italic">{quote}</p>
      <div>
        <p className="font-semibold">{author}</p>
        <p className="text-sm text-gray-500">{role}</p>
      </div>
    </div>
  );
}

// Component for pricing cards
function PricingCard({
  title,
  price,
  period = "",
  description,
  features,
  buttonText,
  popular,
}: {
  title: string;
  price: string;
  period?: string;
  description: string;
  features: string[];
  buttonText: string;
  popular: boolean;
}) {
  return (
    <div
      className={`rounded-xl border bg-gray-900 ${popular ? "border-primary" : "border-gray-800"} overflow-hidden`}
    >
      {popular && (
        <div className="bg-primary py-1 text-center text-sm font-medium text-primary-foreground">
          Most Popular
        </div>
      )}
      <div className="p-6">
        <h3 className="mb-2 text-xl font-semibold">{title}</h3>
        <div className="mb-4">
          <span className="text-4xl font-bold">{price}</span>
          <span className="text-gray-400">{period}</span>
        </div>
        <p className="mb-6 text-gray-400">{description}</p>
        <Button
          className={`mb-6 w-full ${popular ? "" : "bg-gray-800 hover:bg-gray-700"}`}
          variant={popular ? "default" : "outline"}
        >
          {buttonText}
        </Button>
        <ul className="space-y-3">
          {features.map((feature, i) => (
            <li key={i} className="flex items-start">
              <CheckCircle className="mr-2 h-5 w-5 flex-shrink-0 text-primary" />
              <span className="text-sm">{feature}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
