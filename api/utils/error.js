exports.error = function(message,res){
    return res.status(403).send({ 
        success: false, 
        message: message 
    });
}