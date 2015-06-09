# Sails RBAC - Role Based Access Control
#### Version 1.0.0
This is an approach to restricting system access to authorized users, based on a role id for certain users.

This approach was designed for work in conjunction with AngularJS, in AngularJS you must implement an interceptor for HTTP request, in this interceptor yor must pass a custom header to sails like this:

````
App.provider("Interceptors", function ($injector) {
  this.$get = function ($injector) {
    return {
      request: function(config){
        config.headers['X-USER-ROL'] = user_role_id
        return config;
      }
  }
});
````

In this way every request goes with the user role id, and sails verify if in the model if exists the pair controller - action for given role id

Allow in your SailsJS the custom header X-USER-ROL in cors.js file

The RBAC works as Policy in SailsJS, you must copy the policies/rbac.js in your policies folder in sails.

The logic for give permission is very simple:

* Use * for allow all methods in your controller
* Use the allowed method name in action in the model action field for allow specific methods

here is the code:

````
module.exports  = function acl(req, res, next){

  RBAC.find({ where: { action: '*',
                      controller: req.options.controller,
                      rol_id: req.get('X-USER-ROL')
                    }
          })
  .exec(function(err, rbacsA){

    if(rbacsA.length == 0){
      RBAC.find({ where: { action: req.options.action,
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
````

And finally you mus create this model in you database and place it in your models folder in sails.

##### This model has a one to many relationship between RBAC and role

````
module.exports =
 {
   "identity": "RBAC",
   "connection": "your-sails-connection",
   "autoCreatedAt": true,
   "autoUpdatedAt": false,
   "attributes": {
       "id": {
           "type": "INTEGER",
           "primaryKey": "TRUE",
           "autoIncrement": "TRUE"
       },
       "controller": "STRING",
       "action": "STRING",
       "Roles": {
           "model": "Roles",
           "columnName": "rol_id"
       },
       "createdAt": "DATETIME"
   }
}
````
