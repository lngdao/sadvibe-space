import React, { useEffect, useState } from 'react';
import { Moon, Sun, ToggleLeft } from 'react-feather';
import { dark, light } from '../config/theme';
import { useStore } from '../store';

import './settingView/SettingView.style.css';

function ThemeToggleButton() {
  const { theme } = useStore((state) => state.setting);
  const updateThemeConfig = useStore((state) => state.updateThemeConfig);

  const iconConfig = {
    size: 16,
    fill: theme.value.primary,
    color: theme.value.primary,
  };

  const toggleTheme = () => {
    updateThemeConfig({
      type: theme.type == 'dark' ? 'light' : 'dark',
      value: theme.type == 'dark' ? light : dark,
    });
  };

  useEffect(() => {
    if (theme.type == 'light')
      document
        .querySelector('.theme-toggle__innerBtn')!
        .classList.remove('light');
    else
      document.querySelector('.theme-toggle__innerBtn')!.classList.add('light');
  }, [theme.type]);

  return (
    <div className="theme-toggle">
      <div
        className="theme-toggle__btn"
        onClick={toggleTheme}
        style={{
          background: theme.value.content,
        }}
      >
        <div
          style={{ background: theme.value.primary }}
          className={`theme-toggle__innerBtn`}
        ></div>
        <Sun {...iconConfig} />
        <Moon {...iconConfig} />
      </div>
      {/* <span>{darkTheme ? 'dark' : 'light'}</span> */}
    </div>
  );
}

export default ThemeToggleButton;
