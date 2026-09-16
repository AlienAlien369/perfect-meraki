"use client";
import { useRouter } from "next/router";
import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import axios from "axios";
import { API_ROUTES } from "@/api/APIRoutes";
import { FiArrowLeft, FiArrowRight  } from "react-icons/fi";
import { FaWhatsapp  } from "react-icons/fa";
import Spinner from "@/components/common/Spinner";


interface Workshop {
  _id: string;
  image1: string;
  image2: string;
  image3: string;
  name: string;
  type: string;
  description: string;
}

export default function WorkshopTypePage() {
  const router = useRouter();
  const { type } = router.query;
  const [workshops, setWorkshops] = useState<Workshop[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentSlide, setCurrentSlide] = useState(0);
  const sliderRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!router.isReady) return;

    const fetchData = async () => {
      try {
        const url = type
          ? `${API_ROUTES.WORKSHOPS.GET_BY_TYPE(type as string)}`
          : `${API_ROUTES.WORKSHOPS.GET_BY_TYPE()}`;
        const response = await axios.get(url);
        setWorkshops(response.data.data || []);
      } catch (err) {
        console.error("Error fetching workshops:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [type, router.isReady]);

  const nextSlide = () => {
    if (currentSlide < workshops.length - 1) {
      setCurrentSlide(currentSlide + 1);
    } else {
      setCurrentSlide(0);
    }
    scrollToSlide();
  };

  const prevSlide = () => {
    if (currentSlide > 0) {
      setCurrentSlide(currentSlide - 1);
    } else {
      setCurrentSlide(workshops.length - 1);
    }
    scrollToSlide();
  };

  const scrollToSlide = () => {
    if (sliderRef.current) {
      sliderRef.current.scrollTo({
        left: currentSlide * sliderRef.current.offsetWidth,
        behavior: "smooth",
      });
    }
  };

  const handleWhatsAppClick = (workshopName: string) => {
    const message = `Hi, I'm interested in booking the ${workshopName} workshop. Can you provide more details?`;
    const encodedMessage = encodeURIComponent(message);
    window.open(`https://wa.me/918860646364?text=${encodedMessage}`, "_blank");
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[70vh] bg-sand-light">
        <Spinner size={40} label="Loading workshop..." />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-sand-light py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="font-display text-4xl text-espresso mb-8 capitalize text-center">
          {type ? `${type} Workshops` : "All Workshops"}
        </h1>

        {workshops.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-2xl shadow-sm border border-sand">
            <p className="text-xl text-espresso/60">No workshops found.</p>
          </div>
        ) : (
          <div className="space-y-16">
            {workshops.map((workshop) => (
              <div
                key={workshop._id}
                className="bg-white rounded-2xl shadow-sm border border-sand overflow-hidden transition-shadow duration-base hover:shadow-lg"
              >
                {/* Image Slider */}
                <div className="relative h-80 sm:h-96 w-full overflow-hidden">
                  <div
                    ref={sliderRef}
                    className="flex h-full w-full overflow-x-hidden scroll-snap-x-mandatory scrollbar-hide"
                  >
                    {[workshop.image1, workshop.image2, workshop.image3].map(
                      (img, idx) => (
                      img && (
                        <div
                          key={idx}
                          className="flex-shrink-0 w-full h-full scroll-snap-align-start relative"
                        >
                          <Image
                            src={img}
                            alt={`${workshop.name} image ${idx + 1}`}
                            layout="fill"
                            objectFit="cover"
                            className="transition-opacity duration-500"
                          />
                        </div>
                      )
                    ))
                  }
                  </div>
                  
                  {/* Navigation Arrows */}
                  <button
                    onClick={prevSlide}
                    className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/80 p-2 rounded-full shadow-md hover:bg-white transition-colors duration-fast"
                  >
                    <FiArrowLeft className="text-espresso text-xl" />
                  </button>
                  <button
                    onClick={nextSlide}
                    className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/80 p-2 rounded-full shadow-md hover:bg-white transition-colors duration-fast"
                  >
                    <FiArrowRight className="text-espresso text-xl" />
                  </button>

                  {/* Slide Indicators */}
                  <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2">
                    {[workshop.image1, workshop.image2, workshop.image3].map(
                      (img, idx) => (
                      img && (
                        <button
                          key={idx}
                          onClick={() => setCurrentSlide(idx)}
                          className={`w-3 h-3 rounded-full transition-all ${
                            currentSlide === idx
                              ? "bg-green w-6"
                              : "bg-white/80"
                          }`}
                        />
                      )
                    ))}
                  </div>
                </div>

                {/* Workshop Content */}
                <div className="p-8">
                  <div className="mb-6">
                    <span className="inline-block px-3 py-1 bg-green-light text-green-dark rounded-full text-sm font-medium capitalize">
                      {workshop.type}
                    </span>
                    <h2 className="mt-3 font-display text-3xl text-espresso">
                      {workshop.name}
                    </h2>
                  </div>

                  <div className="prose max-w-none text-espresso/70 mb-8">
                    {workshop.description.split('\n').map((paragraph, i) => (
                      <p key={i} className="mb-4">{paragraph}</p>
                    ))}
                  </div>

                  <div className="flex flex-wrap gap-4">
                    <button
                      onClick={() => handleWhatsAppClick(workshop.name)}
                      className="flex items-center justify-center gap-2 px-6 py-3 bg-green hover:bg-green-dark text-white font-medium rounded-full transition-colors duration-base shadow-md hover:shadow-lg"
                    >
                      <FaWhatsapp  className="text-xl" />
                      Book via WhatsApp
                    </button>
                    <button
                      onClick={() => handleWhatsAppClick(workshop.name)}
                      className="flex items-center justify-center gap-2 px-6 py-3 bg-white border border-green text-green-dark font-medium rounded-full transition-colors duration-base shadow-md hover:shadow-lg hover:bg-green-light"
                    >
                      Enquire Now
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}