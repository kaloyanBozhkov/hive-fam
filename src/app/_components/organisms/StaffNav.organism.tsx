import { Link } from "@react-email/components";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../shadcn/Accordion.shadcn";
import { Button, type ButtonProps } from "../shadcn/Button.shadcn";
import { Role } from "@prisma/client";
import Stack from "../layouts/Stack.layout";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBuilding,
  faUsers,
  faUser,
  faLink,
  faImage,
  faFileAlt,
  faCalendarAlt,
  faTicketAlt,
  type IconDefinition,
  faMoneyBill,
} from "@fortawesome/free-solid-svg-icons";
import Group from "../layouts/Group.layout";

export const StaffNav = ({
  userRole,
  variant,
}: {
  userRole: Role;
  variant: ButtonProps["variant"];
}) => {
  const areas = Object.keys(LINKS).filter((key) => key.includes(userRole));
  return (
    <Stack className="gap-4">
      <Accordion
        type="single"
        collapsible
        defaultValue={areas.includes(userRole) ? userRole : areas[0]}
      >
        {areas.map((area) => {
          return (
            <AccordionItem value={area} key={area}>
              <AccordionTrigger>{LINKS[area]?.label}</AccordionTrigger>
              <AccordionContent>
                <Stack className="items-stretch gap-2">
                  {LINKS[area]?.links?.map((link) => (
                    <Link href={link.href} key={link.href} target="_self">
                      <Button asChild className="w-full" variant={variant}>
                        <Group className="items-center gap-2">
                          <FontAwesomeIcon icon={link.icon} /> {link.label}
                        </Group>
                      </Button>
                    </Link>
                  ))}
                </Stack>
              </AccordionContent>
            </AccordionItem>
          );
        })}
      </Accordion>
    </Stack>
  );
};

const LINKS: Record<
  string,
  {
    label: string;
    links: { label: string; href: string; icon: IconDefinition }[];
  }
> = {
  [Role.KOKO]: {
    label: "Koko's area",
    links: [
      {
        label: "Organization List",
        href: "/staff/manage/koko/org-list",
        icon: faBuilding,
      },
      {
        label: "Admin List",
        href: "/staff/manage/koko/admin-list",
        icon: faUsers,
      },
    ],
  },
  [[Role.KOKO, Role.ADMIN].join("-")]: {
    label: "Admin area",
    links: [
      {
        label: "Earnings",
        href: "/staff/manage/admin/profits",
        icon: faMoneyBill,
      },
      {
        label: "Staff List",
        href: "/staff/manage/admin/staff-list",
        icon: faUser,
      },
      {
        label: "Link List",
        href: "/staff/manage/admin/link-list",
        icon: faLink,
      },
      {
        label: "Banner List",
        href: "/staff/manage/admin/banner-list",
        icon: faImage,
      },
      {
        label: "Organization Details",
        href: "/staff/manage/admin/org-edit",
        icon: faFileAlt,
      },
    ],
  },
  [[Role.KOKO, Role.ADMIN, Role.EVENT_MANAGER].join("-")]: {
    label: "Manager area",
    links: [
      {
        label: "Events List",
        href: "/staff/manage/event/event-list",
        icon: faCalendarAlt,
      },
      {
        label: "Venue List",
        href: "/staff/manage/event/venue-list",
        icon: faBuilding,
      },
    ],
  },
  [[Role.KOKO, Role.ADMIN, Role.EVENT_MANAGER, Role.TICKET_SCANNER].join("-")]:
    {
      label: "Staff Area",
      links: [
        {
          label: "Scan Tickets",
          href: "/staff/manage/scan",
          icon: faTicketAlt,
        },
      ],
    },
};
