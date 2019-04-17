module.exports = function(RED) {
    function SignalTimeNode(config) {
        RED.nodes.createNode(this,config);
        var node = this;

        node.getTime = function(str) {
            const timeRegex = /([0-9]{1,2}):([0-9]{1,2}):([0-9]{1,2})/;
            var timeResult = timeRegex.exec(config.step);
            if(timeResult != null) {
                var outTime = {
                    "hours": parseInt(timeResult[1]),
                    "minutes": parseInt(timeResult[2]),
                    "seconds": parseInt(timeResult[3]),
                    "toSeconds": function() { return this.hours * 3600 + this.minutes * 60 + this.seconds; }
                };

                if(outTime.hours < 0)
                    outTime.hours = 0;
                else if(outTime.hours >= 24)
                    outTime.hours = 23;

                if(outTime.minutes < 0)
                    outTime.minutes = 0;
                else if(outTime.minutes >= 60)
                    outTime.minutes = 59;

                if(outTime.seconds < 0)
                    outTime.seconds = 0;
                else if(outTime.seconds >= 60)
                    outTime.seconds = 59;

                return outTime;
            }

            return null;
        }

        node.tick = function() {
            var minTimeSeconds = node.minTime.toSeconds();
            var maxTimeSeconds = node.maxTime.toSeconds();
            if(node.maxIsNextDay)
                maxTimeSeconds += 24 * 3600;

            var date = Date.now();
            var currentTime = {
                "hours": date.getHours(),
                "minutes": date.getMinutes(),
                "seconds": date.getSeconds()
            };
            var currentTimeSeconds = currentTime.hours * 3600 + currentTime.minutes * 60 + currentTime.seconds;
            var msg = {
                "payload": (currentTimeSeconds - minTimeSeconds) / (maxTimeSeconds - minTimeSeconds)
            };
            msg.payload = Math.max(0, Math.min(1, msg.payload));
            node.send(msg);
        };

        node.minTime = node.getTime(config.min);
        node.maxTime = node.getTime(config.max);
        node.maxIsNextDay = node.minTime.toSeconds() > node.maxTime.toSeconds();

        var timeStep = node.getTime(config.step);
        if(timeStep != null) {
            node.timeout = setInterval(node.tick, timeStep.toSeconds() * 1000);
        }

    }
    RED.nodes.registerType("signal-time", SignalTimeNode);
}