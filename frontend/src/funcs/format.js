// ADD THOUSAND SEPARATOR TO LARGE NUMBER
function separator(string) {
    return string.toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, " ");
}

// FILTER ZEROES & EMPTY STRINGS FROM LIST
function filter_zeros(list) {
    const foo = list.filter(value => value !== '0x0000000000000000000000000000000000000000');
    return foo.filter(item => item);
}

export {
    separator,
    filter_zeros
}