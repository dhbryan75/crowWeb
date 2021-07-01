export const delay = async(ms) => {
    return new Promise(resolve => setTimeout(resolve, ms));
};

export const randomBool = prob => {
    return Math.random() < prob;
};

export const randomInt = (n, m) => {
    return n + Math.floor(Math.random() * m);
};

export const randomSelect = l => {
    if(l.length == 0) return null;
    return l[randomInt(0, l.length)];
}