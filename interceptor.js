App.provider("Interceptors", function ($injector) {

  this.$get = function ($injector) {

    return {
      request: function(config){
        config.headers['X-USER-ROL'] = sessionStorage.getItem('rol_id')
        return config;
      }
  }

});
