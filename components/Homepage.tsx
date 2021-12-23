import React, { useCallback, useEffect } from 'react'
import { StyleSheet, Text, TextInput, View, Image } from 'react-native'
import getAPYData from '../services/APIService'
import TokenInfo from './TokenInfo'

interface TokenData {
    USDC: number
    USDT: number
    DAI: number
}

const Homepage: React.FunctionComponent = () => {
    const [assetAmount, setAssetAmount] = React.useState(0)
    const [data, setData] = React.useState<TokenData | undefined>({
        USDC: 0,
        USDT: 0,
        DAI: 0,
    })
    const [combinedAPY, setCombinedApy] = React.useState(0)
    const [yearEndTotal, setYearEndTotal] = React.useState(0)
    const [totalEarnings, setTotalEarnings] = React.useState(0)
    const [daiPercentage, setDaiPercentage] = React.useState(100)
    const [usdcPercentage, setUsdcPercentage] = React.useState(0)
    const [usdtPercentage, setUsdtPercentage] = React.useState(0)

    // gets latest APY data via API call
    const getData = async (): Promise<void> => {
        try {
            const tokenData = await getAPYData()
            setData(tokenData)
        } catch (error) {}
    }

    useEffect(() => {
        getData()
    }, [assetAmount])

    // calculates APY, Year total and Total Earned
    // useCallback means calculate will only run when the dependencies update
    // function is not recreated with every page rerender
    const calculate = useCallback(
        (value: number) => {
            if (data) {
                const dai = value * (daiPercentage / 100) * (1 + data.DAI / 100)
                const usdc =
                    value * (usdcPercentage / 100) * (1 + data.USDC / 100)
                const usdt =
                    value * (usdtPercentage / 100) * (1 + data.USDT / 100)
                const yET = dai + usdc + usdt
                const tEarnings = yET - value
                const cAPY = ((yET - value) / value) * 100
                setCombinedApy(cAPY)
                setYearEndTotal(yET)
                setTotalEarnings(tEarnings)
            }
        },
        [daiPercentage, usdcPercentage, usdtPercentage]
    )

    return (
        <View style={styles.container}>
            <View style={styles.top}>
                <Image
                    style={styles.img}
                    source={require('../icons/logo.jpeg')}
                />
                <Text style={styles.title}>eFi APY Calculator</Text>
            </View>

            <View style={styles.assetAmount}>
                <Text>$</Text>
                {assetAmount > 0 ? (
                    <TextInput
                        style={styles.input}
                        keyboardType="numeric"
                        returnKeyType="done"
                        placeholder="Add asset amount here..."
                        onChangeText={(text) => {
                            setAssetAmount(Number(text))
                            calculate(Number(text))
                        }}
                    >
                        {assetAmount}
                    </TextInput>
                ) : (
                    <TextInput
                        style={styles.input}
                        keyboardType="numeric"
                        returnKeyType="done"
                        placeholder="Add asset amount here..."
                        onChangeText={(text) => {
                            setAssetAmount(Number(text))
                            calculate(Number(text))
                        }}
                    ></TextInput>
                )}
            </View>

            <Text style={styles.info}>
                Move the sliders and press calculate to calculate your combined
                APY
            </Text>

            <View style={styles.assets}>
                <TokenInfo
                    tokenName="Dai"
                    tokenAcronym="DAI"
                    assetAmount={assetAmount}
                    setPercentage={setDaiPercentage}
                    percentage={daiPercentage}
                    data={data}
                    setPercentage1={setUsdcPercentage}
                    setPercentage2={setUsdtPercentage}
                    previous1={usdcPercentage}
                    previous2={usdtPercentage}
                    calculate={calculate}
                    getData={getData}
                />
                <TokenInfo
                    tokenName="USD Coin"
                    tokenAcronym="USDC"
                    assetAmount={assetAmount}
                    setPercentage={setUsdcPercentage}
                    percentage={usdcPercentage}
                    data={data}
                    setPercentage1={setUsdtPercentage}
                    setPercentage2={setDaiPercentage}
                    previous1={usdtPercentage}
                    previous2={daiPercentage}
                    calculate={calculate}
                    getData={getData}
                />
                <TokenInfo
                    tokenName="Tether"
                    tokenAcronym="USDT"
                    assetAmount={assetAmount}
                    setPercentage={setUsdtPercentage}
                    percentage={usdtPercentage}
                    data={data}
                    setPercentage1={setUsdcPercentage}
                    setPercentage2={setDaiPercentage}
                    previous1={usdcPercentage}
                    previous2={daiPercentage}
                    calculate={calculate}
                    getData={getData}
                />
            </View>
            <View style={styles.bottom}>
                {combinedAPY > 0 ? (
                    <Text style={styles.results}>
                        Combined APY: {combinedAPY.toFixed(2)}%
                    </Text>
                ) : (
                    <Text style={styles.results}>Combined APY: 0%</Text>
                )}

                {yearEndTotal > 0 ? (
                    <Text style={styles.results}>
                        Year End Total: ${yearEndTotal.toFixed(2)}
                    </Text>
                ) : (
                    <Text style={styles.results}>Year End Total: $0</Text>
                )}

                {totalEarnings > 0 ? (
                    <Text style={styles.results}>
                        Total Earnings: ${totalEarnings.toFixed(2)}
                    </Text>
                ) : (
                    <Text style={styles.results}>Total Earnings: $0</Text>
                )}
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#F6EDE4',
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 40,
    },
    img: {
        flex: 1,
        width: 60,
        resizeMode: 'contain',
        position: 'absolute',
        margin: 0,
        bottom: -185,
        right: 202,
    },
    top: {
        display: 'flex',
        flexDirection: 'row',
        bottom: 90,
        left: 20,
        marginTop: 60,
    },
    input: {
        height: 50,
        width: '80%',
        padding: 10,
        backgroundColor: 'white',
        borderRadius: 15,
    },
    info: {
        fontSize: 12,
        bottom: 80,
    },
    title: {
        color: '#FF7A7B',
        fontWeight: 'bold',
        fontSize: 30,
    },
    assetAmount: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        bottom: 90,
        marginTop: 10,
        backgroundColor: 'white',
        borderRadius: 15,
        borderColor: 'black',
        borderWidth: 0.5,
        fontSize: 20,
        paddingLeft: 2,
        marginBottom: 4,
    },
    assets: {
        bottom: 60,
    },
    bottom: {
        display: 'flex',
        justifyContent: 'space-between',
        bottom: 50,
        height: 80,
    },
    results: {
        fontSize: 25,
        margin: 5,
        borderRadius: 5,
        padding: 2,
    },
})

export default Homepage
