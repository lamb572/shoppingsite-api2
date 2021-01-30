const handleRegister = (req, res, db, bcrypt, saltRounds) =>{
    const {email, password, name, surname, confirmPassword, address, address2, town, county, postcode} = req.body;
    if(!email || !password || !name || !surname || !confirmPassword || !address || !town || !county || !postcode){
        console.log(res)
        return res.status(400).json('incorrect form submission')
        
    }
    bcrypt.hash(confirmPassword, saltRounds, function(err, hash) {
    
        db.transaction(trx => {
        trx.insert({
            hash: hash,
            email: email
        })
        .into('login')
        .returning('email')
        .then(loginEmail =>{
            return trx('users')
            .returning('*')
            .insert({
                email: loginEmail[0],
                name: name,
                surname: surname,
                address:address,
                address2:address2,
                town:town,
                county:county, 
                postcode:postcode
            }) 
            .then(user => {
                res.json(user[0]);
            })
            
        })
        .then(trx.commit)
        .catch(trx.rollback)
    })
        
        .catch(err => {
            if (err.detail.includes('email') && err.detail.includes('already exists')){
                console.log('email')
                res.json('email')
            }else{
                res.status(400).json('unable to register')
            }
        })
    }); 
    
}

module.exports={
    handleRegister: handleRegister
}