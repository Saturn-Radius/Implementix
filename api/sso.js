function SimpleProfileMapper (pu) {
  if(!(this instanceof SimpleProfileMapper)) {
    return new SimpleProfileMapper(pu);
  }
  this._pu = pu;
}

SimpleProfileMapper.prototype.getClaims = function() {
  
  var self = this;
  var claims = {};

  SimpleProfileMapper.prototype.metadata.forEach(function(entry) {
    claims[entry.id] = entry.multiValue ?
      self._pu[entry.id].split(',') :
      self._pu[entry.id];
  });
  return claims;
};

SimpleProfileMapper.prototype.getNameIdentifier = function() {
  return { 
    nameIdentifier:                  this._pu.email
  };
};


SimpleProfileMapper.prototype.metadata = [{
  id: "email",
  optional: false,
  displayName: 'E-Mail Address',
  description: 'The e-mail address of the user',
  multiValue: false
}];

module.exports = SimpleProfileMapper;