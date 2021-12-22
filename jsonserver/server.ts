const jsonServer = require('json-server');
const server = jsonServer.create();
const router = jsonServer.router('jsonserver/db.json');
const middleware = jsonServer.defaults();
const db = require('./db.json');
const fs = require('fs');

server.use(middleware);
server.use(jsonServer.bodyParser);

// server.post('/user/login', (req:any, res:any, next:any) => {
//     const users = readUser();
//     const user = users.filter((u:any) => u.email == req.body.email && u.password == req.body.password)[0];

//     if (user != undefined || user != null)  { // user email and password match and proceed login    
//         res.send(user);
//     } else {
//         res.status(500).send('Email and password doesn\'t match');
//     }
// });

// server.post('/user/register', (req:any, res:any, next:any) => {
//     const users = readUser();
//     const user = users.filter((u:any) => u.email == req.body.email)[0];

//     if (user == undefined || user == null) { // user email doesn't exist and proceed
        
//         if (req.body.password !== req.body.confirmpassword) {
        
//             res.status(401).send('User already exists')    
            
//         } else if (req.body.agreeterms != true || req.body.agreeterms == "") {

//             res.status(401).send('Please agree terms to register account');

//         } else {

//             var totaluser:any = readUser().length;            
//             totaluser = parseInt(totaluser);
//             totaluser++;
//             req.body.id = totaluser;

//             var crypto = require('crypto');
//             var token:any = crypto.randomBytes(20).toString('hex');
//             req.body.token = token;
            
//             var detalis: Object = {
//                 "id": totaluser,
//                 "fullname": req.body.fullname,
//                 "email" : req.body.email,
//                 "password" : req.body.password,
//                 "token" : token,
//                 "agreeterms": req.body.agreeterms
//             };

//             try {
//                 db.users.push(detalis);
//                 fs.writeFileSync('./jsonserver/db.json', JSON.stringify(db));
//             } catch (e) {
//                 console.error(e)
//             }

//             var totalJson = readUser();
//             totalJson.push(detalis);
            
//             res.status(200).send('successfully registered');      

//         }

//     } else {
//         res.status(401).send('User already exists');
//     }


// });

server.post('/users/checkcount', (req:any, res:any, next:any) => {
    var totalusers:any = readUser();
    var usercount: number = 0;
    totalusers.forEach(function(i:any) { if(i.hasOwnProperty(req.body.key)) { if (i[req.body.key] == req.body.value) { usercount++ } } } );
    console.log(usercount);
    return usercount;
});

server.post('/users/count', (req:any, res:any, next:any) => {      
    var totalusers: number = 0;
    var users: any = readUser();
    totalusers = users.length;
    console.log(totalusers);
    return totalusers;
});

server.post('/userlogin', (req: any, res: any, next: any) => {

    var email = req.body.email;
    var password = req.body.password;

    var totalusers:any = readUser();
    var usercount: number = 0;
    totalusers.forEach(function(i:any) { 
        if(i.hasOwnProperty('email') && i.hasOwnProperty('password')) { 
            if (i['email'] == req.body.email && i['password'] == req.body.password) { 
                usercount++; 
            } 
        } 
    } );    

    return usercount;

});


// server.post('/users/register', (req:any, res:any, next:any) => {    

//     var req_validate_key = 'email';

//     var totalusers:any = readUser();
//     var usercount: number = 0;
//     totalusers.forEach(function(i:any) { if(i.hasOwnProperty(req_validate_key)) { if (i[req_validate_key] == req.body.value) { usercount++ } } } );

//     try {
//         // console.log(req.body);
//         db.users.push(req.body);
//         fs.writeFileSync('./jsonserver/db.json', JSON.stringify(db));
//     } catch (e) {
//         console.error(e)
//     }

// });

// server.post('/user/register', (req:any, res:any, next:any) => {    
//     try {
//         db.users.push(req);
//         fs.writeFileSync('./jsonserver/db.json', JSON.stringify(db));
//     } catch (e) {
//         console.error(e)
//     }
// });

// server.use('/users', (req:any, res:any, next:any) => {
//     next();
// });

server.use(router);
server.listen('3000', () => {
    console.log('JSON server is running');
});

function readUser() {
    const dbraw = fs.readFileSync('./jsonserver/db.json');
    const users = JSON.parse(dbraw).users;
    return users;
}