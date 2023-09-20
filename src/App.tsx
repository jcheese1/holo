import Smol from "./assets/smol.png";
import { MouseEvent } from "react";
import {
  motion,
  useTransform,
  useSpring as useFramerSpring,
  useMotionValueEvent,
} from "framer-motion";
import { folder, useControls } from "leva";
import { pluginFile } from "./plugin";
import React from "react";
import "atropos/css";
import Atropos from "atropos/react";
import Img from "./assets/block.png";
import { interpolate } from "popmotion";

const colors = {
  color1: { r: 255, g: 119, b: 115, a: 1 },
  color2: { r: 255, g: 237, b: 95, a: 1 },
  color3: { r: 168, g: 255, b: 95, a: 1 },
  color4: { r: 131, g: 255, b: 247, a: 1 },
  color5: { r: 120, g: 148, b: 255, a: 1 },
  color6: { r: 216, g: 117, b: 255, a: 1 },
  color7: { r: 255, g: 119, b: 115, a: 1 },
} as const;

const underlyingColors = {
  color8: {
    r: 143,
    g: 163,
    b: 163,
    a: 1,
  },
  color9: {
    r: 143,
    g: 193,
    b: 193,
    a: 1,
  },
  color10: {
    r: 143,
    g: 163,
    b: 163,
    a: 1,
  },
} as const;

const convertColorToString = (color: any) =>
  `rgba(${color.r}, ${color.g}, ${color.b}, ${color.a})`;

