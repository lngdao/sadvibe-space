import React, { useRef } from 'react';
import { Search, XCircle } from 'react-feather';
import _ from 'lodash';

import './searchBar.style.css';

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

  const handleOnSearchChange = (e: any) => {
    _.debounce(() => onSearch(e.target.value), deboundDelay)();
  };

  return (
    <div className="searchbar">
      <input
        ref={inputRef}
        type="text"
        className="searchbar-input"
        placeholder="Search"
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
          style={{ marginRight: 10 }}
        />
      )}
      <h3>{rightStatus}</h3>
      {/* <Search size={25} color={'#333'} /> */}
    </div>
  );
}

export default SearchBar;
