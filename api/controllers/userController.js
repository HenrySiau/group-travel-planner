var {User} = require('../../models');

exports.setUser = (req, res) => {
    return User
        .create({
            userName: 'Henry',
            email: 'henry@henry.com'
        })
        .then(user => { res.send(user.userName)})
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