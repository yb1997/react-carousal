import React, { useState, useEffect, useRef, useCallback } from "react";
import { useTransition, animated, config } from "react-spring";
import styled from "styled-components";

import "bootstrap/dist/css/bootstrap.min.css";
import "./styles.css";

const StyledAnimatedDiv = styled(animated.div)`
  height: 100vh;
  width: 100vw;
  background-color: ${({ color }) => color};
  background-image: url(${({ url }) => url});
  background-size: cover;
  background-position: 50%;
`;

const ButtonGroupContainer = styled.div`
  position: fixed;
  bottom: 10px;
  left: 0;
  right: 0;
  text-align: center;
`;

export default function App() {
  const [items] = useState([
    { id: 0, url: "//unsplash.it/750/860", color: "dodgerblue" },
    { id: 1, url: "//unsplash.it/750/870", color: "crimson" },
    { id: 2, url: "//unsplash.it/750/880", color: "olive" }
  ]);

  const [index, setIndex] = useState(0);

  const transitions = useTransition(items[index], item => item.id, {
    from: {
      transform: "translateX(100%)",
      position: "absolute"
    },
    enter: { transform: "translateX(0)" },
    leave: { transform: "translateX(-100%)" },
    config: config.stiff
  });

  const timerIdRef = useRef(null);

  useEffect(() => {
    timerIdRef.current = setInterval(() => {
      setIndex(index => (index + 1) % items.length);
    }, 7000);
    return () => clearInterval(timerIdRef.current);
  }, [items]);

  const slide = useCallback(
    slideIndex => {
      clearInterval(timerIdRef.current);

      timerIdRef.current = setInterval(() => {
        setIndex(index => (index + 1) % items.length);
      }, 7000);

      setIndex(slideIndex);
    },
    [timerIdRef, items]
  );

  return (
    <div className="App">
      {transitions.map(({ item, key, props }) => (
        <StyledAnimatedDiv
          url={item.url}
          color={item.color}
          key={key}
          style={props}
        >
          <h1 style={{ WebkitTextStroke: "1px white" }}>Slide {item.id + 1}</h1>
        </StyledAnimatedDiv>
      ))}

      <ButtonGroupContainer>
        <div className="btn-group">
          {items.map((item, i) => (
            <button
              onClick={e => slide(items.indexOf(item))}
              className={`btn btn-primary ${index === i ? "active" : ""}`}
              key={item.id}
            >
              {item.id + 1}
            </button>
          ))}
        </div>
      </ButtonGroupContainer>
    </div>
  );
}
