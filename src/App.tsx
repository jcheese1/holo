import Smol from "./assets/smol.png";
import { MouseEvent } from "react";
import {
  motion,
  useTransform,
  useSpring as useFramerSpring,
} from "framer-motion";

export default function App() {
  return (
    <div className="App">
      <HoloFramer alt="Smol" perspective />
    </div>
  );
}

const springR = {
  mass: 1,
  tension: 170,
  friction: 26,
  clamp: false,
  precision: 0.01,
  velocity: 0,
};

const round = (num: number, fix = 3) => parseFloat(num.toFixed(fix));

const HoloFramer = ({
  alt,
  perspective,
}: {
  alt: string;
  perspective: boolean;
}) => {
  const rotationX = useFramerSpring(0);
  const rotationY = useFramerSpring(0);
  const scale = useFramerSpring(1);
  const glareX = useFramerSpring(50);
  const glareY = useFramerSpring(50);
  const glareO = useFramerSpring(0);
  const backgroundX = useFramerSpring(50);
  const backgroundY = useFramerSpring(50);

  const handleMouse = (e: MouseEvent) => {
    const element = e.currentTarget;

    const rect = element.getBoundingClientRect();

    const absolute = {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    };

    const percent = {
      x: round((100 / rect.width) * absolute.x),
      y: round((100 / rect.height) * absolute.y),
    };
    const center = {
      x: percent.x - 50,
      y: percent.y - 50,
    };

    backgroundX.set(round(50 + percent.x / 4 - 12.5));
    backgroundY.set(round(50 + percent.y / 3 - 16.67));

    rotationX.set(round(-(center.x / 3.5)));
    rotationY.set(round(center.y / 2));
    scale.set(1.03);

    glareX.set(percent.x);
    glareY.set(percent.y);
    glareO.set(1);
  };

  const handleMouseOut = () => {
    rotationX.set(0);
    rotationY.set(0);
    scale.set(1);

    glareX.set(50);
    glareY.set(50);
    glareO.set(0);

    backgroundX.set(50);
    backgroundY.set(50);
  };

  const filter = useTransform([glareX, glareY], ([x, y]) => {
    const hyp =
      (Math.sqrt(
        ((y as number) - 50) * ((y as number) - 50) +
          ((x as number) - 50) * ((x as number) - 50)
      ) /
        50) *
        0.3 +
      0.5;
    return `brightness(${hyp}) contrast(2) saturate(1.5)`;
  });

  return (
    <motion.div className="wrapper">
      <div className="card">
        <motion.div
          className="cardFront"
          transition={springR}
          onMouseMove={handleMouse}
          onMouseOut={handleMouseOut}
          style={{
            transform: useTransform(
              [rotationX, rotationY, scale],
              ([x, y, s]) =>
                perspective
                  ? `perspective(600px) rotateX(${x}deg) rotateY(${y}deg) scale(${s})`
                  : `scale(${s})`
            ),
          }}
        >
          <img src={Smol} alt={alt} />
          <motion.div
            style={{
              opacity: useTransform(glareO, (o) => o),
              backgroundPosition: useTransform(
                [backgroundX, backgroundY],
                ([x, y]) => `center, 0% ${y}%, ${x}% ${y}%,
              ${x}% ${y}%`
              ),
              backgroundImage: useTransform(
                [glareX, glareY],
                ([x, y]) => `url("/pattern.png"),
            repeating-linear-gradient(
              0deg,
              rgb(255, 119, 115) calc(var(--space) * 1),
              rgba(255, 237, 95, 1) calc(var(--space) * 2),
              rgba(168, 255, 95, 1) calc(var(--space) * 3),
              rgba(131, 255, 247, 1) calc(var(--space) * 4),
              rgba(120, 148, 255, 1) calc(var(--space) * 5),
              rgb(216, 117, 255) calc(var(--space) * 6),
              rgb(255, 119, 115) calc(var(--space) * 7)
            ),
            repeating-linear-gradient(
              133deg,
              #0e152e 0%,
              hsl(180, 10%, 60%) 3.8%,
              hsl(180, 29%, 66%) 4.5%,
              hsl(180, 10%, 60%) 5.2%,
              #0e152e 10%,
              #0e152e 12%
            ),
            radial-gradient(
              farthest-corner circle at ${x}% ${y}%,
              rgba(0, 0, 0, 0.1) 12%,
              rgba(0, 0, 0, 0.15) 20%,
              rgba(0, 0, 0, 0.25) 120%
            )`
              ),
              filter: filter,
              WebkitFilter: filter,
            }}
            className="cardShine"
          ></motion.div>
        </motion.div>
      </div>
    </motion.div>
  );
};
