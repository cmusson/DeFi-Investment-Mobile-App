import axios from 'axios'

interface TokenData {
    USDC: number
    USDT: number
    DAI: number
}

const getAPYData = async () => {
    try {
        const response = await axios.get(
            'https://api.compound.finance/api/v2/ctoken'
        )
        const data = response.data

        const filteredUSDC = data.cToken.filter(
            (x: { underlying_symbol: string }) => x.underlying_symbol == 'USDC'
        )

        const filteredUSDT = data.cToken.filter(
            (x: { underlying_symbol: string }) => x.underlying_symbol == 'USDT'
        )

        const filteredDAI = data.cToken.filter(
            (x: { underlying_symbol: string }) => x.underlying_symbol == 'DAI'
        )

        const APY: TokenData = {
            USDC: filteredUSDC[0].supply_rate.value * 100,
            USDT: filteredUSDT[0].supply_rate.value * 100,
            DAI: filteredDAI[0].supply_rate.value * 100,
        }

        return APY
    } catch (error) {
        console.log(error)
    }
}

export default getAPYData
