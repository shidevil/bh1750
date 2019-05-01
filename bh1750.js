var console = require('console');
var i2c = require('i2c-bus');

var BH1750 = function (opts) {
  this.options = opts || {
    address: 0x23,
    bus: 1,
    command: 0x10,
    length: 2
  };
  this.verbose = this.options.verbose || false;
  if (this.options.wire) {
    this.wire = this.option.wire 
  } else {
    this.wire = i2c.openSync(1);
  }
  /*
  if (!this.wire.readBytes) {
    this.wire.readBytes = function(offset, len, callback) {
      this.writeSync([offset]);
      this.read(len, function(err, res) {
        callback(err, res);
      });
    }
  }*/
};

BH1750.prototype.readLight = function (cb) {
    var self = this;
    if (!cb) {
        throw new Error("Invalid param");
    }
    const bytes = Buffer.alloc(2)
    self.wire.readI2cBlock(0x23, 0x10, 2, bytes, (err) => {
        if (err) {
            if (self.verbose)
                console.error("error: I/O failure on BH1750 - command: ", self.options.command);
            return cb(err, null);
        }
        var hi = bytes[0];
        var lo = bytes[1];
        // if (Buffer.isBuffer(res)) {
           hi = bytes.readUInt8(0);
           lo = bytes.readUInt8(1);
        // }

        var lux = ((hi << 8) + lo)/1.2;
        if (self.options.command === 0x11) {
            lux = lux/2;
        }
        cb(null, lux);
    });
};

module.exports = BH1750;
