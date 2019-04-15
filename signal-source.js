const math = require('mathjs');

module.exports = function(RED) {
    function SignalSourceNode(config) {
        RED.nodes.createNode(this,config);
        var node = this;
        node.compiledFunction = math.compile(config.fct);
        node.on('input', function(msg) {
            var scope = {};
            scope[config.variable] = msg.payload;
            msg.payload = node.compiledFunction.eval(scope);
            node.send(msg);
        });
    }
    RED.nodes.registerType("signal-source", SignalSourceNode);
}