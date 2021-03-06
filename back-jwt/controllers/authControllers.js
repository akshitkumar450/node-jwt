const Auth = require("../model/authModel");
const jwt = require("jsonwebtoken");

const handleError = (err) => {
  return {
    status: "fail",
    message: err.message,
  };
};

const maxAge = 3 * 24 * 60 * 60; //3days (in seconds)
const createToken = (id) => {
  // create token
  // first -> payload
  // second -> secret string
  return jwt.sign({ id }, "super-secret-key", {
    expiresIn: maxAge,
  });
};

const getLogin = (req, res) => {
  res.send("login");
};
const postLogin = async (req, res) => {};

const getSignup = (req, res) => {
  res.send("Signup");
};

const postSignup = async (req, res) => {
  // console.log(req.body);
  const { email, password } = req.body;
  try {
    const newUser = await Auth.create({ email, password });
    const token = createToken(newUser._id);
    if (newUser) {
      // setting the cookie

      res.cookie("jwt", token, {
        // httpOnly: true,
        maxAge: 3 * 1000 * 60 * 60 * 24, //3days
      });

      res.status(200).json({
        status: "success",
        data: newUser._id,
      });
    } else {
      throw new Error("error in signup");
    }
  } catch (err) {
    // console.log(err);
    const errors = handleError(err);
    res.status(400).json(errors);
  }
};

// setting the cookie

const setCookie = (req, res) => {
  // this value will be stored in the browser
  // setting a cookie

  // res.setHeader("set-cookie", "newsuer=true");
  // res.send("cookie set");

  // using 3rd party package
  // is already present then it will update else will create a new cookie
  res.cookie("name", "ninas");
  res.cookie("newuser", true, {
    maxAge: 1000 * 60 * 60 * 24, //expires in 1 day (time in ms)
    // secure: true, //for https,
    // httpOnly: true, // can't be accessed by javascript in browser
  });
  res.send("cookie set");
};

// reading the cookie
const getCookie = (req, res) => {
  const cookies = req.cookies;
  // console.log(cookies);
  res.send(cookies);
};

module.exports = {
  getLogin,
  postLogin,
  getSignup,
  postSignup,
  setCookie,
  getCookie,
};
