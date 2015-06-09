module.exports  = function acl(req, res, next){

  RBAC.find({ where: { action: '*',
                      controller: req.options.controller,
                      rol_id: req.get('X-USER-ROL')
                    }
          })
  .exec(function(err, rbacsA){

    if(rbacsA.length == 0){
      Acl.find({ where: { action: req.options.action,
                          controller: req.options.controller,
                          rol_id: req.get('X-USER-ROL')
                        }
              })
      .exec(function(err, rbacsB){

        if(rbacsB.length > 0){
          next();
        }else{
          return res.send(403, { controller: req.options.controller, action: req.options.action } )
        }

      });
    }else{
      if(rbacsA.length > 0){
        next();
      }else{
        return res.send(403, { controller: req.options.controller, action: req.options.action } )
      }

    }

  });
};
