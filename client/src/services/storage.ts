export const getItem = (key: string) => localStorage.getItem(key);

export const setItem = (key: string, value: string) => {
    try {
        localStorage.setItem(key, value);
    } catch (error) { /* empty */
    }
};

export const removeItem = (key: string) => localStorage.removeItem(key);
