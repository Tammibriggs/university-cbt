const jwt = require("jsonwebtoken");
const Student = require("../models/Student");

const verifyToken = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization
    if(authHeader) {
      const token = authHeader.split(' ')[1];
      jwt.verify(token, process.env.JWT_SECRET, async (err, decoded) => {
        if(err) return res.status(401).send({code: 'invalid-token', message: 'Token is invalid'})
        req.user = decoded
        next() 
      })
    }else{
      return res.status(401).send({code: 'missing-token', message:'You are not authenticated'})
    }
  } catch (e) {
    res.status(500).send({ message: "A server error occured while verifying token" });
  }
};

const verifyAdmin = (req, res, next) => {
  verifyToken(req, res, () => {
    if(req.user.isAdmin === true){
      next()
    }else{
      res.status(403).json({message: 'Access denied'}) 
    }
  })
}

module.exports = {verifyToken, verifyAdmin};
