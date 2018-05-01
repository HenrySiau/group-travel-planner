var User = require('../../models').User;

exports.setUser = (req, res) => {
    return User
        .create({
            name: 'Henry'
        })
        .then(user => { res.send(user.name)})
        .catch(error => { res.send(error)});
    
}

exports.getUsers = async (req, res) => {
    User.findAll().then(users => {
        // if (users) {
        //     return res.json(users);
        // }
        console.log(users);
        return(users);
    })
    .then((users) => {
        console.log('second .then: ' + users);
        return res.json(users);
    })
    .catch(error => { res.send(error)});
    // console.log('start fetching users');
    // try{
    //     const users = await User.findAll();
    //     console.log('after fetching users');
    //     return res.send(users);
    // }catch(err){
    //     return res.status(400).send(err);
    // }
    
   
    

}