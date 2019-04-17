module.exports = function(RED) {
    function SignalScaleNode(config) {
        RED.nodes.createNode(this,config);
        var node = this;
        node.on('input', function(msg) {
            msg.payload = (msg.payload - config.min) / (config.max - config.min);
            msg.payload = Math.max(0, Math.min(1, msg.payload));
            node.send(msg);
        });
    }
    RED.nodes.registerType("signal-scale", SignalScaleNode);
}