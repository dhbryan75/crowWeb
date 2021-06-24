export const delay = async(ms) => {
    return new Promise(resolve => setTimeout(resolve, ms));
};

export const randomBool = prob => {
    return Math.random() < prob;
};

export const randomInt = (n, m) => {
    return n + Math.floor(Math.random() * m);
};
