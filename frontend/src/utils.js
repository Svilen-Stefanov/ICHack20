import React, { useState, useEffect } from 'react';

export const useStateWithLocalStorage = (localStorageKey) => {
    const [value, setValue] = useState(
        localStorage.getItem(localStorageKey) || ''
    );
    useEffect(() => {
        localStorage.setItem(localStorageKey, value);
    }, [value]);
    return [value, setValue];
};