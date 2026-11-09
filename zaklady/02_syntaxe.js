// ZAKLADNI SYNTAXE JAVASCRIPTU

// jednoradkovy komentar

/*
   viceradkovy
   komentar
*/

// zakladni textovy vystup do terminalu
console.log("ahoj");

// PRACE S PROMENNYMI

x = 5;

// ruzne zpusoby deklarace
// 1) pomoci var
var y;

// 2) pomoci let <-- pouzivat!
let z;

// 3) pomoci const
const pi = 3.14; // jiz nejde zmenit
// pi = 3; // chyba

// datove typy

console.log(typeof 3);    // number
console.log(typeof 3.14); // number
console.log(typeof "abc"); // string
console.log(typeof 'abc'); // string
console.log(typeof `abc`); // string
console.log(typeof true);  // boolean
console.log(typeof false); // boolean
console.log(typeof undefined); // undefined

// datove struktury

// 1) pole
let p = [1, 6, -3, "abcd", true, undefined]; // hotovo

console.log(p);
p[4] = false; // indexuje se od nuly
console.log(p);

// 2) objekty
let o = {krestni: "Jakub", prijmeni: "Šenkýř"}; // hotovo

console.log(o);
o.prijmeni = "Lattenberg"; // jedna moznost
console.log(o);
o["prijmeni"] = "Šenkýř"; // druha moznost
console.log(o);

// 3) funkce
function secti(a, b) {
	return a + b;
}

console.log(secti(2, 3));

let f = secti; // funkci lze ulozit do promenne

console.log(f(2, 3));

let vetsi = function (a, b) { // anonymni funkce
	if(a > b)
		return a;
	else
		return b;
};

console.log(vetsi(2, 3));

let mensi = (a, b) => { // arrow function
	if(a < b)
		return a;
	else
		return b;
};

console.log(mensi(2, 3));

// zkracena forma arrow function
let rovno = (a, b) => a == b;

console.log(rovno(5, 3));
console.log(rovno(5, 5));
