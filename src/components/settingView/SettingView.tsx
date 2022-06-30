import _ from 'lodash';
import React, { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { ChevronDown, ChevronLeft, ChevronUp } from 'react-feather';
import { useConfigStore, useStore } from '../../store';
import useCollapse from 'react-collapsed';

import './SettingView.style.css';
import ThemeToggleButton from '../ThemeToggleButton';
import Equalizer from '../Equalizer';
import RequestSong from '../RequestSong';
import BackdropSetting from '../BackdropSetting';
import { callAPI } from '../../service/API';

interface Props {
  showSetting: boolean;
  useToggleSetting: () => void;
}

const SettingSection = (props: any) => {
  const { title, defaultCallapseState = true, children } = props;

  const [isExpanded, setExpanded] = useState<boolean>(defaultCallapseState);
  const { getCollapseProps, getToggleProps } = useCollapse({ isExpanded });
  const { theme } = useStore((state) => state.setting);

  const iconConfig = { size: 20, color: theme.value.content };

  return (
    <div className="setting-item">
      <div
        className="setting-item__title"
        {...getToggleProps({ onClick: () => setExpanded((prev) => !prev) })}
      >
        <strong style={{ color: theme.value.title }}>{title}</strong>
        {isExpanded ? (
          <ChevronUp {...iconConfig} />
        ) : (
          <ChevronDown {...iconConfig} />
        )}
      </div>
      <section {...getCollapseProps()}>{children}</section>
    </div>
  );
};

const SettingView = ({ showSetting, useToggleSetting }: Props) => {
  const updaConfig = useConfigStore((state) => state.updateConfig);
  const { theme } = useStore((state) => state.setting);

  return (
    <div
      className="setting"
      style={{
        background: theme.value.primary,
        left: showSetting ? 0 : -550,
        display: showSetting ? 'flex' : 'none',
        // opacity: sidebar ? 1 : 0,
      }}
    >
      <h2 className="setting-title" style={{ color: theme.value.title }}>
        SETTING
      </h2>
      <section className="setting-content">
        <SettingSection title="Language">
          <div>
            <a style={{ color: theme.value.content }} className="lang vi">
              Tiếng Việt
            </a>
            <a style={{ color: theme.value.content }} className="lang en">
              English
            </a>
          </div>
        </SettingSection>
        <SettingSection title="Theme">
          <ThemeToggleButton />
        </SettingSection>
        <SettingSection title="Backdrop" defaultCallapseState={false}>
          <BackdropSetting />
        </SettingSection>
        <SettingSection title="Equalizer" defaultCallapseState={false}>
          <Equalizer />
        </SettingSection>
        <SettingSection title="Request song" defaultCallapseState={false}>
          <RequestSong />
        </SettingSection>
        <h3 className="copyright">v0.0.1@lngdao</h3>
      </section>
      <section className="setting-btm">
        <div style={{ cursor: 'pointer' }} onClick={useToggleSetting}>
          <ChevronLeft size={21} color={theme.value.content} />
          <h3 style={{ color: theme.value.content }}>Back</h3>
        </div>
      </section>
    </div>
  );
};

export default SettingView;
