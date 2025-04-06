import { getBaseUrl } from "@/utils/common";
import {
  Body,
  Container,
  Html,
  Img,
  Link,
  Section,
  Text,
} from "@react-email/components";
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
        <Container
          style={{
            backgroundColor: "white",
            padding: "20px",
            borderRadius: "8px",
            boxShadow: "1px 1px 20px 0px rgb(119 119 119 / 15%)",
          }}
        >
          {brandLogoUrl && (
            <Link href={platformUrl}>
              <Img
                src={brandLogoUrl}
                alt="Brand Logo"
                height={100}
                style={{
                  maxWidth: "100px",
                  maxHeight: "100px",
                  width: "auto",
                  height: "auto",
                  marginBottom: "10px",
                  objectFit: "contain",
                }}
              />
            </Link>
          )}
          <Text style={{ color: "#555", fontSize: "16px", fontWeight: "bold" }}>
            Order Completed 🎉
          </Text>
          <Text style={{ fontSize: "16px", color: "#555" }}>
            {isEventFree
              ? "Woohoo! Your free tickets"
              : "Thank you for your purchase"}{" "}
            from <strong>{organisationName}</strong>
            {isEventFree ? " just arrived" : ""}!
          </Text>
          <Text style={{ fontSize: "16px", color: "#555" }}>
            You {isEventFree ? "have claimed" : "have purchased"}{" "}
            <strong>{ticketCount}</strong> ticket
            {ticketCount === 1 ? "" : "s"} for{" "}
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
          </Text>
          <Section style={{ marginTop: "40px", marginBottom: "10px" }}>
            <Link
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
            </Link>
          </Section>
        </Container>
      </Body>
    </Html>
  );
}
