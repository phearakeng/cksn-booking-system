import "reflect-metadata";
import app from './app';
import fs = require('fs');

const PORT = 8081;
app.listen(PORT, () => {
    console.log('Server start listening on port ' + PORT);
})