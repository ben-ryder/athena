import React from 'react';

export function Header() {
  return (
    <header className="bg-br-atom-800 flex justify-between h-[56px]">
      <a href="/" className="flex justify-center items-center ml-3">
        <i className="block w-7 h-7 rounded-full bg-br-teal-600"></i>
        <p className="ml-2 font-bold text-br-whiteGrey-100">Athena</p>
      </a>
    </header>
  );
}
