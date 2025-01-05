import { getBaseUrl } from "@/utils/common";
import { Button, Html } from "@react-email/components";
import * as React from "react";

interface EmailProps {
  organisationName: string;
  orderPageUrl: string;
  eventUrl: string;
  ticketCount: number;
  eventName: string;
  eventDate: string;
  brandLogoUrl: string | null;
  platformUrl: string;
  isEventFree?: boolean;
}

export default function OrderCompletedEmail({
  organisationName = "Organisation",
  orderPageUrl = "",
  eventUrl = "",
  ticketCount = 2,
  eventName = "Event Name",
  eventDate = "24-12-2025",
  brandLogoUrl = `${getBaseUrl()}/assets/flow.jpeg`,
  platformUrl = "",
  isEventFree = false,
}: EmailProps) {
  return (
    <Html>
      <div
        style={{
          fontFamily: "Arial, sans-serif",
          padding: "20px",
          backgroundColor: "#f9f9f9",
        }}
      >
        {brandLogoUrl && (
          <a href={platformUrl}>
            <img
              src={brandLogoUrl}
              alt="Brand Logo"
              style={{ width: "100px", marginBottom: "10px" }}
            />
          </a>
        )}
        <h1 style={{ color: "#333" }}>Order Completed!</h1>
        <p style={{ fontSize: "16px", color: "#555" }}>
          {isEventFree
            ? "Woohoo! Your free tickets"
            : "Thank you for your purchase"}{" "}
          from <strong>{organisationName}</strong>
          {isEventFree ? " just arrived" : ""}!
        </p>
        <p style={{ fontSize: "16px", color: "#555" }}>
          You {isEventFree ? "have claimed" : "have purchased"}{" "}
          <strong>{ticketCount}</strong> tickets for{" "}
          <a
            href={eventUrl}
            style={{
              color: "#007BFF",
              textDecoration: "underline",
              fontWeight: "bold",
            }}
          >
            <strong>{eventName}</strong>
          </a>{" "}
          on <strong>{eventDate}</strong>.
        </p>
        <div style={{ marginTop: "20px" }}>
          <Button
            href={orderPageUrl}
            style={{
              background: "#000",
              color: "#fff",
              padding: "12px 20px",
              borderRadius: "5px",
              textDecoration: "none",
            }}
          >
            View Tickets
          </Button>
        </div>
      </div>
    </Html>
  );
}
