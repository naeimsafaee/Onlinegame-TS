import Command from "./Command/Command"

class Kernel {

    private commands = [
        'UpdateCoins',
        'ConfirmDeposit',
        'CheckWithdraw',
    ]

    run() {
        this.commands.forEach((file) => {

            let command: Command = new (require("./Command/" + file).default)()

            setInterval(command.handle, command.get_interval_time())

        });
    }

}

export default Kernel