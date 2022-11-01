import Smol from "./assets/smol.png";
import { MouseEvent } from "react";
import { useSpring, animated as a, to } from "@react-spring/web";

export default function App() {
  return (
    <div className="App">
      <Holo alt="Smol" perspective={false} />
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

const Holo = ({ alt, perspective }: { alt: string; perspective: boolean }) => {
  const [rotate, rotateApi] = useSpring(
    () => ({
      x: 0,
      y: 0,
      s: 1,
      config: springR,
    }),
    [springR]
  );
  const [glare, glareApi] = useSpring(
    () => ({
      x: 50,
      y: 50,
      o: 0,
      config: springR,
    }),
    [springR]
  );
  const [background, backgroundApi] = useSpring(
    () => ({
      x: 50,
      y: 50,
      config: springR,
    }),
    [springR]
  );

  const handleMouse = (
    e: MouseEvent<HTMLDivElement, globalThis.MouseEvent>
  ) => {
    const element = e.target as HTMLElement;

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

    backgroundApi.start({
      x: round(50 + percent.x / 4 - 12.5),
      y: round(50 + percent.y / 3 - 16.67),
    });

    rotateApi.start({
      x: round(-(center.x / 3.5)),
      y: round(center.y / 2),
      s: 1.03,
    });

    glareApi.start({
      x: percent.x,
      y: percent.y,
      o: 1,
    });
  };

  const handleMouseOut = () => {
    rotateApi.start({
      x: 0,
      y: 0,
      s: 1,
    });

    glareApi.start({ x: 50, y: 50, o: 0 });
    backgroundApi.start({ x: 50, y: 50 });
  };

  const filter = to([glare.x, glare.y], (x, y) => {
    const hyp =
      (Math.sqrt((y - 50) * (y - 50) + (x - 50) * (x - 50)) / 50) * 0.3 + 0.5;
    return `brightness(${hyp}) contrast(2) saturate(1.5)`;
  });

  return (
    <a.div className="wrapper">
      <div className="card">
        <a.div
          className="cardFront"
          onMouseMove={handleMouse}
          onMouseOut={handleMouseOut}
          style={{
            transform: to([rotate.x, rotate.y, rotate.s], (x, y, s) =>
              perspective
                ? `perspective(600px) rotateX(${x}deg) rotateY(${y}deg) scale(${s})`
                : `scale(${s})`
            ),
          }}
        >
          <img src={Smol} alt={alt} />
          <a.div
            style={{
              opacity: glare.o.to((o) => o),
              backgroundPosition: to(
                [background.x, background.y],
                (x, y) => `center, 0% ${y}%, ${x}% ${y}%,
              ${x}% ${y}%`
              ),
              backgroundImage: to(
                [glare.x, glare.y],
                (x, y) => `url("/pattern.png"),
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
          ></a.div>
        </a.div>
      </div>
    </a.div>
  );
};
