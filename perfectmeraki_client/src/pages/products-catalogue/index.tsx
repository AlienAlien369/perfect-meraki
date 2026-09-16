import React, { useEffect, useState } from "react";
import axios from "axios";
import { API_ROUTES } from "@/api/APIRoutes"; // Adjust the path as needed

const ProductPage = () => {
  const [link, setLink] = useState<string | "">("");

  useEffect(() => {
    const fetchLink = async () => {
      try {
        const response = await axios.get(
          `${API_ROUTES.CATALOGUE.GET_BY_NAME}`,
          {
            params: { name: "flipbook" }, // query params
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        // Adjust this according to your API response structure
        setLink(response.data.data[0].link);
      } catch (error) {
        setLink("");
        console.error("Error fetching product link:", error);
      }
    };

    fetchLink();
  }, []);

  // if (!link) return <div>Loading...</div>;

  return (
    <iframe
      allowFullScreen
      scrolling="no"
      className="fp-iframe"
      src={link}
      style={{ border: "1px solid lightgray", width: "100%", height: "100vh" }}
    ></iframe>
  );
};

export default ProductPage;
