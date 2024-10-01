const obj = {
    a: 1,
    b: 2,
    c: 3,
};
let res = 0;
for (const keys in obj) {
    res += obj[keys];
}
console.log("res", res);

const arr = ["react", "javascript"];

// const out = arr.reduce((acc, val) => {
//     if (!Object.prototype.hasOwnProperty.call(acc, val))
//         return { ...acc, [val]: val.length };
//     else return acc;
// }, {});

const output = {};
arr.forEach((ele) => {
    output[ele] = ele.length;
});

console.log("out=>", output);
