import React from "react";

export default class ErrorBoundary extends React.Component<
  {
    children: React.ReactElement;
    onError: (error: Error) => void;
  },
  { hasError: boolean }
> {
  constructor(props: {
    children: React.ReactElement;
    onError: (error: Error) => void;
  }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: unknown, errorInfo: unknown) {
    console.error("Error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="rounded border bg-red-100 p-2">
          ⚠️ Something went wrong!
        </div>
      );
    }
    return this.props.children;
  }
}
