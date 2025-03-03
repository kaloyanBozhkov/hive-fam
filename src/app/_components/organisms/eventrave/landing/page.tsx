import { Button } from "../../../shadcn/Button.shadcn";
import {
  Calendar,
  ChevronRight,
  BarChart3,
  Globe,
  Ticket,
  QrCode,
  Palette,
  CheckCircle,
  Users,
  Link2,
  Banknote,
  Quote,
} from "lucide-react";
import Link from "next/link";
import type { ReactNode } from "react";
import AnimatedText from "./AnimatedText";
import Stack from "../../../layouts/Stack.layout";

export default function LandingPage({ orgId }: { orgId: string }) {
  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <header className="border-b border-gray-800">
        <div className="container mx-auto flex items-center justify-between px-4 py-4">
          {BrandLogo}
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
            <Button variant="ghost">Log in</Button>
            <Button variant="default">Sign up</Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 md:py-32">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-3xl text-center text-primary-foreground">
            <Stack className="mb-6 items-center gap-0 text-4xl font-bold md:text-6xl">
              <h1>Your events deserve</h1>
              <AnimatedText className="opacity-90" />
            </Stack>
            <p className="mb-8 text-xl text-gray-400">
              All-in-one solution for event organizers to create websites, sell
              tickets, and track metrics with customizable branding and much
              more.
            </p>
            <div className="flex flex-col items-stretch justify-center gap-4 sm:flex-row">
              <Link href="/eventrave/signup" target="_blank">
                <Button size="lg" className="text-lg" variant="secondary">
                  Get started for free
                  <ChevronRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link href="https://kempwestent.com" target="_blank">
                <Button size="lg" variant="ghost" className="text-lg">
                  See demo
                </Button>
              </Link>
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
                <img
                  src={`/assets/eventrave/logo.jpg`}
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
              icon={<Globe className="h-8 w-8 text-primary-foreground" />}
              title="Custom Website & SEO"
              description="Quickly setup an efficient event website."
            />
            <FeatureCard
              icon={<Calendar className="h-8 w-8 text-primary-foreground" />}
              title="Event Management"
              description="Easily manage past and upcoming events from a single dashboard."
            />
            <FeatureCard
              icon={<Ticket className="h-8 w-8 text-primary-foreground" />}
              title="Ticket Sales, 0% fees"
              description="Sell tickets directly through your website with secure payment processing."
            />
            <FeatureCard
              icon={<BarChart3 className="h-8 w-8 text-primary-foreground" />}
              title="Analytics & Metrics"
              description="Track attendance, sales, and engagement with detailed analytics."
            />
            <FeatureCard
              icon={<Palette className="h-8 w-8 text-primary-foreground" />}
              title="Brand Customization"
              description="Easily customize your website to match your brand identity and style."
            />
            <FeatureCard
              icon={<QrCode className="h-8 w-8 text-primary-foreground" />}
              title="Branded QR Codes"
              description="Generate branded QR codes for easy check-in and ticket validation."
            />
            <FeatureCard
              icon={<Users className="h-8 w-8 text-primary-foreground" />}
              title="Collaborate"
              description="Different roles for different people. Add ticket scanners, event managers or admins."
            />
            <FeatureCard
              icon={<Link2 className="h-8 w-8 text-primary-foreground" />}
              title="Link Tree"
              description="Sharable links, all in one place, including usage metrics."
            />
            <FeatureCard
              icon={<Banknote className="h-8 w-8 text-primary-foreground" />}
              title="Automatic Payouts"
              description="Your event earnings are automatically transferred to your bank account every few days."
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

          <div className="mx-auto grid max-w-4xl gap-8 md:grid-cols-4">
            <StepCard
              number={1}
              title="Create your event"
              description="Add your event details, upload poster images or vidoes, setup ticket types, prices and availability."
            />
            <StepCard
              number={2}
              title="Share & Sell"
              description="Share your event page with your audience and start selling tickets."
            />
            <StepCard
              number={3}
              title="Scan & Check-In"
              description="Scan QR codes to check-in attendees and validate tickets."
            />
            <StepCard
              number={4}
              title="Track & Analyze"
              description="Track your event's progress and analyze your audience's engagement."
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
                  "Customizable landing page banners",
                  "Custom domain support",
                ].map((item, i) => (
                  <li key={i} className="flex items-start">
                    <CheckCircle className="mr-2 h-6 w-6 flex-shrink-0 text-primary" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
              {/* <Button className="mt-8">Explore customization options</Button> */}
            </div>
            <div className="rounded-xl bg-gray-900 p-6">
              <img
                src="/assets/eventrave/logo.jpg"
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
      <section className="bg-gray-950 py-20" id="testimonials">
        <div className="container mx-auto px-4">
          <div className="mb-16 text-center">
            <h2 className="mb-4 text-3xl font-bold md:text-4xl">
              What event organizers say
            </h2>
            <p className="mx-auto max-w-2xl text-xl text-gray-400">
              Join our growing list of satisfied event organizers using
              EventRave.
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-3">
            <TestimonialCard
              quote="EventRave transformed how we manage our music festivals. Analytics alone increased our revenue by 30%."
              author="Dennis Westman"
              role="Kemp-West (ent.)"
            />
            <TestimonialCard
              quote="I customized my website and QRs to match my brand. Everything looks professional."
              author="Kaloyan D. Bozhkov"
              role="Urban Spotlight"
            />
            <TestimonialCard
              quote="Setting up limited availability tickets created urgency and helped us sell faster than ever."
              author="DJ Daccatta"
              role="Evolve"
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
                "Custom ticket types",
                "Basic analytics",
                "Email support",
                "Link Tree",
                "Only 1 team seat",
              ]}
              buttonText="Get started"
              popular={false}
            />
            <PricingCard
              title="Pro"
              price="$19"
              period="/month"
              description="For growing event businesses"
              features={[
                "Unlimited events",
                "Advanced customization",
                "Branded QR codes",
                "Detailed analytics",
                "Custom Ticket Types",
                "Limited availability tickets",
                "Priority support",
                "Link Tree with Metrics",
                "Unlimited team seats",
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
              Join the gorwing number of event organizers who trust EventRave to
              power their events.
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
              {BrandLogo}
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
                    href="#features"
                    className="text-gray-400 transition-colors hover:text-white"
                  >
                    Features
                  </Link>
                </li>
                <li>
                  <Link
                    href="#pricing"
                    className="text-gray-400 transition-colors hover:text-white"
                  >
                    Pricing
                  </Link>
                </li>
                <li>
                  <Link
                    href="#testimonials"
                    className="text-gray-400 transition-colors hover:text-white"
                  >
                    Testimonials
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
                href="http://instagram.com/event.rave"
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
function FeatureCard({
  icon,
  title,
  description,
}: {
  icon: ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="rounded-xl border border-gray-800 bg-gray-900 p-6 transition-colors hover:border-primary">
      <div className="mb-4">{icon}</div>
      <h3 className="mb-2 text-xl font-semibold">{title}</h3>
      <p className="text-gray-400">{description}</p>
    </div>
  );
}

// Component for step cards
function StepCard({
  number,
  title,
  description,
}: {
  number: number;
  title: string;
  description: string;
}) {
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
function TestimonialCard({
  quote,
  author,
  role,
}: {
  quote: string;
  author: string;
  role: string;
}) {
  return (
    <div className="rounded-xl border border-gray-800 bg-gray-900 p-6">
      <div className="mb-4 text-primary-foreground">
        <Quote className="h-8 w-8" />
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
      <div className="p-6">
        <h3 className="mb-2 text-xl font-semibold">{title}</h3>
        <div className="mb-4">
          <span className="text-4xl font-bold">{price}</span>
          <span className="text-gray-400">{period}</span>
        </div>
        <p className="mb-6 text-gray-400">{description}</p>
        <Button className="mb-6 w-full" variant="action">
          {buttonText}
        </Button>
        <ul className="space-y-3">
          {features.map((feature, i) => (
            <li key={i} className="flex items-start">
              <CheckCircle className="mr-2 h-5 w-5 flex-shrink-0 text-primary-foreground" />
              <span className="text-sm">{feature}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

const BrandLogo = (
  <Link href="/">
    <div className="flex items-center gap-2">
      <img
        src="/assets/eventrave/logo.jpg"
        alt="EventRave logo"
        className="h-6 w-auto"
      />
      <span className="text-xl font-bold">EventRave</span>
    </div>
  </Link>
);
