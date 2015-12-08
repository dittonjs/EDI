module.exports = {
  getWeather: function(city, apiKey, Request, callBack){
    Request.get("api.openweathermap.org/data/2.5/weather?q="+city+",us&APPID="+apiKey)
    .end(function(err, res){
      if(err) console.log(err);
      console.log(res.body);
      callBack(res);
    });
  }
}