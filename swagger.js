const swaggerAutogen = require('swagger-autogen')()

const outputFile = './swagger_output.json'
const endpointsFiles = ['./routes/changeRouter.js']

swaggerAutogen(outputFile, endpointsFiles).then(() => {
    require('./app.js')
})