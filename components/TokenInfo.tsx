import React, { SetStateAction, useEffect, useState } from 'react'
import { StyleSheet, Text, View } from 'react-native'
import Slider from '@react-native-community/slider'
import { SvgXml } from 'react-native-svg'
import { daiIcon, usdcIcon, usdtIcon } from '../icons/icons'

interface IProps {
    assetAmount: number
    tokenName: string
    tokenAcronym: string
    data: any
    setPercentage: React.Dispatch<SetStateAction<number>>
    percentage: number
    setPercentage1: React.Dispatch<SetStateAction<number>>
    setPercentage2: React.Dispatch<SetStateAction<number>>
    previous1: number
    previous2: number
    calculate: (val: number) => void
    getData: () => void
}

const TokenInfo: React.FunctionComponent<IProps> = ({
    assetAmount,
    tokenName,
    tokenAcronym,
    data,
    setPercentage,
    percentage,
    setPercentage1,
    setPercentage2,
    previous1,
    previous2,
    calculate,
    getData,
}: IProps) => {
    const [startValue, setStartValue] = useState(percentage)
    const apy = data[tokenAcronym]

    useEffect(() => {
        calculate(assetAmount)
    }, [percentage])

    // fix half integer values
    const cleanUp = () => {
        if (previous1 < 0) {
            setPercentage1(0)
        }
        if (previous2 < 0) {
            setPercentage2(0)
        }
    }

    // allocates % of remaining two currencies based on user input
    const assignPercentages = (value: number) => {
        const percentChange = (startValue - value) / 2
        const distribute1 = previous1 + percentChange
        const distribute2 = previous2 + percentChange
        if (distribute1 < 0) {
            const change = distribute1 + percentChange
            setPercentage2(Math.ceil(previous2 + change))
            setPercentage1(0)
        }
        if (distribute2 < 0) {
            setPercentage2(0)
            const change = distribute2 + percentChange
            setPercentage1(Math.floor(previous1 + change))
        }
        if (distribute2 > 0 && distribute1 > 0) {
            setPercentage1(previous1 + Math.floor(percentChange))
            setPercentage2(previous2 + Math.ceil(percentChange))
        }
        cleanUp()
    }

    // sets inital % for calculating the difference
    const onStart = (value: number) => {
        setStartValue(value)
    }

    return (
        <View style={styles.container}>
            <View style={styles.tokenInfo}>
                <View>
                    {tokenAcronym == 'DAI' ? (
                        <SvgXml style={styles.img} xml={daiIcon} />
                    ) : tokenAcronym == 'USDC' ? (
                        <SvgXml style={styles.img} xml={usdcIcon} />
                    ) : (
                        <SvgXml style={styles.img} xml={usdtIcon} />
                    )}
                </View>

                <View style={styles.tokenNames}>
                    <Text>{tokenName}</Text>
                    <Text style={styles.acronym}>{tokenAcronym}</Text>
                </View>
            </View>

            <View style={styles.sliderInfo}>
                <Text>{percentage + '%'}</Text>

                <Slider
                    onSlidingStart={(value) => {
                        onStart(value)
                        getData()
                    }}
                    onSlidingComplete={(value) => {
                        assignPercentages(value)
                    }}
                    style={styles.slider}
                    step={1}
                    minimumValue={0}
                    maximumValue={100}
                    minimumTrackTintColor="#FF7A7B"
                    maximumTrackTintColor="#000"
                    thumbTintColor="#FF7A7B"
                    value={percentage} // has to be a number
                    onValueChange={(value) => {
                        setPercentage(Number(value)) // parseInt(value)
                    }}
                />

                <Text>{`$${(percentage * assetAmount) / 100}`}</Text>
            </View>
            <View style={styles.apy}>
                <Text>APY</Text>
                {apy > 0 ? <Text>{apy.toFixed(2)}%</Text> : <Text>{apy}%</Text>}
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        display: 'flex',
        flexDirection: 'row',
        backgroundColor: 'transparent',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderRadius: 5,
        width: '95%',
        height: 100,
        margin: 5,
        marginLeft: 20,
        borderBottomWidth: 0.5,
    },
    acronym: {
        fontSize: 10,
        color: 'grey',
    },
    sliderInfo: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        top: 8,
        left: 10,
    },
    slider: {
        width: 300,
        height: 30,
        marginLeft: 30,
    },
    img: {
        flex: 1,
        width: 40,
        resizeMode: 'contain',
    },
    tokenNames: {
        marginLeft: 2,
    },
    tokenInfo: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        height: 40,
        position: 'absolute',
        bottom: 50,
    },
    apy: { bottom: 22, right: 18 },
})

export default TokenInfo
