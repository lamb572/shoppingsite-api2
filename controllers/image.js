const {ClarifaiStub, grpc} = require("clarifai-nodejs-grpc");

const stub = ClarifaiStub.grpc();

const metadata = new grpc.Metadata();
metadata.set("authorization", "Key 5f0a4e4d16f94fc0a42ac5cd6ea3eab5");


const handleApiCall= (req, res) =>{

    stub.PostModelOutputs(
        {
            // This is the model ID of a publicly available General model. You may use any other public or custom model ID.
            model_id: "bd367be194cf45149e75f01d59f77ba7",
            inputs: [{data: {image: {url: req.body.input}}}]
        },
        metadata,
        (err, response) => {
            if (err) {
                console.log("Error: " + err);
                return;
            }
    
            if (response.status.code !== 10000) {
                console.log("Received failed status: " + response.status.description + "\n" + response.status.details);
                return;
            }

            // return date
            res.json(response.outputs[0].data.concepts);

            // only logs on server - to be removed
            // console.log("Predicted concepts, with confidence values:")
            // for (const c of response.outputs[0].data.concepts) {
            // console.log(c.name + ": " + c.value);
            // }
        }
    );


}



const handleImage = (req, res, db) =>{
    const {id} =req.body;
    db('users').where('id', '=', id)
    .increment('entries', 1)
    .returning('entries')
    .then(entries => {
        res.json(entries[0]);
    })
    .catch(err => res.status(400).json('unable to get entries'))
}


module.exports={
    handleImage,
    handleApiCall
}