export function A() {
  const glareX = useFramerSpring(50);
  const glareY = useFramerSpring(50);
  const backgroundX = useFramerSpring(50);
  const backgroundY = useFramerSpring(50);

  const glare0 = useFramerSpring(0);
  const ref = React.useRef<HTMLDivElement>(null);
  const [file, setFile] = React.useState<string | null>(null);

  const {
    highlight,
    popoutOffset,
    color1,
    color2,
    color3,
    color4,
    color5,
    color6,
    color7,
    color8,
    color9,
    color10,
  } = useControls({
    highlight: true,
    popoutOffset: 5,
    Texture: pluginFile({
      onChange: (file) => {
        if (!file) return;
        setFile(URL.createObjectURL(file));
      },
    }),
    ...colors,
    underlyingColor: folder(underlyingColors),
  });

  const bg = useTransform(
    [backgroundX, backgroundY],
    ([x, y]) => `center, 0% ${y}%, ${x}% ${y}%,
    ${x}% ${y}%`
  );

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

  const bgImage = useTransform(
    [glareX, glareY],
    ([x, y]) => `url(${file ? file : "/pattern.png"}),
      repeating-linear-gradient(
      0deg,
      ${convertColorToString(color1)} calc(5% * 1),
      ${convertColorToString(color2)} calc(5% * 2),
      ${convertColorToString(color3)} calc(5% * 3),
      ${convertColorToString(color4)} calc(5% * 4),
      ${convertColorToString(color5)} calc(5% * 5),
      ${convertColorToString(color6)} calc(5% * 6),
      ${convertColorToString(color7)} calc(5% * 7)
      ),
      repeating-linear-gradient(
      133deg,
      #0e152e 0%,
      ${convertColorToString(color8)} 3.8%,
      ${convertColorToString(color9)} 4.5%,
      ${convertColorToString(color10)} 5.2%,
      #0e152e 10%,
      #0e152e 12%
      ),
      radial-gradient(
      farthest-corner circle at ${x}% ${y}%,
      rgba(0, 0, 0, 0.1) 12%,
      rgba(0, 0, 0, 0.15) 20%,
      rgba(0, 0, 0, 0.25) 120%
    )`
  );

  return (
    <div>
      <Atropos
        activeOffset={40}
        shadowScale={1.05}
        onEnter={() => glare0.set(1)}
        onLeave={() => glare0.set(0)}
        onRotate={(x, y) => {
          const ix = interpolate([-15, 15], [100, 0])(x);
          const iy = interpolate([-15, 15], [0, 100])(y);
          backgroundX.set(round(50 + ix / 4 - 12.5));
          backgroundY.set(round(50 + iy / 3 - 16.67));
          glareX.set(ix);
          glareY.set(iy);
        }}
        highlight={highlight}
        className="w-72 h-[30rem]"
        innerClassName="rounded-lg bg-[#101827]"
      >
        <div className="grid w-full h-full relative" ref={ref}>
          <div className="grid grid-rows-[1fr,250px]">
            <div className="h-64 grid items-center justify-center">
              <img
                src={Img}
                alt="Forest"
                className="[grid-area:1/1] w-full"
                data-atropos-offset={String(popoutOffset)}
              />
            </div>
            <div className="bg-[#19253A] p-3.5 overflow-auto pb-10">
              <h2 className="text-sm font-bold text-[#9FA3A9]">
                Badges | Name
              </h2>
              <h3 className="text-lg font-bold text-[#E7E8E9] mt-1">
                Badge Name
              </h3>
              <p className="text-[#9FA3A9] text-xs my-4">
                Awarded to all unique wallets that either listed or purchased on
                Trove during the first two weeks of launch (June 13 2022 - June
                27th 2022). Awarded to all unique wallets that either listed or
                purchased on Trove during the first two weeks of launch (June 13
                2022 - June 27th 2022). Awarded to all unique wallets that
                either listed or purchased on Trove during the first two weeks
                of launch (June 13 2022 - June 27th 2022).
              </p>
              <p className="text-[#70747D] text-xs">
                5 players have this badge
              </p>
            </div>
          </div>
          <motion.div
            // [-webkit-mask-image:radial-gradient(white,black)] is for safari. Safari is not hiding overflow on divs with round corners on hover :S
            className="absolute pointer-events-none inset-0 [-webkit-mask-image:radial-gradient(white,black)] rounded-lg mix-blend-color-dodge aspect-[0.601] [background-blend-mode:hue,hue,hard-light,overlay] [background-size:100%,200%_700%,300%,200%] after:content-[''] after:visible after:w-full after:mix-blend-exclusion after:aspect-[0.601] after:[background-image:inherit] after:[background-blend-mode:soft-light,hue,hard-light] after:[background-size:100%,200%_400%,195%,200%] after:[grid-area:1/1] after:grid"
            style={{
              opacity: glare0,
              backgroundPosition: bg,
              backgroundImage: bgImage,
              filter: filter,
              WebkitFilter: filter,
              transform: "translate3d(0, 0, 0)",
            }}
          ></motion.div>
        </div>
      </Atropos>
    </div>
  );
}

export default function App() {
  return (
    <div className="App">
      <A />
      {/* <HoloFramer alt="Smol" perspective /> */}
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
  const [file, setFile] = React.useState<string | null>(null);

  useControls({
    Texture: pluginFile({
      onChange: (file) => {
        if (!file) return;
        setFile(URL.createObjectURL(file));
      },
    }),
  });

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
  const bg = useTransform(
    [backgroundX, backgroundY],
    ([x, y]) => `center, 0% ${y}%, ${x}% ${y}%,
  ${x}% ${y}%`
  );
  const bgImage = useTransform(
    [glareX, glareY],
    ([x, y]) => `url(${file ? file : "/pattern.png"}),
repeating-linear-gradient(
  0deg,
  rgb(255, 119, 115) calc(5% * 1),
  rgba(255, 237, 95, 1) calc(5% * 2),
  rgba(168, 255, 95, 1) calc(5% * 3),
  rgba(131, 255, 247, 1) calc(5% * 4),
  rgba(120, 148, 255, 1) calc(5% * 5),
  rgb(216, 117, 255) calc(5% * 6),
  rgb(255, 119, 115) calc(5% * 7)
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
  );

  return (
    <motion.div>
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
              transform: "translate3d(0, 0, 0)",
              opacity: useTransform(glareO, (o) => o),
              backgroundPosition: bg,
              backgroundImage: bgImage,
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
