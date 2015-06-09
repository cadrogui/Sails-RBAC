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
