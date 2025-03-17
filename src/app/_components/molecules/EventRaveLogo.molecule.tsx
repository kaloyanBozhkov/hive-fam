import Link from "next/link";

export default function EventRaveLogo() {
  return (
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
}
