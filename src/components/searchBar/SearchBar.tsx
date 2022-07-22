import React, { useRef } from 'react';
import { Search, XCircle } from 'react-feather';
import _ from 'lodash';

import './searchBar.style.css';
import { useStore } from '../../store';
import T from '../../translation/T';

interface Props {
  onSearch: (text: string) => void;
  onClearField: () => void;
  rightStatus?: string;
  deboundDelay?: number;
}

function SearchBar({
  onSearch,
  onClearField,
  rightStatus = '',
  deboundDelay = 500,
}: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const { theme } = useStore((state) => state.setting);

  const handleOnSearchChange = (e: any) => {
    _.debounce(() => onSearch(e.target.value), deboundDelay)();
  };

  return (
    <div style={{ borderColor: theme.value.grey }} className="searchbar">
      <input
        ref={inputRef}
        type="text"
        style={{
          background: theme.value.primary,
          color: theme.value.content,
        }}
        className="searchbar-input"
        placeholder={T().search}
        onChange={handleOnSearchChange}
      />
      {inputRef.current && !!inputRef.current.value.length && (
        <XCircle
          cursor={'pointer'}
          onClick={() => {
            onClearField();
            inputRef.current && (inputRef.current.value = '');
          }}
          size={17}
          style={{ marginRight: 10, color: theme.value.content }}
        />
      )}
      <h3 style={{ color: theme.value.content }}>{rightStatus}</h3>
      {/* <Search size={25} color={'#333'} /> */}
    </div>
  );
}

export default SearchBar;
