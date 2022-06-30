import React, { ImgHTMLAttributes, memo, useState } from 'react';
import { Oval } from 'react-loader-spinner';

interface Props extends ImgHTMLAttributes<HTMLImageElement> {
  onClick: () => void;
  style?: React.CSSProperties;
  imageStyle?: React.CSSProperties;
  wrapperClass?: string;
}

function FastImage(props: Props) {
  const { style, imageStyle, onClick, wrapperClass, ...imageProps } = props;
  const [isLoading, setIsLoading] = useState<boolean>(true);

  return (
    <div
      className={wrapperClass}
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        ...style,
      }}
      onClick={onClick}
    >
      {isLoading && <Oval color="#333" height={15} width={15} />}
      <img
        style={{
          display: isLoading ? 'none' : 'block',
          // width: '100%',
          height: '100%',
          ...imageStyle,
        }}
        onLoad={() => setIsLoading(false)}
        {...imageProps}
      />
    </div>
  );
}

export default memo(FastImage);
