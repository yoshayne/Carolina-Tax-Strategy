import { useEffect, useState } from "react";
import { useSearchParams } from "react-router";

export default function GoogleCalendarCallback() {
  const [searchParams] = useSearchParams();
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
  const [message, setMessage] = useState("Processing...");

  useEffect(() => {
    const code = searchParams.get("code");
    const error = searchParams.get("error");

    if (error) {
      setStatus("error");
      setMessage(`Authorization failed: ${error}`);
      // Notify parent window
      if (window.opener) {
        window.opener.postMessage({ type: "google-calendar-connected", success: false, error }, "*");
        setTimeout(() => window.close(), 2000);
      }
      return;
    }

    if (!code) {
      setStatus("error");
      setMessage("No authorization code received");
      return;
    }

    // Exchange code for tokens via backend
    const exchangeCode = async () => {
      try {
        const response = await fetch("/api/admin/auth/google/exchange", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ code }),
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || "Failed to connect calendar");
        }

        setStatus("success");
        setMessage(`Connected to calendar: ${data.calendarName || "Google Calendar"}`);

        // Notify parent window
        if (window.opener) {
          window.opener.postMessage({ type: "google-calendar-connected", success: true }, "*");
          setTimeout(() => window.close(), 1500);
        }
      } catch (err) {
        setStatus("error");
        setMessage(err instanceof Error ? err.message : "Failed to connect calendar");
        if (window.opener) {
          window.opener.postMessage({ type: "google-calendar-connected", success: false, error: message }, "*");
        }
      }
    };

    exchangeCode();
  }, [searchParams]);

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-8">
      <div className="max-w-md w-full text-center">
        {status === "loading" && (
          <>
            <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-lg text-foreground">{message}</p>
          </>
        )}

        {status === "success" && (
          <>
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-foreground mb-2">Connected!</h1>
            <p className="text-muted-foreground">{message}</p>
            <p className="text-sm text-muted-foreground mt-4">This window will close automatically...</p>
          </>
        )}

        {status === "error" && (
          <>
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-foreground mb-2">Connection Failed</h1>
            <p className="text-muted-foreground">{message}</p>
            {!window.opener && (
              <a href="/admin" className="inline-block mt-4 text-primary hover:underline">
                Back to Admin
              </a>
            )}
          </>
        )}
      </div>
    </div>
  );
}
