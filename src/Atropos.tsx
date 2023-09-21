// @ts-nocheck

import React, { useEffect, useRef } from "react";
import AtroposCore, { AtroposInstance } from "atropos";
import { MotionValue, motion } from "framer-motion";

const paramsKeys = [
  "eventsEl",
  "alwaysActive",
  "activeOffset",
  "shadowOffset",
  "shadowScale",
  "duration",
  "rotate",
  "rotateTouch",
  "rotateXMax",
  "rotateYMax",
  "rotateXInvert",
  "rotateYInvert",
  "stretchX",
  "stretchY",
  "stretchZ",
  "commonOrigin",
  "shadow",
  "highlight",
  "onEnter",
  "onLeave",
  "onRotate",
];

const removeParamsKeys = (obj) => {
  const result = {};
  Object.keys(obj).forEach((key) => {
    if (!paramsKeys.includes(key)) result[key] = obj[key];
  });
  return result;
};

const extractParamsKeys = (obj) => {
  const result = {};
  Object.keys(obj).forEach((key) => {
    if (paramsKeys.includes(key)) result[key] = obj[key];
  });
  return result;
};

const AtroposForTesting = (props: {
  component?: string;
  children: React.ReactNode;
  rootChildren?: React.ReactNode;
  scaleChildren?: React.ReactNode;
  rotateChildren?: React.ReactNode;
  className?: string;
  scaleClassName?: string;
  rotateClassName?: string;
  innerClassName?: string;
  eventsEl?: HTMLElement;
  alwaysActive?: boolean;
  activeOffset?: number;
  shadowOffset?: number;
  shadowScale?: number;
  duration?: number;
  rotate?: boolean;
  rotateTouch?: boolean | "scroll-x" | "scroll-y";
  rotateXMax?: number;
  rotateYMax?: number;
  rotateXInvert?: boolean;
  rotateYInvert?: boolean;
  stretchX?: number;
  stretchY?: number;
  stretchZ?: number;
  commonOrigin?: boolean;
  shadow?: boolean;
  highlight?: boolean;
  onEnter?: () => void;
  onLeave?: () => void;
  onRotate?: (x: number, y: number) => void;
  testMode?: boolean;
  rotateX?: MotionValue<number>;
  rotateY?: MotionValue<number>;
}) => {
  const {
    component = "div",
    children,
    rootChildren,
    scaleChildren,
    rotateChildren,
    className = "",
    scaleClassName = "",
    rotateClassName = "",
    innerClassName = "",
    rotateX,
    rotateY,
    testMode,
    ...rest
  } = props;

  const atroposRef = useRef<AtroposInstance | null>(null);
  const elRef = useRef<HTMLDivElement | null>(null);
  const Component = component;

  const cls = (...args) => {
    return args.filter((c) => !!c).join(" ");
  };

  const init = () => {
    if (!elRef?.current) return;
    atroposRef.current = AtroposCore({
      el: elRef.current,
      ...extractParamsKeys(props),
    });
  };

  const destroy = () => {
    if (atroposRef.current) {
      atroposRef.current.destroy();
      atroposRef.current = null;
    }
  };

  useEffect(() => {
    if (elRef.current) {
      init();
    }

    return () => {
      destroy();
    };
  }, []);

  useEffect(() => {
    if (atroposRef.current) {
      atroposRef.current.params.onEnter = props.onEnter;
      atroposRef.current.params.onLeave = props.onLeave;
      atroposRef.current.params.onRotate = props.onRotate;
    }
    return () => {
      if (atroposRef.current) {
        atroposRef.current.params.onEnter = undefined;
        atroposRef.current.params.onLeave = undefined;
        atroposRef.current.params.onRotate = undefined;
      }
    };
  });

  return (
    <Component
      className={cls("atropos", className)}
      {...removeParamsKeys(rest)}
      ref={elRef}
    >
      <span className={cls("atropos-scale", scaleClassName)}>
        <motion.span
          className={cls("atropos-rotate", rotateClassName)}
          style={
            testMode
              ? {
                  rotateX: rotateX,
                  rotateY: rotateY,
                }
              : {}
          }
        >
          <span className={cls("atropos-inner", innerClassName)}>
            {children}
            {(props.highlight || typeof props.highlight === "undefined") && (
              <span className="atropos-highlight" />
            )}
          </span>
          {rotateChildren}
          {(props.shadow || typeof props.shadow === "undefined") && (
            <span className="atropos-shadow" />
          )}
        </motion.span>
        {scaleChildren}
      </span>
      {rootChildren}
    </Component>
  );
};

export { AtroposForTesting };
