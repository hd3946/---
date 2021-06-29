module.exports={
    local:{
        host     : process.env.DB_HOST,
        user     : process.env.DB_USER,
        password : process.env.DB_PASSWORD,
        //port     : 3000,
        database : process.env.DB_DATABASE,
        charset  : "utf8"
    }
}

//   console.log("test",process.env.DB_USER);
//   console.log("test",process.env.DB_PASSWORD);
//   console.log("test",process.env.DB_HOST);
//   console.log("test",process.env.DB_DATABASE);