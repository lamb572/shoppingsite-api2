const updatePassword = (req, res, db, bcrypt, saltRounds) =>{

    const {email, password, confirmPassword, currentPassword } = req.body;
    if(!email || !password || !confirmPassword || !currentPassword ){
        return res.status(400).json('incorrect form submission')
        
    }else{
        

        db.select('email', 'hash').from('login')
            .where('email', '=', email )
            .then(data => {
                bcrypt.compare(currentPassword, data[0].hash, function(err, result) {
                if (result){
                    return bcrypt.hash(confirmPassword, saltRounds, function(err, hash) {
                        db.transaction(trx => {

                            return trx
                                .where({ email: email})
                                .update({
                                    hash: hash
                                }, ['hash'])
                                .into('login')
                                .returning('email')
                                .then(loginEmail =>{
                                    res.json('itemsupdated')
                                })
                        })
                        .catch(err => {
                                res.status(400).json('unable to update')
                    
                        })
                    })

                }else{
                    res.json('wrongcredentials')
                }
            })
            })
        .catch(err => {res.status(400).json('error'); console.log(err)})
            
    }
    
}

module.exports={
    updatePassword: updatePassword
}