import Plugin from "../Plugin";
import Auth from "../helpers/Auth";

export default class Ignore extends Plugin {

    static get plugin() {
        return {
            name: "Ignore",
            description: "Ignore users",
            help: "Syntax: /ignore <ID>",

            visibility: Plugin.Visibility.VISIBLE,
            type: Plugin.Type.NORMAL | Plugin.Type.PROXY,

            needs: {
                database: true
            }
        };
    }

    start() {
        if (!this.db.ignored)
            this.db.ignored = [];
    }

    proxy(eventName, message) {
        if (this.db.ignored.indexOf(message.from.id) !== -1)
            return Promise.reject();
        return Promise.resolve();
    }

    onCommand({message, command, args}, reply) {
        switch (command) {
        case "ignorelist":
            return reply({
                type: "text",
                text: JSON.stringify(this.db.ignored)
            });
        case "ignore": {
            let target;
            if (args.length === 1) {
                target = args[0];
                if (/[@a-z_]/i.test(target))
                    return reply({
                        type: "text",
                        text: "Syntax: `/ignore <ID>`"
                    });
            } else if (message.reply_to_message) {
                if (message.reply_to_message.new_chat_participant)
                    target = message.reply_to_message.new_chat_participant.id;
                else if (message.reply_to_message.left_chat_participant)
                    target = message.reply_to_message.left_chat_participant.id;
                else
                    target = message.reply_to_message.from.id;
            } else
                return reply({
                    type: "text",
                    text: "No target found."
                });

            if (Auth.isMod(target)) return reply({
                type: "text",
                text: "Can't ignore mods."
            });

            this.db.ignored.push(target);

            reply({
                type: "text",
                text: "Ignored."
            });
            return;
        }
        case "unignore": {
            let target;
            if (args.length === 1) {
                target = args[0];
                if (/[@a-z_]/i.test(target))
                    return reply({
                        type: "text",
                        text: "Syntax: `/ignore <ID>`"
                    });
            } else if (message.reply_to_message) {
                if (message.reply_to_message.new_chat_participant)
                    target = message.reply_to_message.new_chat_participant.id;
                else if (message.reply_to_message.left_chat_participant)
                    target = message.reply_to_message.left_chat_participant.id;
                else
                    target = message.reply_to_message.from.id;
            } else
                return reply({
                    type: "text",
                    text: "No target found."
                });

            this.db.ignored = this.db.ignored.filter(id => id !== target);
            reply({
                type: "text",
                text: "Done."
            });
            return;
        }
        default:
            return;
        }
    }
}
