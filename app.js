const canvas = document.getElementById("myCanvas");
const ctx = canvas.getContext("2d");
function setup() {
    canvas.width = 800;
    canvas.height = 600;
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
}
function draw(ctx, angle) {
    ctx.beginPath();
    ctx.fillStyle = "rgba(0, 0, 0, 0.05)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.closePath();
    ctx.transform(1, 0, 0, 1, canvas.width / 2, canvas.height / 2);
    
    ctx.beginPath();
    ctx.arc(0, 0, 95, 0, 2*Math.PI);
    ctx.fillStyle = "black";
    ctx.fill();
    ctx.closePath();
    
    ctx.beginPath();
    ctx.arc(0, 0, 4, 0, 2*Math.PI);
    ctx.fillStyle = "gray";
    ctx.fill();
    ctx.closePath();
    
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(95*Math.cos(angle), 95*Math.sin(angle));
    ctx.closePath();
    ctx.strokeStyle = "gray";
    ctx.stroke();
    
    ctx.beginPath();
    ctx.arc(100*Math.cos(angle), 100*Math.sin(angle), 5, 0, 2*Math.PI);
    ctx.fillStyle = "rgba(200, 200, 255, 0.05)";
    ctx.fill();
    ctx.closePath();
    
    ctx.transform(1, 0, 0, 1, -canvas.width / 2, -canvas.height / 2);
}

// Pendulum
// x'' + (g/L)*sin(x) = 0
// x0' = x1
// x1' = -b*x - (g/L)*sin(x0) + A*cos(w*t)
function funcX1(t, y) {
    return y[1];
}
function funcX2(t, y) {
    return -b*y[1] - Math.sin(y[0]) + A*Math.cos(w*t);
}

function energy(x) {
    return 1*1*(1-1*Math.cos(x[0])) + 0.5*x[1]*x[1];
}


// System parameters
// Chaotic behavior: b = 0.05, A = 0.6, w = 0.7
let b = 0;
let A = 0;
let w = 0;
// System Initial conditions
let Energy = 1;
let x = [0, Math.sqrt(2*Energy)];
let nextX = [0, 0];
let functions = [funcX1, funcX2];
let t = 0;
let h = 0.1;


// Fourth-order Runge-Kutta
function RK4(func, t, y, h) {
    let k1 = [];
    let k2 = [];
    let k3 = [];
    let k4 = [];
    for (let i = 0; i < func.length; i++) {
        k1.push(func[i](t, y));
    }
    for (let i = 0; i < func.length; i++) {
        k2.push(func[i](t + h*0.5, y.map((x, j) => x + (h*0.5)*k1[j])));
    }
    for (let i = 0; i < func.length; i++) {
        k3.push(func[i](t + h*0.5, y.map((x, j) => x + (h*0.5)*k2[j])));
    }
    for (let i = 0; i < func.length; i++) {
        k4.push(func[i](t + h, y.map((x, j) => x + h*k3[j])));
    }
    return y.map((x, j) => x + (h/6.0)*(k1[j] + 2.0*k2[j] + 2.0*k3[j] + k4[j]));
}


function animate() {
    draw(ctx, x[0] + Math.PI/2);
    nextX = RK4(functions, t, x, h);
    x[0] = nextX[0];
    x[1] = nextX[1];
    t += h;
    if ((b === 0 && A === 0) && (energy(x) > Energy*1.05 || energy(x) < Energy*0.95)) {
        console.log("Error too high. Time: " + t);
        console.log("Expected energy: " + Energy + "\nCurrent energy: " + energy(x));
        // return;
    }
    requestAnimationFrame(animate);
    
}


setup();
//setInterval(animate, 1);
animate();

//draw(ctx, x[0]);
