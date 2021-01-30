const updateAddress = (req, res, db) =>{

    const {email, address, address2, town, county, postcode} = req.body;
    if(!email || !address|| !address2 || !town || !county || !postcode){
        return res.status(400).json('incorrect form submission')
        
    }else{
        db.transaction(trx => {

            return trx
                .where({ email: email })
                .update({
                    address:address,
                    address2:address2,
                    town:town,
                    county:county, 
                    postcode:postcode
                }, ['address', 'address2', 'town', 'county', 'postcode' ])
                .into('users')
                .returning('email')
                .then(loginEmail =>{
                    res.json('itemsupdated')
                })
        })
        .catch(err => {
                res.status(400).json('unable to update')
    
        })
    }
    
}

module.exports={
    updateAddress: updateAddress
}