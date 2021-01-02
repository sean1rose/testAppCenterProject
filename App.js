/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React from 'react';
import Crashes from 'appcenter-crashes';
import Analytics from 'appcenter-analytics';
import {
  SafeAreaView,
  StyleSheet,
  ScrollView,
  View,
  Text,
  StatusBar,
  Button,
  TextInput,
  Alert
} from 'react-native';

import {
  Header,
  LearnMoreLinks,
  Colors,
  DebugInstructions,
  ReloadInstructions,
} from 'react-native/Libraries/NewAppScreen';

import NotificationService from './src/services/NotificationService';

export default class App extends React.Component {
  constructor() {
    super();
    this.state = {
      inflationRate: 0.0,
      riskFreeRate: 0.0,
      amount: 0.0,
      timeInYears: 1,
      afterInflation: 0.0,
      atRiskFree: 0.0,
      atRiskFreeAfterInflation: 0.0,
      difference: 0,
    };
    this.checkPrevSession();
    this.notification = new NotificationService(this.onNotification);
  }

  onNotification = (note) => {
    Alert.alert(note.title, note.message);
  }

  handlePerm(perms) {
    Alert.alert("Permissions", JSON.stringify(perms));
  }

  calculateInflationImpact(value, inflationRate, time) {
    return value / Math.pow(1 + inflationRate, time);
  }

  calculate() {
    afterInflation = this.calculateInflationImpact(
      this.state.amount,
      this.state.inflationRate / 100,
      this.state.timeInYears,
    );
    atRiskFree =
      this.state.amount *
      Math.pow(1 + this.state.riskFreeRate / 100, this.state.timeInYears);
    atRiskFreeAfterInflation = this.calculateInflationImpact(
      atRiskFree,
      this.state.inflationRate / 100,
      this.state.timeInYears,
    );
    difference = atRiskFreeAfterInflation - afterInflation;

    this.setState({
      afterInflation,
      atRiskFree,
      atRiskFreeAfterInflation,
      difference,
    });
  }

  async checkPrevSession() {
    const didCrash = await Crashes.hasCrashedInLastSession();
    if (didCrash) {
      const report = await Crashes.lastSessionCrashReport();
      alert("Sorry about that crash, we're working on a solution.");
    }
  }
  render() {
    return (
      <View style={{backgroundColor: 'white'}}>
        <Button
          title={'SPACE'}
          onPress={() => {
            this.notification.localNotification();
          }}
        />
        <Button
          title={'Local Notification'}
          onPress={() => {
            this.notification.localNotification();
          }}
        />
        <Button
          title={'Sceduled 30s Notification'}
          onPress={() => {
            this.notification.scheduleNotification();
          }}
        />
      </View>

    );
  }
};

const styles = StyleSheet.create({
  container: {
    marginTop: 40,
  },
  scrollView: {
    backgroundColor: Colors.lighter,
  },
  engine: {
    position: 'absolute',
    right: 0,
  },
  body: {
    backgroundColor: Colors.white,
  },
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
    color: Colors.black,
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
    color: Colors.dark,
  },
  highlight: {
    fontWeight: '700',
  },
  footer: {
    color: Colors.dark,
    fontSize: 12,
    fontWeight: '600',
    padding: 4,
    paddingRight: 12,
    textAlign: 'right',
  },
});

