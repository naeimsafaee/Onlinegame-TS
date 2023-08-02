import Command from './Command';
import Deposit from "../../Models/Deposit";
import Http from "../../../Http";
import moment from "moment";
import Player from "../../Models/Player";
import Withdraw from "../../Models/Withdraw";
import Site from "../../Models/Site";
import withdraw from "../../Models/Withdraw";

class CheckWithdraw extends Command {

    constructor() {
        super();
    }

    async handle() {

        console.log('CheckWithdraw is running...')

        const sites = await Site.findAll({});

        for (let j = 0; j < sites.length; j++) {

            const app_key = (sites[j] as any).app_key as string
            const site_id = (sites[j] as any).id as string

            const pending_withdraws = await Withdraw.findAll({
                where: {
                    pay_at: null,
                    status: 'pending',
                    site_id: site_id
                },
                include: ['coin' , 'player']
            });

            for (let i = 0; i < pending_withdraws.length; i++) {

                const current_pending_withdraw = pending_withdraws[i] as any;

                const expected_coin_amount = current_pending_withdraw.dollar_amount;
                const expected_amount = current_pending_withdraw.amount;

                Http.get("https://walletapi.counos.org/external/withdraw_request")
                    .addHeaders({key: "accept", value: "application/json"})
                    .addHeaders({key: "Content-Type", value: 'application/json'})
                    .addHeaders({key: "App-Key", value: app_key})
                    .addQueryParameter({key: "request_id" , value: current_pending_withdraw.id})
                    .build()
                    .getAsString(async (data: any) => {

                        // data = JSON.parse(data).data

                        console.log(data);

                        /*await Withdraw.update(
                            {
                                status: 'proceed',
                                tx_id: "",
                                pay_at: moment().format('YYYY-MM-DD HH:mm:ss')
                            },
                            {
                                where: {
                                    id: current_pending_withdraw.id
                                }
                            },
                        )*/


                        /*if (data.paid === true) {
                            if (parseFloat(data.paidAmount) >= parseFloat(expected_coin_amount)) {
                                if (data.ticker.keyword.toString().toLowerCase() === current_pending_deposit.coin.symbol.toLowerCase()) {
                                    const tx_id = data.transactionId;

                                    await Deposit.update(
                                        {
                                            id: current_pending_deposit.id
                                        },
                                        {
                                            where: {
                                                status: 'success',
                                                tx_id: tx_id,
                                                verify_at: moment().format('YYYY-MM-DD HH:mm:ss')
                                            }
                                        },
                                    )

                                    await Player.increment('wallet', {
                                        by: expected_amount,
                                        where: {
                                            id: current_pending_deposit.player_id
                                        }
                                    });

                                }
                            }
                        }*/
                    })
                    .getError((error) => {
                        console.log(error)
                    })
            }

        }


    }

    get_interval_time() {
        return 1000 * 60 * 2;
    }

}

export default CheckWithdraw