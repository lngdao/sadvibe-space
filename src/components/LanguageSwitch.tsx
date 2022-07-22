import React from 'react';
import { lngParamsList } from '../config';
import { useI18n } from '../hooks/useI18n';
import { useStore } from '../store';
import T from '../translation/T';

function LanguageSwitch() {
  const { theme, lng } = useStore((state) => state.setting);
  const updateLngConfig = useStore((state) => state.updateLngConfig);

  const { changeLanguage } = useI18n();

  return (
    <div>
      {lngParamsList.map((lang, index) => (
        <a
          key={index}
          style={{
            color: theme.value.content,
            marginLeft: index != 0 ? 15 : 0,
            textDecoration: lang == lng ? 'underline' : 'none',
          }}
          onClick={() => {
            changeLanguage(lang);
            updateLngConfig(lang);
          }}
          className={`lng`}
        >
          {T()[lang]}
        </a>
      ))}
    </div>
  );
}

export default LanguageSwitch;
