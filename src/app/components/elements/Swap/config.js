import SSC from 'sscjs';
const ssc = new SSC('https://api.steem-engine.com/rpc');
import { api } from '@steemit/steem-js';

var mainnode = {
    name: 'main_node',
    account: 'sct.jcob',
    tokens: ['KRWP', 'ORG', 'SVC'],
    liqudity_token: ['HABIT'],
};

var subnode = [
    {
        name: 'kporg',
        account: 'sct.kporg',
        tokens: ['KRWP', 'ORG'],
        liqudity_token: 'HABIT',
    },
    {
        name: 'kpsvc',
        account: 'sct.kpsvc',
        tokens: ['KRWP', 'SVC'],
        liqudity_token: 'HABIT1',
    },
];

class swapConfig {
    constructor() {
        // 선택할 수 있는 input token
        this.input_token_list = [
            'SCT',
            'SCTM',
            'KRWP',
            'SBD',
            'STEEM',
            'ORG',
            'SVC',
            'DEC',
        ];
        // 선택할 수 있는 output token
        this.output_token_list = [
            'SCT',
            'SCTM',
            'KRWP',
            'SBD',
            'STEEM',
            'ORG',
            'SVC',
            'DEC',
        ];
        // fee
        this.swap_fee = 3.0;
        this.nodes = subnode;
        this.mainNode = mainnode;
    }

    getSteemBalance(account) {
        return new Promise((resolve, reject) => {
            api.getAccounts([account], function(err, response) {
                if (err) reject(err);
                resolve(response[0].balance);
            });
        });
    }

    getSBDBalance(account) {
        return new Promise((resolve, reject) => {
            api.getAccounts([account], function(err, response) {
                if (err) reject(err);
                resolve(response[0].sbd_balance);
            });
        });
    }

    getTokenBalance(account, symbol) {
        if (symbol == 'STEEM') return this.getSteemBalance();
        else if (symbol == 'SBD') return this.getSBDBalance();
        else {
            return new Promise((resolve, reject) => {
                ssc.findOne(
                    'tokens',
                    'balances',
                    { account, symbol },
                    (err, result) => {
                        if (err) reject(err);
                        // console.log(result)
                        if (result == null) resolve('0.0');
                        else resolve(result.balance);
                    }
                );
            });
        }
    }

    findNode(input_token, output_token) {
        var validNode = null;
        for (const node of this.nodes) {
            var one = node.tokens.find(token => token == input_token);
            var two = node.tokens.find(token => token == output_token);
            if (one != undefined && two != undefined && one != two) {
                validNode = node;
                break;
            }
        }
        return validNode;
    }

    async calculateExchangeAmount(input_token, output_token, input_amount) {
        var validNode = this.findNode(input_token, output_token);
        if (validNode == null) return 0;
        console.log(validNode);
        var balance = await Promise.all([
            this.getTokenBalance(validNode.account, input_token),
            this.getTokenBalance(validNode.account, output_token),
        ]);
        // input, output balance
        console.log(balance);
        var alpha = input_amount / balance[0];
        var rate_fee = (100.0 - this.swap_fee) / 100.0;
        var estimated_output_amount =
            balance[1] * (alpha * rate_fee) / (1 + alpha * rate_fee); // transfer this to user
        return estimated_output_amount;
    }
}

export default swapConfig;
