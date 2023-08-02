import moment from 'moment';

import Command from './Command';
import Deposit from "../../Models/Deposit";
import Http from "../../../Http";
import Site from "../../Models/Site";
import Player from "../../Models/Player";


class ConfirmDeposit extends Command {

    constructor() {
        super();
    }

    async handle() {

        const sites = await Site.findAll({});

        for (let j = 0; j < sites.length; j++) {

            const api_key = (sites[j] as any).api_key as string
            const site_id = (sites[j] as any).id as string

            const pending_deposits = await Deposit.findAll({
                where: {
                    verify_at: null,
                    status: 'pending',
                    site_id: site_id
                },
                include: ['coin']
            });

            for (let i = 0; i < pending_deposits.length; i++) {

                const current_pending_deposit = pending_deposits[i] as any;

                const url = process.env.COUNOS_BASE_URL + `terminal/order/${current_pending_deposit.id}`;

                const expected_coin_amount = current_pending_deposit.coin_amount;
                const expected_amount = current_pending_deposit.amount;

                Http.get(url)
                    .addHeaders({key: "accept", value: "application/json"})
                    .addHeaders({key: "Content-Type", value: 'application/json'})
                    .addHeaders({key: "x-api-key", value: api_key})
                    .build()
                    .getAsString(async (data: any) => {
                        data = JSON.parse(data).data;

                        console.log(data.paid)

                        if (data.paid === true) {
                            console.log(parseFloat(data.paidAmount))
                            console.log(parseFloat(expected_coin_amount))

                            if (parseFloat(parseFloat(data.paidAmount).toFixed(4)) >= parseFloat(parseFloat(expected_coin_amount).toFixed(4))) {

                                console.log(data.ticker.keyword.toString().toLowerCase())
                                console.log(current_pending_deposit.coin.symbol.toLowerCase())

                                if (data.ticker.keyword.toString().toLowerCase() === current_pending_deposit.coin.symbol.toLowerCase()) {
                                    const tx_id = data.transactionId;

                                    await Deposit.update(
                                        {
                                            status: 'success',
                                            tx_id: tx_id,
                                            verify_at: moment().format('YYYY-MM-DD HH:mm:ss')
                                        },
                                        {
                                            where: {
                                                id: current_pending_deposit.id
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
                        }
                    })
            }

        }


    }

    get_interval_time() {
        return 1000 * 60 * 2;
    }

}

export default ConfirmDeposit