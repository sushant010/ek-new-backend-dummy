// app.put("/admin/:id", (req, res) => {
//     LoginAdmin.findOneAndUpdate({_id: req.params.id},{
//       $set:{
//         email : req.body.email,
//         adminname: req.body.adminname
//       }
//     }, function (err, data) {
//       if (err){
//         res.status(500).send(err)
//     } else {
//       res.status(200).send({message: 'UPDATED', data: data})
//     }
//     })
//   })