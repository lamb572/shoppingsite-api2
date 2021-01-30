const updateUserInfo = (req, res, db) =>{

    const {email, name, surname, updateEmail} = req.body;
    if(!email || !name || !surname || !updateEmail ){
        return res.status(400).json('incorrect form submission')
        
    }else{
        db.transaction(trx => {
            return trx
                .where({ email: email })
                .update({
                    name: name,
                    surname:surname,
                    email: updateEmail
                }, ['name', 'surname', 'email'])
                .into('users')
                .returning('email')
                .then((e)=>{
                    return trx.where({ email: email })
                    .update({email: updateEmail},['email'])
                    .into('login')
                    .returning('email')
                })
                
        })
        
        .then(email =>{
            res.json(email)
        })

        .catch(err => {
            if (err.detail.includes('email') && err.detail.includes('already exists')){
                console.log('email')
                res.json('email')
            }else{
                res.status(400).json('unable to update')
            }
        })
    
    
    
    }
    
}

module.exports={
    updateUserInfo: updateUserInfo
}