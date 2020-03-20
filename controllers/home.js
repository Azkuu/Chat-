
module.exports = function(async, Club, _){
    return {
        SetRouting: function(router){
            router.get('/home', this.homePage);
        },
        homePage: function(req, res) {
            async.parallel([
                function(callback){
                    Club.find({},(err, result) => {
                        callback(err, result);
                    })
                },

                function(callback){
                    Club.aggregate([{
                        $group: {
                            _id: "$country"
                        }
                    }], (err, newResult) => {
                       callback(err, newResult) ;
                    });
                },
                
            ],(err, results) => {
                const res1 = results[0]; // ini yg function first ats tu
                const res2 = results[1];
               // console.log(res2);

                const dataChunk = [];
                const chunkSize = 4;
                for (let i = 0; i <res1.length; i += chunkSize){
                    dataChunk.push(res1.slice(i, i+=chunkSize));
                }

                  
                const countrySort = _.sortBy(res2, '_id');
               
                res.render('home', {tittle: 'Chat - Home', user:req.user, chunks:dataChunk, country:countrySort});
            })
            
        }
            
    }
    
} 
























