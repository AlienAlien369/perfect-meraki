import React, { useEffect, useState } from "react";
import apiClient from "@/api/apiClient";
import { API_ROUTES } from "@/api/APIRoutes";
import Spinner from "@/components/common/Spinner";

const ProductPage = () => {
  const [link, setLink] = useState<string>("");
  const [linkLoading, setLinkLoading] = useState(true);
  const [linkError, setLinkError] = useState(false);
  const [iframeLoaded, setIframeLoaded] = useState(false);

  useEffect(() => {
    let cancelled = false;

    const fetchLink = async () => {
      try {
        const response = await apiClient.get(API_ROUTES.CATALOGUE.GET_BY_NAME, {
          params: { name: "flipbook" },
        });
        const fetchedLink = response.data?.data?.[0]?.link;
        if (cancelled) return;
        if (fetchedLink) {
          setLink(fetchedLink);
        } else {
          setLinkError(true);
        }
      } catch (error) {
        console.error("Error fetching catalogue link:", error);
        if (!cancelled) setLinkError(true);
      } finally {
        if (!cancelled) setLinkLoading(false);
      }
    };

    fetchLink();
    return () => {
      cancelled = true;
    };
  }, []);

  if (linkLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-sand-light">
        <Spinner size={40} label="Loading catalogue..." />
      </div>
    );
  }

  if (linkError || !link) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-sand-light px-4">
        <div className="text-center max-w-sm">
          <h1 className="font-display text-2xl text-espresso mb-2">
            Catalogue unavailable
          </h1>
          <p className="text-espresso/60 text-sm">
            We couldn&apos;t load the catalogue right now. Please check back shortly.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full" style={{ height: "100dvh" }}>
      {!iframeLoaded && (
        <div className="absolute inset-0 flex items-center justify-center bg-sand-light">
          <Spinner size={40} label="Loading flip book..." />
        </div>
      )}
      <iframe
        allowFullScreen
        scrolling="no"
        className="fp-iframe"
        src={link}
        onLoad={() => setIframeLoaded(true)}
        style={{
          border: "none",
          width: "100%",
          height: "100%",
          opacity: iframeLoaded ? 1 : 0,
          transition: "opacity 200ms ease",
        }}
      />
    </div>
  );
};

export default ProductPage;
