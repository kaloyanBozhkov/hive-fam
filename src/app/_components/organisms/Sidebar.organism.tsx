import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Link from "next/link";
import { LINKS } from "./StaffNav.organism";

export function Sidebar() {
  return (
    <aside className="h-full w-64 bg-white shadow-md" data-oid="tg96xy1">
      <div className="flex h-full flex-col space-y-6 py-4" data-oid="-:6r4fg">
        {Object.entries(LINKS).map(([key, section]) => (
          <div key={key} className="px-4" data-oid="ld2bj64">
            <h2
              className="mb-2 text-sm font-semibold text-gray-500"
              data-oid="_mwfxr6"
            >
              {section.label}
            </h2>
            <ul className="space-y-2" data-oid="6-jtu_s">
              {section.links.map((link) => (
                <li key={link.href} data-oid="qnnzjtz">
                  <Link
                    href={link.href}
                    className="flex items-center space-x-2 rounded-lg px-2 py-2 text-gray-600 hover:bg-gray-100"
                    data-oid="bk_0c:e"
                  >
                    <FontAwesomeIcon
                      icon={link.icon}
                      className="h-4 w-4"
                      data-oid="v3d3y6o"
                    />
                    <span data-oid="ea_n0t-">{link.label}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </aside>
  );
}
