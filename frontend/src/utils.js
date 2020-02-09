import React, { useState, useEffect } from 'react';
import JSONBigInt from 'json-bigint';

export const useStateWithLocalStorage = (localStorageKey) => {
    const [value, setValue] = useState(
        localStorage.getItem(localStorageKey) || ''
    );
    useEffect(() => {
        localStorage.setItem(localStorageKey, value);
    }, [value]);
    return [value, setValue];
};