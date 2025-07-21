import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import gsap from "gsap";
import "./NavBar.css";

const options = [
  { id: "main", label: "Main" },
  { id: "marble", label: "Marble" },
  { id: "mystats", label: "My Stats" },
];

const NavBar: React.FC = () => {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const groups =
      document.querySelectorAll<HTMLDivElement>(".radio-btn-group");
    let previousRadioBtn: HTMLInputElement | null = null;

    const getNodes = (
      radioBtn: HTMLInputElement
    ): [SVGRectElement[], SVGRectElement[]] => {
      const container = radioBtn.closest(".radio-btn-group");
      if (!container) return [[], []];
      const blueRects = gsap.utils.shuffle(
        Array.from(container.querySelectorAll<SVGRectElement>(".blue rect"))
      );
      const pinkRects = gsap.utils.shuffle(
        Array.from(container.querySelectorAll<SVGRectElement>(".pink rect"))
      );
      return [blueRects, pinkRects];
    };

    const animateRects = (
      nodes: [SVGRectElement[], SVGRectElement[]],
      isChecked: boolean
    ) => {
      gsap.to(nodes[0], {
        duration: 1.8,
        ease: "elastic.out(1, 0.3)",
        xPercent: isChecked ? -100 : 100,
        stagger: 0.012,
        overwrite: true,
      });

      gsap.to(nodes[1], {
        duration: 1.8,
        ease: "elastic.out(1, 0.3)",
        xPercent: isChecked ? 100 : -100,
        stagger: 0.012,
        overwrite: true,
      });
    };

    groups.forEach((group) => {
      const radioBtn = group.querySelector<HTMLInputElement>(
        "input[type='radio']"
      );
      if (!radioBtn) return;

      radioBtn.addEventListener("change", () => {
        const nodes = getNodes(radioBtn);
        if (previousRadioBtn && previousRadioBtn !== radioBtn) {
          const oldNodes = getNodes(previousRadioBtn);
          animateRects(oldNodes, false);
        }

        animateRects(nodes, true);
        previousRadioBtn = radioBtn;

        navigate(`/${radioBtn.id}`);
        setIsOpen(false); // Cierra el menú en móviles
      });

      if (radioBtn.checked) {
        const nodes = getNodes(radioBtn);
        animateRects(nodes, true);
        previousRadioBtn = radioBtn;
      }
    });

    return () => {
      groups.forEach((group) => {
        const radioBtn = group.querySelector<HTMLInputElement>(
          "input[type='radio']"
        );
        if (radioBtn) {
          radioBtn.replaceWith(radioBtn.cloneNode(true));
        }
      });
    };
  }, [navigate]);

  return (
    <nav className="neon-navbar">
      <div className="hamburger" onClick={() => setIsOpen(!isOpen)}>
        <div className={`bar ${isOpen ? "open" : ""}`} />
        <div className={`bar ${isOpen ? "open" : ""}`} />
        <div className={`bar ${isOpen ? "open" : ""}`} />
      </div>

      <div className={`menu-items ${isOpen ? "show" : ""}`}>
        {options.map((opt, idx) => (
          <div className="radio-btn-group" key={opt.id}>
            <input
              type="radio"
              name="neon-nav"
              id={opt.id}
              defaultChecked={idx === 0}
            />
            <label htmlFor={opt.id}>
              <span>{opt.label}</span>
              <svg
                height="100%"
                width="100%"
                xmlns="http://www.w3.org/2000/svg"
              >
                <g className="pink">
                  {[...Array(10)].map((_, i) => (
                    <rect
                      key={`p-${i}`}
                      x="-101%"
                      y={i * 5}
                      width="100%"
                      height="5"
                    />
                  ))}
                </g>
                <g className="blue">
                  {[...Array(10)].map((_, i) => (
                    <rect
                      key={`b-${i}`}
                      x="101%"
                      y={i * 5}
                      width="100%"
                      height="5"
                    />
                  ))}
                </g>
              </svg>
            </label>
          </div>
        ))}
      </div>
    </nav>
  );
};

export default NavBar;
