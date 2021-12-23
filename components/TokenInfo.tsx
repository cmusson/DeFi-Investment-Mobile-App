/* eslint-disable no-nested-ternary */
import React, { SetStateAction, useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Slider from '@react-native-community/slider';
import { Svg, Path } from 'react-native-svg';

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
});

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

const TokenInfo: React.FunctionComponent<IProps> = function ({
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
}: IProps) {
  const [startValue, setStartValue] = useState(percentage);
  const apy = data[tokenAcronym];

  useEffect(() => {
    calculate(assetAmount);
  }, [percentage]);

  // fix half integer values
  const cleanUp = () => {
    if (previous1 < 0) {
      setPercentage1(0);
    }
    if (previous2 < 0) {
      setPercentage2(0);
    }
  };

  // allocates % of remaining two currencies based on user input
  const assignPercentages = (value: number) => {
    const percentChange = (startValue - value) / 2;
    const distribute1 = previous1 + percentChange;
    const distribute2 = previous2 + percentChange;
    if (distribute1 < 0) {
      const change = distribute1 + percentChange;
      setPercentage2(Math.ceil(previous2 + change));
      setPercentage1(0);
    }
    if (distribute2 < 0) {
      setPercentage2(0);
      const change = distribute2 + percentChange;
      setPercentage1(Math.floor(previous1 + change));
    }
    if (distribute2 > 0 && distribute1 > 0) {
      setPercentage1(previous1 + Math.floor(percentChange));
      setPercentage2(previous2 + Math.ceil(percentChange));
    }
    cleanUp();
  };

  // sets inital % for calculating the difference
  const onStart = (value: number) => {
    setStartValue(value);
  };

  return (
    <View style={styles.container}>
      <View style={styles.tokenInfo}>
        <View>
          {tokenAcronym === 'DAI' ? (
            <Svg style={styles.img} width="32" height="32" viewBox="0 0 32 32" fill="none">
              <Path d="M16 32C24.8366 32 32 24.8366 32 16C32 7.16344 24.8366 0 16 0C7.16344 0 0 7.16344 0 16C0 24.8366 7.16344 32 16 32Z" fill="#F4B731" />
              <Path fillRule="evenodd" clipRule="evenodd" d="M9.277 8H15.829C19.814 8 22.835 10.116 23.959 13.194H26V15.055H24.389C24.42 15.349 24.436 15.649 24.436 15.953V15.999C24.436 16.341 24.416 16.679 24.376 17.009H26V18.869H23.92C22.767 21.905 19.77 24 15.83 24H9.277V18.869H7V17.009H9.277V15.055H7V13.195H9.277V8ZM11.108 18.869V22.331H15.828C18.742 22.331 20.906 20.944 21.913 18.869H11.108ZM22.474 17.009H11.108V15.055H22.478C22.519 15.362 22.541 15.677 22.541 15.999V16.044C22.541 16.373 22.518 16.694 22.474 17.008V17.009ZM15.83 9.665C18.756 9.665 20.927 11.089 21.928 13.193H11.108V9.666H15.828L15.83 9.665Z" fill="white" />
            </Svg>
          ) : tokenAcronym === 'USDC' ? (
            <Svg width="32" height="32" viewBox="0 0 32 32" fill="none">
              <Path d="M16 32C24.8366 32 32 24.8366 32 16C32 7.16344 24.8366 0 16 0C7.16344 0 0 7.16344 0 16C0 24.8366 7.16344 32 16 32Z" fill="#2775C9" />
              <Path d="M15.75 27.5C9.26 27.5 4 22.24 4 15.75C4 9.26 9.26 4 15.75 4C22.24 4 27.5 9.26 27.5 15.75C27.5 18.8663 26.2621 21.855 24.0585 24.0585C21.855 26.2621 18.8663 27.5 15.75 27.5ZM15.05 11.39C14.4071 11.4219 13.7994 11.6929 13.3461 12.1499C12.8928 12.6069 12.6267 13.2169 12.6 13.86C12.6 15.07 13.34 15.86 14.91 16.19L16.01 16.45C17.08 16.7 17.52 17.06 17.52 17.67C17.52 18.28 16.75 18.88 15.75 18.88C15.3948 18.9126 15.0376 18.8445 14.7193 18.6836C14.401 18.5226 14.1344 18.2753 13.95 17.97C13.8954 17.8541 13.8091 17.7561 13.7012 17.6871C13.5933 17.6181 13.4681 17.581 13.34 17.58H12.75C12.7046 17.5884 12.6614 17.6057 12.6227 17.6309C12.584 17.6561 12.5507 17.6887 12.5247 17.7268C12.4987 17.7649 12.4805 17.8077 12.4711 17.8529C12.4617 17.8981 12.4613 17.9447 12.47 17.99C12.6137 18.5766 12.9479 19.0989 13.4201 19.4753C13.8924 19.8517 14.4762 20.0608 15.08 20.07V20.91C15.08 21.097 15.1543 21.2763 15.2865 21.4085C15.4187 21.5407 15.598 21.615 15.785 21.615C15.972 21.615 16.1513 21.5407 16.2835 21.4085C16.4157 21.2763 16.49 21.097 16.49 20.91V20.06C17.1728 20.0523 17.8256 19.7783 18.3093 19.2964C18.7931 18.8145 19.0696 18.1627 19.08 17.48C19.08 16.21 18.35 15.48 16.62 15.11L15.62 14.89C14.62 14.64 14.15 14.31 14.15 13.75C14.15 13.19 14.75 12.57 15.75 12.57C16.0649 12.5371 16.3827 12.5961 16.6648 12.7398C16.947 12.8836 17.1815 13.1059 17.34 13.38C17.4043 13.5169 17.506 13.6328 17.6334 13.7142C17.7609 13.7956 17.9088 13.8392 18.06 13.84H18.53C18.6369 13.8139 18.7292 13.7468 18.7872 13.6533C18.8451 13.5598 18.8641 13.4473 18.84 13.34C18.7045 12.7984 18.4015 12.3135 17.9741 11.9543C17.5467 11.5952 17.0168 11.3802 16.46 11.34V10.65C16.46 10.463 16.3857 10.2837 16.2535 10.1515C16.1213 10.0193 15.942 9.945 15.755 9.945C15.568 9.945 15.3887 10.0193 15.2565 10.1515C15.1243 10.2837 15.05 10.463 15.05 10.65V11.39ZM6.94 15.75C6.94115 17.5921 7.52097 19.3872 8.59759 20.8819C9.6742 22.3766 11.1932 23.4953 12.94 24.08H13.08C13.1993 24.08 13.3138 24.0326 13.3982 23.9482C13.4826 23.8638 13.53 23.7493 13.53 23.63V23.42C13.5303 23.2339 13.4754 23.0518 13.3721 22.8969C13.2689 22.742 13.122 22.6213 12.95 22.55C11.5896 22.0009 10.4243 21.0578 9.60378 19.8417C8.78323 18.6256 8.34481 17.192 8.34481 15.725C8.34481 14.258 8.78323 12.8244 9.60378 11.6083C10.4243 10.3922 11.5896 9.4491 12.95 8.9C13.1212 8.83047 13.2677 8.71154 13.371 8.55837C13.4743 8.40521 13.5297 8.22474 13.53 8.04V7.81C13.5306 7.74247 13.515 7.67578 13.4844 7.61558C13.4538 7.55538 13.4091 7.50346 13.3541 7.4642C13.2992 7.42495 13.2356 7.39953 13.1687 7.39009C13.1018 7.38066 13.0337 7.38749 12.97 7.41C11.216 7.99009 9.6893 9.10811 8.60683 10.6052C7.52437 12.1024 6.94115 13.9025 6.94 15.75ZM24.56 15.75C24.5568 13.9096 23.976 12.1167 22.8995 10.624C21.823 9.13132 20.3052 8.01414 18.56 7.43H18.41C18.2853 7.43 18.1658 7.47952 18.0777 7.56766C17.9895 7.6558 17.94 7.77535 17.94 7.9V8.05C17.944 8.24287 18.0038 8.43046 18.112 8.59014C18.2202 8.74983 18.3723 8.87481 18.55 8.95C19.9073 9.50071 21.0694 10.4439 21.8876 11.6588C22.7058 12.8738 23.1428 14.3052 23.1428 15.77C23.1428 17.2348 22.7058 18.6662 21.8876 19.8812C21.0694 21.0961 19.9073 22.0393 18.55 22.59C18.3757 22.666 18.2267 22.79 18.1205 22.9477C18.0142 23.1053 17.9551 23.29 17.95 23.48V23.65C17.9509 23.7241 17.9692 23.797 18.0036 23.8627C18.038 23.9284 18.0875 23.985 18.148 24.0279C18.2084 24.0708 18.2782 24.0988 18.3515 24.1096C18.4249 24.1204 18.4997 24.1137 18.57 24.09C20.3166 23.5031 21.8345 22.3821 22.9094 20.8856C23.9843 19.389 24.5617 17.5925 24.56 15.75Z" fill="white" />
            </Svg>
          ) : (
            <Svg width="32" height="32" viewBox="0 0 32 32" fill="none">
              <Path d="M16 32C24.8366 32 32 24.8366 32 16C32 7.16344 24.8366 0 16 0C7.16344 0 0 7.16344 0 16C0 24.8366 7.16344 32 16 32Z" fill="#26A17B" />
              <Path fill-rule="evenodd" clip-rule="evenodd" d="M17.622 17.564V17.562C17.512 17.57 16.945 17.604 15.68 17.604C14.67 17.604 13.959 17.574 13.709 17.562V17.565C9.821 17.394 6.919 16.717 6.919 15.907C6.919 15.098 9.821 14.421 13.709 14.247V16.891C13.963 16.909 14.691 16.952 15.697 16.952C16.904 16.952 17.509 16.902 17.622 16.892V14.249C21.502 14.422 24.397 15.099 24.397 15.907C24.397 16.717 21.502 17.392 17.622 17.564ZM17.622 13.974V11.608H23.036V8H8.295V11.608H13.709V13.973C9.309 14.175 6 15.047 6 16.091C6 17.135 9.309 18.006 13.709 18.209V25.791H17.622V18.207C22.015 18.005 25.316 17.134 25.316 16.091C25.316 15.048 22.015 14.177 17.622 13.974Z" fill="white" />
            </Svg>
          )}
        </View>

        <View style={styles.tokenNames}>
          <Text>{tokenName}</Text>
          <Text style={styles.acronym}>{tokenAcronym}</Text>
        </View>
      </View>

      <View style={styles.sliderInfo}>
        <Text>{`${percentage}%`}</Text>

        <Slider
          onSlidingStart={(value) => {
            onStart(value);
            getData();
          }}
          onSlidingComplete={(value) => {
            assignPercentages(value);
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
            setPercentage(Number(value)); // parseInt(value)
          }}
        />

        <Text>{`${(percentage * assetAmount) / 100}`}</Text>
      </View>
      <View style={styles.apy}>
        <Text>APY</Text>
        {apy > 0 ? (
          <Text>
            {apy.toFixed(2)}
            %
          </Text>
        ) : (
          <Text>
            {apy}
            %
          </Text>
        )}
      </View>
    </View>
  );
};

export default TokenInfo;
