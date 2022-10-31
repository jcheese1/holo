import Smol from "./assets/smol.png";
import React, { MouseEvent, useRef } from "react";
import { useSpring, animated as a, to } from "@react-spring/web";

export default function App() {
  return (
    <div className="App">
      <Holo
        imgSrc="https://images.pokemontcg.io/swsh1/190_hires.png"
        textureSrc="https://res.cloudinary.com/simey/image/upload/Dev/PokemonCards/illusion.webp"
        alt="Pokemon"
        width="300px"
      />
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

const Holo = ({
  imgSrc,
  alt,
  textureSrc,
  width,
}: {
  imgSrc: string;
  alt: string;
  textureSrc: string;
  width: string;
}) => {
  const ref = useRef(null);

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

  // const [scale, scaleApi] = useSpring(() => ({ scale: 1, config: springD }));

  const handleMouse = (
    e: MouseEvent<HTMLDivElement, globalThis.MouseEvent>
  ) => {
    const element = e.target as HTMLElement;

    const rect = element.getBoundingClientRect();

    const absolute = {
      x: e.clientX - rect.left, // get mouse position from left
      y: e.clientY - rect.top, // get mouse position from right
    };

    const percent = {
      x: round((100 / rect.width) * absolute.x),
      y: round((100 / rect.height) * absolute.y),
    };
    const center = {
      x: percent.x - 50,
      y: percent.y - 50,
    };

    backgroundApi.set({
      x: round(50 + percent.x / 4 - 12.5),
      y: round(50 + percent.y / 3 - 16.67),
    });

    rotateApi.start({
      x: round(-(center.x / 3.5)),
      y: round(center.y / 2),
      s: 1.1,
    });

    glareApi.set({
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

    glareApi.set({ x: 50, y: 50, o: 0 });
    backgroundApi.set({ x: 50, y: 50 });
  };

  return (
    <a.div
      className="wrapper"
      style={
        {
          "--posx": to(background.x, (value) => `${value}%`),
          "--posy": to(background.y, (value) => `${value}%`),
          "--hyp": to(
            [glare.x, glare.y],
            (x, y) => Math.sqrt((y - 50) * (y - 50) + (x - 50) * (x - 50)) / 50
          ),
          "--o": to(glare.o, (value) => value),
          "--mx": to(glare.x, (value) => `${value}%`),
          "--my": to(glare.y, (value) => `${value}%`),
        } as React.CSSProperties
      }
    >
      <div className="card">
        <a.div
          className="cardFront"
          ref={ref}
          onMouseMove={handleMouse}
          onMouseOut={handleMouseOut}
          style={{
            transform: to(
              [rotate.x, rotate.y, rotate.s],
              (x, y, s) =>
                `perspective(600px) rotateX(${x}deg) rotateY(${y}deg) scale(${s})`
            ),
          }}
        >
          <img src={Smol} alt={alt} />
          <div className="cardShine"></div>
        </a.div>
      </div>
    </a.div>
  );
};
