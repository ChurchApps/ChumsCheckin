import * as React from "react";
import { ErrorBoundary } from "react-error-boundary";
import ErrorFallback from "./ErrorFallback";

const myErrorHandler = (error: Error) => {
  // Do something with the error
  // E.g. reporting errorr using sentry ( see part 3)
};

const ErrorHandler = ({ children }: { children: React.ReactNode }) => (
  <ErrorBoundary FallbackComponent={ErrorFallback} onError={myErrorHandler}>
    {children}
  </ErrorBoundary>
);
export default ErrorHandler