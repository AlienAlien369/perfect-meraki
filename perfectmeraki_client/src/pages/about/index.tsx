"use client";
import { useEffect, useRef } from "react";
import { gsap } from "gsap";

const AboutUs = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const leafRefs = useRef<(HTMLDivElement | null)[]>([]);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    // Floating leaves animation
    leafRefs.current.forEach((leaf, i) => {
      if (leaf) {
        gsap.to(leaf, {
          y: i % 2 === 0 ? -20 : 20,
          duration: 3,
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut",
        });
      }
    });

    // Heading animation
    if (headingRef.current) {
      gsap.fromTo(
        headingRef.current,
        { opacity: 0, y: 50 },
        {
          opacity: 1,
          y: 0,
          duration: 1.5,
          ease: "power3.out",
        }
      );
    }

    // Card animations
    cardRefs.current.forEach((card, i) => {
      if (card) {
        gsap.fromTo(
          card,
          { opacity: 0, x: i % 2 === 0 ? -50 : 50 },
          {
            scrollTrigger: {
              trigger: card,
              start: "top 80%",
              toggleActions: "play none none none",
            },
            opacity: 1,
            x: 0,
            duration: 1,
            ease: "back.out(1.7)",
          }
        );
      }
    });

    // Background pulse animation
    if (sectionRef.current) {
      gsap.to(sectionRef.current, {
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top center",
          toggleActions: "play none none none",
        },
        backgroundColor: "rgba(236, 253, 245, 0.7)",
        duration: 2,
        ease: "power1.inOut",
      });
    }
  }, []);
  return (
    <div
      ref={sectionRef}
      className="relative min-h-screen bg-gradient-to-b from-emerald-50 to-green-50 overflow-hidden py-16 px-4 sm:px-6 lg:px-8"
    >
      {/* Floating decorative elements */}
      {[...Array(8)].map((_, i) => (
        <div
          key={i}
          ref={(el) => {
            leafRefs.current[i] = el;
          }}
          className={`absolute hidden md:block ${
            i % 2 === 0 ? "text-emerald-300" : "text-green-400"
          }`}
          style={{
            top: `${10 + i * 10}%`,
            left: i < 4 ? `${5 + i * 5}%` : "auto",
            right: i >= 4 ? `${5 + (i - 4) * 5}%` : "auto",
            fontSize: `${1 + (i % 3)}rem`,
            opacity: 0.7,
          }}
        >
          {i % 2 === 0 ? "🍃" : "🌿"}
        </div>
      ))}

      <div className="max-w-7xl mx-auto relative z-10">
        <h1
          ref={headingRef}
          className="text-5xl md:text-7xl font-bold text-center mb-16 text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-green-800"
        >
          <span className="block mb-2">Our Meraki</span>
          <span className="text-3xl md:text-5xl font-normal">
            (μαράκι) - Soul, Creativity, Love
          </span>
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-20">
          <div
            ref={(el) => {
              cardRefs.current[0] = el;
            }}
            className="bg-white p-8 rounded-3xl shadow-2xl transform transition-all hover:scale-105 hover:shadow-green-200/50 border-l-8 border-emerald-500"
          >
            <h2 className="text-3xl font-bold text-emerald-800 mb-4">
              🪵 Handcrafted with Passion
            </h2>
            <p className="text-lg text-gray-700">
              At Perfect Meraki, we pour our soul into every piece. From the
              first sketch to the final polish, each creation is infused with
              our love for wood and traditional craftsmanship. Our artisans
              blend ancient techniques with contemporary designs to bring you
              truly unique pieces.
            </p>
          </div>

          <div
            ref={(el) => {
              cardRefs.current[1] = el;
            }}
            className="bg-white p-8 rounded-3xl shadow-2xl transform transition-all hover:scale-105 hover:shadow-green-200/50 border-l-8 border-green-500"
          >
            <h2 className="text-3xl font-bold text-green-800 mb-4">
              🌱 Sustainable & Natural
            </h2>
            <p className="text-lg text-gray-700">
              We believe in harmony with nature. All our materials are
              sustainably sourced, and we use natural finishes to protect both
              your home and the environment. Every piece tells a story of
              ecological responsibility and timeless beauty.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
          {[
            {
              title: "Mandalas & Sacred Geometry",
              desc: "Intricate designs that bring balance and positive energy to your space",
              icon: "🌀",
            },
            {
              title: "Lippan Art Revival",
              desc: "Traditional mud relief work reimagined in wood for modern homes",
              icon: "🪔",
            },
            {
              title: "Personalized Creations",
              desc: "Custom nameplates and gifts that carry your unique story",
              icon: "✍️",
            },
          ].map((item, i) => (
            <div
              key={i}
              ref={(el) => {
                cardRefs.current[i + 2] = el;
              }}
              className="bg-white/90 backdrop-blur-sm p-6 rounded-2xl shadow-lg transform transition-all hover:scale-110 hover:shadow-emerald-100/50 border-t-4 border-emerald-400"
            >
              <div className="text-4xl mb-4">{item.icon}</div>
              <h3 className="text-xl font-bold text-emerald-900 mb-2">
                {item.title}
              </h3>
              <p className="text-gray-600">{item.desc}</p>
            </div>
          ))}
        </div>

        <div className="bg-gradient-to-r from-emerald-500 to-green-600 rounded-3xl p-8 md:p-12 text-white shadow-2xl overflow-hidden relative">
          <div className="absolute -top-20 -right-20 w-64 h-64 rounded-full bg-green-400/20"></div>
          <div className="absolute -bottom-20 -left-20 w-80 h-80 rounded-full bg-emerald-400/20"></div>

          <div className="relative z-10">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              ✨ Creative Workshops
            </h2>
            <p className="text-xl mb-8 max-w-3xl">
              Join our immersive workshops where art comes alive! Whether
              you&#39;re a beginner or looking to refine your skills, our
              sessions in mandala art, wood painting, and Lippan craft will
              awaken your creativity.
            </p>
            <div className="flex flex-wrap gap-4">
              <button
                className="px-6 py-3 bg-white text-emerald-800 font-bold rounded-full hover:bg-gray-100 transition-all transform hover:scale-105 shadow-lg"
                onClick={() => {
                  window.open("https://wa.link/zd0hs9", "_blank");
                }}
              >
                Book a Workshop
              </button>
              <button
                className="px-6 py-3 border-2 border-white text-white font-bold rounded-full hover:bg-white/10 transition-all transform hover:scale-105"
                onClick={() => {
                  window.open("https://wa.link/13h504", "_blank");
                }}
              >
                Custom Order
              </button>
            </div>
          </div>
        </div>

        <div className="mt-20 text-center">
          <p className="text-2xl text-emerald-800 font-medium mb-4">
            Every piece tells a story. Made by hand, made to last.
          </p>
          <p className="text-lg text-gray-600">
            Ready to bring Perfect Meraki into your home? Let&#39;s create
            something beautiful together.
          </p>
        </div>
      </div>
    </div>
  );
};

export default AboutUs;
