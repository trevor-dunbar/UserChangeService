const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const changeRouter = require('./routes/changeRouter')();

const app = express();
const db = mongoose.connect("mongodb://localhost/ConditionManagement")
const port = process.env.PORT || 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

const swaggerUi = require('swagger-ui-express')
const swaggerFile = require('./swagger_output.json')
app.use('/doc', swaggerUi.serve, swaggerUi.setup(swaggerFile))

app.use('/api', changeRouter);


app.listen(port, () => {
    console.log(`running on port:  + ${port}`)
});