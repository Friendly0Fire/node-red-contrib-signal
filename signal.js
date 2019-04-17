const math = require('mathjs');

module.exports = function(RED) {
    function SignalNode(config) {
        RED.nodes.createNode(this,config);
        var node = this;
        node.compiledFunction = math.compile(config.fct);
        node.on('input', function(msg) {
            var scope = {};
            scope[config.variable] = msg.payload;
            msg.payload = node.compiledFunction.eval(scope);
            msg.function = config.fct;
            msg.variable = config.variable;
            node.send(msg);
        });
    }
    RED.nodes.registerType("signal", SignalNode);
}