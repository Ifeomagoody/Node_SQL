const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql');


const app = express()
const port = process.env.PORT || 5000;                  //the first is if we want to publish our app

app.use(bodyParser.urlencoded({ extended: false }))                                        //to make sure that the app is using bodyparser because we will be making use of json files


app.use(bodyParser.json())                        //this helps to convert json files

//mysql code
const pool = mysql.createPool({
  //a connection pool is usually faster
  connectionLimit: 10, //max number that can be created once
  host: "localhost",
  user: "root",
  password: "",
  database: "nodejs_beers",
});


//the first request is to be able to get beers from the db
app.get('', (req, res) => {
   pool.getConnection((  err, connection) => {                          //to connect to a pool
     if(err) throw err                                               //to check for error
     console.log(`connected as id ${connection.threadId}`)


     //query method
     connection.query('SELECT * from beers', (err, rows) => {
         connection.release()                                           //THIS RETURNS THE CONNECTION TO POOL
  
         if(!err) {
            res.send(rows)
         }else{
            console.log(err)
         }
         
     })

   })

})




//get a beer by using its id
app.get('/:id', (req, res) => {
   pool.getConnection((  err, connection) => {                         
     if(err) throw err                                              
     console.log(`connected as id ${connection.threadId}`)


     //query method
     connection.query('SELECT * from beers WHERE id = ?' , [req.params.id], (err, rows) => {
         connection.release()                                       
  
         if(!err) {
            res.send(rows)
         }else{
            console.log(err)
         }
         
     })

   })

})








//how to delete a record
app.delete('/:id', (req, res) => {
   pool.getConnection((  err, connection) => {                         
     if(err) throw err                                              
     console.log(`connected as id ${connection.threadId}`)


     //query method
     connection.query('Delete from beers', (err, rows) => {
         connection.release()                                         
  
         if(!err) {
            res.send(`Beer with the Record ID: ${[req.params.id]} has been removed!`)
         }else{
            console.log(err)
         }
         
     })

   })
})





//add a record
app.post("", (req, res) => {
  pool.getConnection((err, connection) => {
    if (err) throw err;
    console.log(`connected as id ${connection.threadId}`);


    const params = req.body


    connection.query("INSERT INTO beers SET ?", params, (err, rows) => {
      connection.release();

      if (!err) {
        res.send(
          `Beer with the Record name: ${params.name} has been added!`
        );
      } else {
        console.log(err);
      }
    });

    console.log(req.body)
  });
});





//to update a record
app.put("", (req, res) => {


  pool.getConnection((err, connection) => {
    if (err) throw err;
    console.log(`connected as id ${connection.threadId}`);

    const params = req.body;
    const {id, name, tagline, description, imagge } = req.body   //the object is sent as a JSON format and got as a body-parser



    connection.query("UPDATE beers SET name = ? tagline = ?, description = ?, image = ?, WHERE id = ?", [name, tagline, description, id], (err, rows) => {
      connection.release();

      if (!err) {
        res.send(`Beer with the Record name: ${name} has been added!`);
      } else {
        console.log(err);
      }
    });

    console.log(req.body);
  });
});




//listening on port 5000
app.listen(port, () => console.log(`Listening on port ${port}`));


