import React, { Component } from "react";
import PushPresenter from "./PushPresenter";
import client from "../../mqtt";
import { AsyncStorage } from "react-native";

export default class PushContainer extends Component {
  constructor(props) {
    super(props);
    // AsyncStorage.clear();
    // console.log(client);
    // client.subscribe("sensor/#");
    // client.onMessageArrived = this.onMessageArrived;
  

    this.state = {
      // client,
      text: ["..."],
      connect: false,
      currentHeight: 0,
      currentWeight: 0,
      currentTemp: 0,
      currentHeart: 0,
      nutrient: { kcal: 0, carbs: 0, protein: 0, fat: 0 },
      age: 0,
      gender: null,
      height: 0,
      weight: 0,
      activity:null,
      currentPosition: 0,
    };
    this.loadData();
    
    // client.subscribe("sensor/#");
  }

  onPageChange() {
    if (this.state.age === 0) {
      this.setState({ currentPosition: 0 });
    } else if (this.state.age !== 0 && this.state.gender === null) {
      this.setState({ currentPosition: 1 });
    } else if (
      this.state.age !== 0 &&
      this.state.gender !== null &&
      this.state.height === 0
    ) {
      this.setState({ currentPosition: 2 });
    } else if (
      this.state.age !== 0 &&
      this.state.gender !== null &&
      this.state.height !== 0 &&
      this.state.weight === 0
    ) {
      this.setState({ currentPosition: 3 });
    } 
    else if(this.state.age !== 0 &&
      this.state.gender !== null &&
      this.state.height !== 0 &&
      this.state.weight !== 0 &&
      this.state.activity ===null){
        this.setState({currentPosition:4});
    } 
    else {
      this.setState({ currentPosition: 5 });
      AsyncStorage.setItem("CurrentPosition",String(5))
    }
  }

  changeActivity = async(value)=>{
    await this.setState({activity:value});
    this.onPageChange();
    AsyncStorage.setItem("Activity",value);
  }

  changeHeight = async value => {
    await this.setState({ height: value });
    this.onPageChange();
    AsyncStorage.setItem("Height", value);
  };

  changeWeight = async value => {
    await this.setState({ weight: value });
    this.onPageChange();
    AsyncStorage.setItem("Weight", value);
  };

  changeGender = async value => {
    await this.setState({ gender: value });
    this.onPageChange();
    AsyncStorage.setItem("Gender", value);
  };

  changeAge = async value => {
    await this.setState({ age: value});
    this.onPageChange();
    AsyncStorage.setItem("Age", value);
  };

  componentDidMount() {
    const { navigation } = this.props;
    this.focusListener = navigation.addListener("didFocus", () => {
      this.loadData();
    });
  }

  loadData = async () => {
    const Data = await AsyncStorage.getItem("Nut");
    const JsonData = JSON.parse(Data);
    if (await AsyncStorage.getItem("Weight")) {
      this.setState({
        age: await AsyncStorage.getItem("Age"),
        gender: await AsyncStorage.getItem("Gender"),
        height: await AsyncStorage.getItem("Height"),
        weight: await AsyncStorage.getItem("Weight"),
        activity: await AsyncStorage.getItem("Activity"),
        currentPosition:5
      });
      AsyncStorage.setItem("CurrentPosition",String(5))

    }
    if(JsonData){
      this.setState({nutrient:JsonData})
    }else{
      this.setState({nutrient:{kcal:0, carbs: 0, protein: 0, fat: 0}})
    }
  };

  // onConnectionLost = responseObject => {
  //   if (responseObject.errorCode !== 0) {
  //     console.log("connection lost");
  //   }
  // };
  // onConnect = () => {
  //   const { client } = this.state;
  //   console.log("success");
  // };

  // onFailure = error => {
  //   console.log(error);
  //   console.log("fail");
  // };

  // onMessageArrived = message => {
  //   if (message.destinationName === "sensor/height") {
  //     this.updatePayload(`${parseInt(message.payloadString)}`, "height");
  //     // t_height = message.payloadString;
  //     console.log(message.payloadString);
  //   } else if (message.destinationName === "sensor/weight") {
  //     this.updatePayload(`${parseInt(message.payloadString)}`, "weight");
  //     // t_temp = message.payloadString;
  //   } else if (message.destinationName === "sensor/temp") {
  //     this.updatePayload(`${parseInt(message.payloadString)}`, "temp");
  //     // t_dust = message.payloadString;
  //   } else if (message.destinationName === "sensor/heart") {
  //     this.updatePayload(`${parseInt(message.payloadString)}`, "heart");
  //     // t_dust = message.payloadString;
  //   }
  // };
  // updatePayload = (Message, topic) => {
  //   const Current = {
  //     Data: ({
  //       currentHeight,
  //       currentWeight,
  //       currentTemp,
  //       currentHeart,
  //     } = this.state),
  //   };
  //   if (topic === "height") {
  //     if (Current.Data.currentHeight !== Message) {
  //       this.setState({
  //         currentHeight: Message,
  //       });
  //     }
  //   }
  //   if (topic === "weight") {
  //     if (Current.Data.currentWeight !== Message) {
  //       this.setState({
  //         currentWeight: Message,
  //       });
  //     }
  //   }
  //   if (topic === "temp") {
  //     if (Current.Data.currentTemp !== Message) {
  //       this.setState({
  //         currentTemp: Message,
  //       });
  //     }
  //   }
  //   if (topic === "heart") {
  //     if (Current.Data.currentHeart !== Message) {
  //       this.setState({
  //         currentHeart: Message,
  //       });
  //     }
  //   }
  // };
  render() {
    const {
      text,
      client,
      connect,
      currentHeight,
      currentWeight,
      currentTemp,
      currentHeart,
      nutrient,
      age,
      gender,
      height,
      weight,
      activity,
      currentPosition,
    } = this.state;
    
    return (
      <PushPresenter
        BMR={
          gender === "남성"
            ? Math.floor(66 + 13.7 * weight + 5 * height - 6.8 * age)
            : Math.floor(655.1 + 9.56 * weight + 1.85 * height - 4.68 * age)
        }
        age={age}
        gender={gender}
        height={height}
        weight={weight}
        activity={activity}
        changeAge={this.changeAge}
        changeGender={this.changeGender}
        changeHeight={this.changeHeight}
        changeWeight={this.changeWeight}
        changeActivity={this.changeActivity}
        loadData={this.loadData}
        nutrient={nutrient}
        Subconsole={this.Subconsole}
        refresh={this.refresh}
        text={this.text}
        currentHeight={currentHeight}
        currentWeight={currentWeight}
        currentTemp={currentTemp}
        currentHeart={currentHeart}
        currentPosition={currentPosition}
      />
    );
  }
}
