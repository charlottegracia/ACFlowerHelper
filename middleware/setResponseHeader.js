module.exports = (req, res, next) => {
    console.log(res);
    res.setHeader('Content-Type', 'application/json');
    next();
}