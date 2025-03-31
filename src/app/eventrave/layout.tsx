import { Check, Star } from "lucide-react";
import EventRaveLogo from "@/app/_components/molecules/EventRaveLogo.molecule";

export default function EventRaveLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col md:flex-row">
      <div className="flex flex-col bg-[#1e2a47] p-8 text-white md:w-1/2 md:p-12 -lg:hidden">
        <div className="mb-12">
          <EventRaveLogo />
          <h2 className="mb-6 text-2xl font-bold">
            Why choose EventRave for your event ticketing?
          </h2>

          <ul className="space-y-4">
            <li className="flex items-start">
              <Check className="mr-2 mt-0.5 h-5 w-5 flex-shrink-0 text-green-400" />
              <span>Simple, easy-to-use platform</span>
            </li>
            <li className="flex items-start">
              <Check className="mr-2 mt-0.5 h-5 w-5 flex-shrink-0 text-green-400" />
              <span>Lowest ticketing fees</span>
            </li>
            <li className="flex items-start">
              <Check className="mr-2 mt-0.5 h-5 w-5 flex-shrink-0 text-green-400" />
              <span>Dedicated customer support team</span>
            </li>
            <li className="flex items-start">
              <Check className="mr-2 mt-0.5 h-5 w-5 flex-shrink-0 text-green-400" />
              <span>Your own branded website</span>
            </li>
            <li className="flex items-start">
              <Check className="mr-2 mt-0.5 h-5 w-5 flex-shrink-0 text-green-400" />
              <span>Powerful features</span>
            </li>
          </ul>
        </div>

        <div className="mt-auto">
          {/* <div className="mb-8 border-t border-gray-700 pt-8">
            <p className="mb-6 text-lg font-medium">
              10,000+ communities and organisers worldwide sell with EventRave
            </p>

            <div className="grid grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div
                  key={i}
                  className="flex items-center justify-center rounded-md bg-gray-800 bg-opacity-50 p-2"
                >
                  <Image
                    src={`/placeholder.svg?height=40&width=80`}
                    alt={`Partner logo ${i}`}
                    width={80}
                    height={40}
                    className="opacity-70"
                  />
                </div>
              ))}
            </div>
          </div> */}

          <div className="border-t border-gray-700 pt-8">
            <div className="flex items-center gap-4">
              <div className="flex-shrink-0">
                <img
                  src="/assets/eventrave/dennis-westman.webp"
                  alt="Testimonial avatar"
                  width={120}
                  height={120}
                  className="size-[120px] rounded-full object-cover"
                />
              </div>
              <div>
                <div className="mb-2 flex text-yellow-400">
                  <Star className="mr-2 h-4 w-4" fill="currentColor" />
                  <Star className="mr-2 h-4 w-4" fill="currentColor" />
                  <Star className="mr-2 h-4 w-4" fill="currentColor" />
                  <Star className="mr-2 h-4 w-4" fill="currentColor" />
                  <Star className="mr-2 h-4 w-4" fill="currentColor" />
                </div>
                <p className="mb-2 text-sm">
                  Fantastic customer service. I called and talked to real people
                  who was patient and friendly.
                </p>
                <p className="font-medium">Dennis Westman</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-center bg-black p-8 md:w-1/2 md:p-12 -lg:flex-1">
        {children}
      </div>
    </div>
  );
}
