const app = require('./components/app');
const voter = require('./components/voter');
app.listen(process.env.PORT || 3000);
voter();