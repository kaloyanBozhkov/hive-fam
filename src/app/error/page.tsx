import React from "react";
import {
  Card,
  CardContent,
  CardTitle,
  CardDescription,
  CardHeader,
} from "@/app/_components/shadcn/Card.shadcn";
import { Button } from "@/app/_components/shadcn/Button.shadcn";
import Link from "next/link";

const ErrorPage: React.FC = () => {
  return (
    <Card className="m-auto w-full max-w-[400px]">
      <CardHeader>
        <CardTitle>404</CardTitle>
        <CardDescription>Page not found</CardDescription>
      </CardHeader>
      <CardContent>
        <Link href="/">
          <Button>Go Back Home</Button>
        </Link>
      </CardContent>
    </Card>
  );
};

export default ErrorPage;
