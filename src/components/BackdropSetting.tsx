import React, { useCallback, useEffect, useState } from 'react';
import { callAPI } from '../service/API';
import styled from 'styled-components';
import { RotateCw } from 'react-feather';
import Switch from 'react-switch';
import { Oval } from 'react-loader-spinner';
import { solidColorParamsList } from '../config';
import { useStore } from '../store';
import FastImage from './FastImage';

const Title = styled.h4`
  font-weight: 500;
  font-size: 15px;
`;

const GAP_SIZE = 5;
const NUMBER_COLUMN = 5;

const SolidColorSelect = ({
  color,
  onClick,
}: {
  color: string;
  onClick: () => void;
}) => (
  <div
    onClick={onClick}
    style={{ background: color, height: 50, borderRadius: 5 }}
  ></div>
);

const Section = ({
  title,
  children,
  top = 0,
  showReload = false,
  onShowReloadClick,
  isLoading,
}: any) => {
  const { theme } = useStore((state) => state.setting);

  return (
    <div>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          marginTop: top,
          marginBottom: 7,
          justifyContent: 'space-between',
        }}
      >
        <Title style={{ color: theme.value.title }} children={title} />
        
        {showReload &&
          (isLoading ? (
            <Oval color={theme.value.content} height={13} width={13} />
          ) : (
            <RotateCw
              size={15}
              color={theme.value.content}
              onClick={onShowReloadClick}
              cursor={'pointer'}
            />
          ))}
      </div>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'auto '.repeat(NUMBER_COLUMN),
          gridGap: GAP_SIZE,
        }}
      >
        {children}
      </div>
    </div>
  );
};

function BackdropSetting() {
  const [listBackdropImg, setListBackdropImg] = useState([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const updateBackdropConfig = useStore((state) => state.updateBackdropConfig);
  const { theme, backdrop } = useStore((state) => state.setting);

  const getBackdropImg = () => {
    callAPI({
      api: 'backdrop',
      method: 'GET',
      params: { count: 15 },
      beforeSend: () => {
        setIsLoading(true);
      },
      onSuccess(res) {
        setListBackdropImg(res.data);
        setIsLoading(false);
      },
    });
  };

  useEffect(() => {
    getBackdropImg();
  }, []);

  const calcImageWidth = (): number => {
    let wrapper = document.querySelector('.player');
    const wrapperWidth = wrapper?.clientWidth! - 60;

    return (wrapperWidth! - (NUMBER_COLUMN - 1) * GAP_SIZE) / NUMBER_COLUMN;
  };

  const renderBackdropImageSection = useCallback(
    () =>
      listBackdropImg.map((item: any, index) => (
        <FastImage
          key={index}
          style={{ height: 50 }}
          src={item.imgUrl}
          imageStyle={{ width: calcImageWidth(), borderRadius: 5 }}
          onClick={() =>
            updateBackdropConfig({ ...backdrop, type: 'image', value: item })
          }
        />
      )),
    [listBackdropImg, calcImageWidth(), backdrop]
  );

  return (
    <div>
      <Section title={'Solid color'}>
        {solidColorParamsList.map((color, index) => (
          <SolidColorSelect
            key={index}
            onClick={() =>
              updateBackdropConfig({ ...backdrop, type: 'solid', value: color })
            }
            color={color}
          />
        ))}
      </Section>
      <Section
        title={'Random image'}
        top={15}
        showReload
        onShowReloadClick={getBackdropImg}
        isLoading={isLoading}
      >
        {renderBackdropImageSection()}
      </Section>
      <Section title={'Blur image'} top={15}>
        <Switch
          width={58}
          height={30}
          onColor={theme.value.switch}
          uncheckedIcon={false}
          disabled={backdrop.type == 'solid'}
          checkedIcon={false}
          onChange={(check) => {
            updateBackdropConfig({ ...backdrop, blur: check });
          }}
          checked={backdrop.blur}
        />
      </Section>
    </div>
  );
}

export default BackdropSetting;
