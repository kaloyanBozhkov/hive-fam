import { getBaseUrl } from "@/utils/common";
import { Body, Button, Html, Link } from "@react-email/components";
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
  brandLogoUrl = `${getBaseUrl(false)}/assets/flow.jpeg`,
  platformUrl = "",
  isEventFree = false,
}: EmailProps) {
  return (
    <Html
      style={{
        width: "100%",
        padding: 0,
        margin: 0,
      }}
    >
      <Body
        style={{
          margin: "0",
          padding: "20px",
          fontFamily: "Arial, sans-serif",
          backgroundColor: "#f9f9f9",
        }}
      >
        {brandLogoUrl && (
          <Link href={platformUrl}>
            <img
              src={brandLogoUrl}
              alt="Brand Logo"
              style={{ width: "100px", marginBottom: "10px" }}
            />
          </Link>
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
          <Link
            href={eventUrl}
            style={{
              color: "#007BFF",
              textDecoration: "underline",
              fontWeight: "bold",
            }}
          >
            <strong>{eventName}</strong>
          </Link>{" "}
          on <strong>{eventDate}</strong>.
        </p>
        <div style={{ marginTop: "20px" }}>
          <Link href={orderPageUrl}>
            <Button
              type="button"
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
          </Link>
        </div>
      </Body>
    </Html>
  );
}
