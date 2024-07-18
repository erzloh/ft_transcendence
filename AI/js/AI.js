//? Import all Datas from the Pong game


//! Needed function to train the AI
// - Data Init / Data gather from pong
// - Forward Propagation
// - Move the paddle
// - Back Propagation with weights actualization

//! Needs 
    // a function for the sum of the weights
    // a function for the back propagation
    // a function to calculate the cost of the error 
    // all the datas such as bias and weights

//! Activation function
// ReLu (don't know if i'll use it)
// It returns x if it's greater than 0 
function relu(x) {
    return Math.max(0, x);
}

// Tanh
// Hyperbolic tangent
// Used in Hidden layers to normalize the output [-1, 1]
function tanh(x) {
    return Math.tanh(x);
}

// Sigmoid
// Used in Output layer to normalize the output [0, 1]
function sigmoid(x) {
    return 1 / (1 + Math.exp(-x));
}
