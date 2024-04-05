const mongoose = require('mongoose');

const connect = mongoose.connect(process.env.MONGO_URL);

connect.then(()=>{
    console.log("CONNECTED TO DATABASE...");
})
.catch((err)=>{
    console.log("FAILED TO CONNECT DATABASE...")
    console.log(err);
});

module.exports = connect;