import Plugin from "../Plugin";
import request from "request";

export default class BoobsButts extends Plugin {
    static get plugin() {
        return {
            name: "BoobsButts",
            description: "Get boobs and butts.",
            help: "Just type /boobs or /butts."
        };
    }

    onCommand({message, command, args}, reply) {
        switch (command) {
        case "boobs":
        case "butts":
            request(`http://api.o${command}.ru/noise/1`, (err, _, data) => {
                if (err)
                    return reply({
                        type: "text",
                        text: "An error occurred."
                    });

                const item = JSON.parse(data)[0];
                reply({
                    type: "text",
                    text: `http://media.o${command}.ru/${item.preview}`
                });
            });
            return;
        default:
            return;
        }
    }
}
