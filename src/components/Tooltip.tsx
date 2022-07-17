import React, { useState } from 'react';
import { useStore } from '../store';

interface Props {
  children: React.ReactNode;
  text: string;
  opacity?: number;
  position?: 'left' | 'center' | 'right';
  style?: React.CSSProperties;
  tooltipStyle?: React.CSSProperties;
  childWrapperStyle?: React.CSSProperties;
  fontSize?: number;
  lineHeight?: string;
  badge?: string;
}

const Tooltip = ({
  children,
  text,
  style,
  tooltipStyle,
  childWrapperStyle,
  position = 'center',
  opacity = 0.5,
  fontSize = 14,
  lineHeight = '18px',
  badge,
}: Props) => {
  const [show, setShow] = useState<boolean>(false);
  const { theme } = useStore((state) => state.setting);

  const tooltipPositionCSSValue =
    position == 'center'
      ? { transform: 'translateX(-50%)', left: '50%' }
      : position == 'right'
      ? { right: 0 }
      : {};

  return (
    <div style={{ ...style }} className="tooltip-container">
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          ...childWrapperStyle,
        }}
        onMouseEnter={() => setShow(true)}
        onMouseLeave={() => setShow(false)}
      >
        {children}
      </div>
      {badge && (
        <div
          style={{ background: theme.value.content, color: theme.value.primary }}
          className="tooltip-badge"
        >
          {badge}
        </div>
      )}
      <div
        style={{
          ...tooltipPositionCSSValue,
          fontSize: fontSize,
          lineHeight: lineHeight,
          background: `rgba(0, 0, 0, ${opacity})`,
          ...tooltipStyle,
        }}
        className={show ? 'tooltip-box visible' : 'tooltip-box'}
      >
        {text}
      </div>
    </div>
  );
};

export default Tooltip;
